import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const module = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(
    readFileSync(new URL("../src/lib/submission-ticket.ts", import.meta.url), "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
  ).outputText,
  { module, exports: module.exports },
);
const { submissionTicket, matchesSubmissionTicket } = module.exports;
const id = "12345678-abcd-4321-a123-1234abcdef01";

test("compact tickets preserve the prior reference's full 64 bits without number rounding", () => {
  assert.equal(submissionTicket(id), "A-14D2PF2NWVVR1");
  assert.equal(submissionTicket(id.toUpperCase(), true), "B-14D2PF2NWVVR1");
  assert.equal(submissionTicket("00000000-0000-4000-8000-000000000000"), "A-0000000000000");
  assert.equal(submissionTicket("ffffffff-ffff-4fff-8fff-ffffffffffff"), "A-FZZZZZZZZZZZZ");
  assert.notEqual(
    submissionTicket("ffffffff-ffff-4fff-8fff-ffffffffffff"),
    submissionTicket("ffffffff-ffff-4fff-8fff-fffffffffffe"),
  );
  assert.equal(submissionTicket(id).length, 15);
});

test("admin search accepts compact, previously emailed and full UUID references for both forms", () => {
  for (const application of [false, true]) {
    const prefix = application ? "B" : "A";
    for (const query of [
      submissionTicket(id, application),
      `  ${prefix.toLowerCase()}-14d2pf2nwvvr1  `,
      "14D2PF2N",
      `lg-${prefix.toLowerCase()}-12345678-abcdef01`,
      id,
    ]) assert.ok(matchesSubmissionTicket(id, query, application), query);
    assert.equal(matchesSubmissionTicket(id, `${application ? "A" : "B"}-14D2PF2NWVVR1`, application), false);
    assert.equal(matchesSubmissionTicket(id, "unknown-reference", application), false);
  }
});
