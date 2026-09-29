import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const source=readFileSync(new URL("../src/lib/submission-notification.server.ts",import.meta.url),"utf8");
function harness({sent=false,failed=false,missingKey=false,missingFile=false}={}) {
 const module={exports:{}};const calls=[],updates=[];
 vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,Buffer,AbortSignal,process:{env:missingKey?{}:{RESEND_API_KEY:"test-key",RESEND_FROM:"Website <mail@example.invalid>"}},console:{info(){},error(){}},fetch:async(url,options)=>{calls.push({url,options});return{ok:!failed,status:failed?503:200,json:async()=>({id:"mail-id"})};}});
 const record={id:"11111111-1111-4111-8111-111111111111",name:"<img onerror='bad'>",email:"qa@example.invalid",phone:"123",subject:"Garten\nTest",message:"Wünsche & Maße <script>bad</script>",image_paths:["test.pdf"],notification_sent_at:sent?"2026-09-29":null};
 const query={select:()=>query,eq:()=>query,single:async()=>({data:record,error:null}),update:(data)=>{updates.push(data);return{eq:async()=>({error:null})};}};
 const client={from:()=>query,storage:{from:()=>({download:async()=>({data:missingFile?null:new Blob(["%PDF-1.7 test"]),error:missingFile}),info:async()=>({data:{metadata:{originalName:"Plan.pdf"}}})})}};
 return{...module.exports,client,record,calls,updates};
}
test("notification goes only to the chosen company mailbox and includes all fields and attachment",async()=>{
 const h=harness();await h.notifySavedSubmission(h.client,"contact_requests",h.record.id);const body=JSON.parse(h.calls[0].options.body);
 assert.equal(body.to.join(),"webseite@loni-galabau.de");assert.equal(body.reply_to,h.record.email);assert.match(body.text,/123/);assert.ok(body.text.includes(h.record.message));assert.equal(body.attachments[0].filename,"Plan.pdf");assert.equal(Buffer.from(body.attachments[0].content,"base64").toString(),"%PDF-1.7 test");assert.ok(!body.html.includes("<script>"));assert.ok(!body.subject.includes("\n"));assert.equal(h.calls[0].options.headers["Idempotency-Key"],"contact_requests/"+h.record.id);assert.equal(h.updates.length,1);
});
test("already accepted notification is not sent again",async()=>{const h=harness({sent:true});await h.notifySavedSubmission(h.client,"contact_requests",h.record.id);assert.equal(h.calls.length,0);});
test("missing configuration, unavailable attachments and provider failures leave notifications pending",async()=>{
 for(const config of [{failed:true},{missingKey:true},{missingFile:true}]){const h=harness(config);const result=await h.attemptSubmissionNotification(h.client,"contact_requests",h.record.id);assert.equal(result.sent,false);assert.equal(h.updates.length,0);}
});
