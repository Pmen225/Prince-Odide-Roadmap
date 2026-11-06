import { test } from "node:test";
import assert from "node:assert/strict";
import {
  readDraft,
  writeDraft,
  parseImport,
  exportDraft,
  DRAFT_KEY,
  CURRENT_SEED_PLAN_VERSION,
} from "../lib/storage.ts";
import type { WorkItem } from "../lib/work-model.ts";

const item: WorkItem = {
  id: "goal",
  title: "A clear direction",
  kind: "goal",
  business: "group",
  status: "not-started",
  owner: "Junior",
  dependsOn: [],
  why: "See the path",
  steps: [],
  acceptance: "Review the direction",
  evidence: [],
  sources: [],
  priority: 1,
  origin: "proposal",
  approved: false,
};
function memory() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}
test("draft survives saving and reloading with stable identities", () => {
  const storage = memory();
  assert.equal(readDraft(storage), null);
  assert.equal(writeDraft(storage, [item], 0), 1);
  assert.deepEqual(readDraft(storage)?.items, [item]);
  assert.equal(
    writeDraft(storage, [{ ...item, title: "Revised direction" }], 1),
    2,
  );
  assert.equal(readDraft(storage)?.items[0].title, "Revised direction");
});
test("a second tab cannot silently replace a newer revision", () => {
  const storage = memory();
  writeDraft(storage, [item], 0);
  assert.throws(
    () => writeDraft(storage, [{ ...item, title: "Stale" }], 0),
    /another tab/i,
  );
  assert.equal(readDraft(storage)?.items[0].title, item.title);
});
test("corrupt data stays intact rather than becoming a blank draft", () => {
  const storage = memory();
  storage.setItem(DRAFT_KEY, "broken");
  assert.throws(() => readDraft(storage), /saved draft/i);
  assert.throws(() => writeDraft(storage, [item], 0), /saved draft/i);
  assert.equal(storage.getItem(DRAFT_KEY), "broken");
});
test("export and import round trip; bad schema, script URLs and large input fail", () => {
  assert.deepEqual(parseImport(exportDraft([item])), [item]);
  assert.throws(() => parseImport('{"version":2,"items":[]}'), /version/i);
  assert.throws(() =>
    parseImport(
      JSON.stringify({
        version: 1,
        items: [
          { ...item, sources: [{ label: "bad", url: "javascript:alert(1)" }] },
        ],
      }),
    ),
  );
  assert.throws(() => parseImport("x".repeat(2_000_001)), /large/i);
});

test("legacy draft envelopes remain readable and new drafts record the current plan", () => {
  const legacyStorage = memory();
  legacyStorage.setItem(DRAFT_KEY, JSON.stringify({ version: 1, revision: 1, savedAt: "2026-11-06T12:00:00.000Z", items: [item] }));
  assert.equal(readDraft(legacyStorage)!.seedPlanVersion, undefined);
  assert.deepEqual(readDraft(legacyStorage)!.items, [item]);
  const newStorage = memory();
  writeDraft(newStorage, [item], 0);
  assert.equal(readDraft(newStorage)!.seedPlanVersion, CURRENT_SEED_PLAN_VERSION);
  assert.equal(JSON.parse(exportDraft([item])).seedPlanVersion, CURRENT_SEED_PLAN_VERSION);
});

test("migration version survives edits and deletion without changing conflict checks", () => {
  const storage = memory();
  writeDraft(storage, [item], 0, 2);
  assert.equal(readDraft(storage)!.seedPlanVersion, 2);
  writeDraft(storage, [item], 1, 3);
  writeDraft(storage, [], 2);
  assert.equal(readDraft(storage)!.seedPlanVersion, 3);
  assert.deepEqual(readDraft(storage)!.items, []);
  assert.throws(() => writeDraft(storage, [item], 2, 1), /another tab/i);
  assert.equal(readDraft(storage)!.seedPlanVersion, 3);
});

test("future seed versions are preserved and invalid metadata cannot replace a draft", () => {
  const storage = memory();
  writeDraft(storage, [item], 0, 4);
  writeDraft(storage, [item], 1);
  assert.equal(readDraft(storage)!.seedPlanVersion, 4);
  const before = storage.getItem(DRAFT_KEY);
  assert.throws(() => writeDraft(storage, [], 2, 0), /plan version/i);
  assert.equal(storage.getItem(DRAFT_KEY), before);
  storage.setItem(DRAFT_KEY, JSON.stringify({ version: 1, revision: 3, savedAt: "2026-11-06T12:00:00.000Z", seedPlanVersion: "3", items: [item] }));
  const invalid = storage.getItem(DRAFT_KEY);
  assert.throws(() => readDraft(storage), /saved draft/i);
  assert.equal(storage.getItem(DRAFT_KEY), invalid);
});
