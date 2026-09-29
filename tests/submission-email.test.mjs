import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
const require=createRequire(import.meta.url);
function load(name){const module={exports:{}};vm.runInNewContext(ts.transpileModule(readFileSync(new URL('../src/lib/'+name+'.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,require:n=>n.startsWith('./')?load(n.slice(2)):require(n)});return module.exports;}
const {renderSubmissionEmail,emailSections}=load('submission-email');
const p=load('garden-planner');
const inquiry=load('project-inquiry');
const base={id:'test-id',name:'SYSTEMTEST <Name>',email:'qa@example.invalid',phone:'012345'};
const admin='https://example.invalid/admin';
test('contact and application emails preserve line breaks with real HTML and escape user content',()=>{
 for(const application of [false,true]){
 const result=renderSubmissionEmail({...base,subject:'Frage',message:'Erste Zeile\nZweite <script>Zeile</script>\n\nLetzter Absatz'},application,application?'Gärtner:in':'',['Lebenslauf.pdf'],admin);
 assert.match(result.html,/<table/);assert.match(result.html,/Erste Zeile<br>Zweite &lt;script&gt;Zeile&lt;\/script&gt;<br><br>Letzter Absatz/);assert.ok(!result.html.includes('white-space:pre-wrap'));assert.ok(!result.html.includes('<script>'));assert.ok(result.text.includes('012345'));assert.ok(result.text.includes('Lebenslauf.pdf'));assert.ok(result.html.includes(application?'Bewerberkontakt':'Kontakt'));
 }
});
test('homepage inquiry separates project, timing and free text without losing multiline content',()=>{
 const payload=inquiry.buildInquiryPayload({...inquiry.INITIAL_INQUIRY,service:'Pflasterarbeiten',name:'SYSTEMTEST',email:'qa@example.invalid',phone:'123',area:'35',timeframe:'1–3 Monate',budget:'10.000 – 25.000 €',zip:'65795',channel:'Telefon',description:'Terrasse\nBudget: nur ein Text im Freitext\n\nWeiterer Absatz',consent:true});
 const {sections,channel}=emailSections({...base,...payload},false);assert.equal(channel,'Telefon');assert.equal(sections.length,3);assert.equal(sections[0].rows.find(([k])=>k==='Fläche')[1],'35 m²');assert.equal(sections[1].rows.find(([k])=>k==='Budget')[1],'10.000 – 25.000 €');assert.equal(sections[2].text,'Terrasse\nBudget: nur ein Text im Freitext\n\nWeiterer Absatz');
});
test('largest garden briefing retains every answer in structured sections and preserves multiline notes',()=>{
 const state=structuredClone(p.INITIAL_PLANNER);Object.assign(state,{services:p.TRADES.map(t=>t.id),clientType:'Privat',zip:'65795',city:'Hattersheim',name:'SYSTEMTEST',email:'qa@example.invalid',consent:true,notes:'Wunsch 1\nWunsch 2\n\nRAHMEN\nDas ist weiterhin Freitext.'});
 for(const trade of p.TRADES)state.details[trade.id]=Object.fromEntries(trade.questions.map(q=>[q.id,q.options?q.options[0]:String(Math.min(q.max,20))]));
 for(const [key,qs] of [['site',p.SITE_QUESTIONS],['frame',p.FRAME_QUESTIONS]])state[key]=Object.fromEntries(qs.map(q=>[q.id,q.options[0]]));
 const record={...base,...p.buildPlannerPayload(state)};const parsed=emailSections(record,false);const result=renderSubmissionEmail(record,false,'',[],admin);
 for(const section of p.plannerSummary(state))for(const [label,value] of section.rows){assert.ok(result.text.includes(value),label);}
 assert.equal(parsed.sections.length,p.plannerSummary(state).length);assert.equal(parsed.sections.at(-1).text,state.notes);assert.equal(parsed.channel,'E-Mail');assert.ok(result.html.includes('Budget, Termin &amp; Rahmen'));assert.ok(result.html.includes('Wunsch 1<br>Wunsch 2<br><br>RAHMEN'));
});
