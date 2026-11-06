import { test } from "node:test";
import assert from "node:assert/strict";
import { visibleWork, mapLinks, arrangeGraph } from "../lib/graph-layout.ts";
import type { WorkItem } from "../lib/work-model.ts";

function item(id: string, patch: Partial<WorkItem> = {}): WorkItem {
  return {
    id,
    title: id,
    kind: "task",
    business: "itad",
    status: "not-started",
    owner: "Junior",
    dependsOn: [],
    why: "A reason",
    steps: [],
    acceptance: "Clear evidence",
    evidence: [],
    sources: [],
    priority: 2,
    origin: "user",
    approved: false,
    ...patch,
  };
}

test("mind map expands a branch without copying records", () => {
  const items = [
    item("goal", { kind: "goal", business: "group" }),
    item("project", { kind: "project", parentId: "goal" }),
    item("task", { parentId: "project" }),
  ];
  assert.deepEqual(
    visibleWork(items, ["goal"], "all", "mind").map((x) => x.id),
    ["goal", "project"],
  );
  assert.equal(
    visibleWork(items, ["goal", "project"], "all", "mind")[2],
    items[2],
  );
});

test("dependency view retains a non-task prerequisite outside the business filter", () => {
  const items = [
    item("delivery", { kind: "project", business: "group" }),
    item("device", { business: "device-care", dependsOn: ["delivery"] }),
    item("customer", { dependsOn: ["device"] }),
  ];
  const visible = visibleWork(items, [], "itad", "dependencies");
  assert.deepEqual(
    visible.map((x) => x.id),
    ["delivery", "device", "customer"],
  );
  assert.equal(mapLinks(visible, "dependencies").length, 2);
});

test("archived branches do not leave active-looking orphans on the map", () => {
  const items = [
    item("root", { kind: "goal", business: "group" }),
    item("archive", { kind: "project", parentId: "root", status: "archived" }),
    item("hidden", { parentId: "archive" }),
  ];
  assert.deepEqual(
    visibleWork(items, ["root", "archive"], "all", "mind").map((x) => x.id),
    ["root"],
  );
});

test("layout returns finite, distinct positions for linked nodes", async () => {
  const items = [
    item("goal", { kind: "goal" }),
    item("child", { parentId: "goal" }),
  ];
  const positions = await arrangeGraph(items, mapLinks(items, "mind"));
  assert.equal(Object.keys(positions).length, 2);
  assert.ok(
    Object.values(positions).every(
      (p) => Number.isFinite(p.x) && Number.isFinite(p.y),
    ),
  );
  assert.ok(positions.child.x > positions.goal.x);
});
