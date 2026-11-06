import { test } from "node:test";
import assert from "node:assert/strict";
import { getStartingPoints } from "../lib/start-focus.ts";
import { seedItems } from "../lib/seed.ts";
import type { WorkItem } from "../lib/work-model.ts";

function task(id: string, patch: Partial<WorkItem> = {}): WorkItem {
  return { id, title: id, kind: "task", business: "itad", status: "not-started", owner: "Unassigned", dependsOn: [], why: "Reason", steps: [{ id: `${id}-1`, text: "Do the work", done: false }], acceptance: "Finished result", evidence: [], sources: [], priority: 1, origin: "proposal", approved: false, ...patch };
}

test("first opening has one leading suggestion and at most two alternatives", () => {
  const focus = getStartingPoints(seedItems);
  assert.equal(focus[0].id, "assets-review");
  assert.equal(focus.length, 3);
  assert.ok(focus.every((item) => !item.approved && item.dependsOn.length === 0));
});
test("ready approved work takes precedence over all suggestions", () => {
  const items = [task("suggested"), task("active", { approved: true, status: "in-progress" })];
  assert.deepEqual(getStartingPoints(items).map((item) => item.id), ["active"]);
});
test("approved blocked work does not get replaced with an unrelated suggestion", () => {
  const items = [task("required"), task("blocked", { approved: true, dependsOn: ["required"] }), task("unrelated")];
  assert.deepEqual(getStartingPoints(items), []);
});
test("finishing approved work brings back the next proposal instead of an empty screen", () => {
  const done = task("done", { approved: true, status: "done", steps: [{ id: "done-1", text: "Do the work", done: true }], evidence: [{ id: "proof", title: "Checked result", url: "https://example.com/result", accepted: true, addedAt: "2026-11-06T12:00:00.000Z" }] });
  assert.deepEqual(getStartingPoints([done, task("next")]).map((item) => item.id), ["next"]);
});
test("reported done without proof is sent for review, not counted as finished", () => {
  const item = task("reported", { approved: true, status: "done", reported: true });
  assert.deepEqual(getStartingPoints([item, task("next")]).map((item) => item.id), ["reported"]);
});
test("hidden branches, cancelled tasks, non-leaf tasks and blocked suggestions stay out of focus", () => {
  const items = [task("archived", { kind: "project", status: "archived" }), task("hidden", { parentId: "archived" }), task("cancelled", { status: "cancelled" }), task("parent"), task("leaf", { parentId: "parent" }), task("blocked", { dependsOn: ["leaf"] })];
  assert.deepEqual(getStartingPoints(items).map((item) => item.id), ["leaf"]);
});
