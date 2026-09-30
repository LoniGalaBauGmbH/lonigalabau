import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
const require = createRequire(import.meta.url);
function load(name) {
  const module = { exports: {} };
  const { outputText } = ts.transpileModule(readFileSync(new URL("../src/lib/" + name + ".ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  vm.runInNewContext(outputText, { module, exports: module.exports, Buffer, console, require: id => id.startsWith("./") ? load(id.slice(2)) : require(id) });
  return module.exports;
}
const { persistApplicationSubmission } = load("application-submission.server");
const { validateApplicationDocument, MAX_APPLICATION_BYTES } = load("application-document");
const application = { job_id: "11111111-1111-4111-8111-111111111111", name: "Systemtest", email: "qa@example.invalid", phone: "0123456", message: "Testnachricht", document: { name: "Unterlagen.pdf", contentType: "application/pdf", base64: Buffer.from("%PDF-1.7\n").toString("base64") } };
function harness({ inactive = false, insertError = false, uploadError = false } = {}) {
  const uploads = [], records = [], removed = [];
  const bucket = { upload: async (...args) => { uploads.push(args); return { error: uploadError }; }, remove: async paths => { removed.push(...paths); return {error:null}; } };
  const job = { select: () => job, eq: () => job, maybeSingle: async () => ({ data: inactive ? null : {id:application.job_id}, error:null }) };
  return { uploads, records, removed, client: { storage:{from:()=>bucket}, from:table=>table === "jobs" ? job : { insert:async record=> {records.push(record);return {error:insertError};} } } };
}
test("application saves every field and associates only its freshly uploaded document", async () => {
  const h=harness(); const result=await persistApplicationSubmission(h.client,application);
  assert.equal(h.records[0].ticket_format_version, 2);
  assert.equal(h.records[0].ticket_number, undefined, "database assigns the number");
  assert.equal(h.records[0].id,result.id); assert.equal(h.records[0].phone,application.phone); assert.equal(h.records[0].message,application.message);
  assert.equal(h.records[0].cv_path,h.uploads[0][0]); assert.equal(h.uploads[0][2].metadata.originalName,"Unterlagen.pdf"); assert.equal(h.uploads[0][2].upsert,false);
});
test("applications without documents remain possible",async()=>{const h=harness();await persistApplicationSubmission(h.client,{...application,document:undefined});assert.equal(h.uploads.length,0);assert.equal(h.records[0].cv_path,null);});
test("invalid form, forged PDF, injected existing path and inactive job write nothing",async()=>{
  for(const input of [{...application,email:"bad"},{...application,cv_path:"someone-elses.pdf"},{...application,document:{...application.document,base64:Buffer.from("<html>fake</html>").toString("base64")}}]){const h=harness();await assert.rejects(()=>persistApplicationSubmission(h.client,input));assert.equal(h.uploads.length+h.records.length,0);}
  const h=harness({inactive:true});await assert.rejects(()=>persistApplicationSubmission(h.client,application),/nicht verfügbar/);assert.equal(h.uploads.length,0);
});
test("failed uploads do not create applications; failed inserts clean up the owned PDF",async()=>{
  const failedUpload=harness({uploadError:true});await assert.rejects(()=>persistApplicationSubmission(failedUpload.client,application));assert.equal(failedUpload.records.length,0);
  const failedInsert=harness({insertError:true});await assert.rejects(()=>persistApplicationSubmission(failedInsert.client,application));assert.equal(failedInsert.removed.join(),failedInsert.uploads[0][0]);
});
test("picker rejects Word, empty files and PDFs larger than 10 MB",()=>{
  const file={name:"Unterlagen.pdf",type:"application/pdf",size:100};assert.equal(validateApplicationDocument(file),"");
  assert.match(validateApplicationDocument({...file,name:"test.docx"}),/PDF/);assert.match(validateApplicationDocument({...file,size:0}),/leer/);assert.match(validateApplicationDocument({...file,size:MAX_APPLICATION_BYTES+1}),/10 MB/);
});
