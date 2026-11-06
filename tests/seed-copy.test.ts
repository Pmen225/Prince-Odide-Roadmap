import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seedItems } from '../lib/seed.ts';
import { seedV1Items } from '../lib/seed-v1.ts';
import { seedV2Items } from '../lib/seed-v2.ts';
import { refreshSeedCopy } from '../lib/seed-copy-migration.ts';
import { getPriorities, getProgress, validateWorkspace, type WorkItem } from '../lib/work-model.ts';
import { readDraft, writeDraft, parseImport, exportDraft, DRAFT_KEY } from '../lib/storage.ts';

const oldTask = () => structuredClone(seedV2Items.find(item => item.id === 'assets-review')!);
function memory() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
}

test('the sales plan has separate identities and does not claim business progress', () => {
  const current = validateWorkspace(seedItems);
  assert.ok(current.length > 0);
  assert.ok(current.every(item => item.id.startsWith('sales-')));
  assert.equal(current.some(item => seedV2Items.some(previous => previous.id === item.id)), false);
  for (const item of current) {
    assert.equal(item.approved, false);
    assert.equal(item.origin, 'proposal');
    assert.equal(['in-progress', 'done'].includes(item.status), false);
    assert.deepEqual(item.evidence, []);
    assert.ok(item.steps.every(step => !step.done));
  }
  assert.deepEqual(getPriorities(current, 'all'), []);
  assert.deepEqual(getProgress(current, 'all'), { verified: 0, total: 0, percent: null });
});

for (const [version, seed] of [[1, seedV1Items], [2, seedV2Items]] as const) {
  test('an untouched v' + version + ' draft receives the sales plan without mutating its data', () => {
    const original = validateWorkspace(seed);
    const before = structuredClone(original);
    const refreshed = refreshSeedCopy(original, version);
    assert.deepEqual(refreshed.updatedIds, seedItems.map(item => item.id));
    assert.deepEqual(refreshed.items, seedItems);
    assert.equal(refreshed.seedPlanVersion, 3);
    assert.deepEqual(original, before);
    assert.notEqual(refreshed.items[0], seedItems[0]);
    assert.doesNotThrow(() => validateWorkspace(refreshed.items));
  });
}

test('a mixed v1/v2 but otherwise untouched draft also migrates without a version field', () => {
  const mixedCopies = seedV1Items.map((item, index) => structuredClone(index % 2 ? seedV2Items[index] : item));
  assert.deepEqual(refreshSeedCopy(mixedCopies).items, seedItems);
});

test('migration is idempotent and preserves already-current or edited sales tasks', () => {
  const first = refreshSeedCopy(validateWorkspace(seedV2Items));
  const second = refreshSeedCopy(first.items, first.seedPlanVersion);
  assert.deepEqual(second.updatedIds, []);
  assert.equal(second.items, first.items);
  const edited = first.items.map((item, index) => index ? item : { ...item, title: 'My chosen customer goal' });
  assert.equal(refreshSeedCopy(edited).items, edited);
});

test('every user edit, working state and approval preserves the entire old graph', () => {
  const edits: Partial<WorkItem>[] = [
    { title: 'My own task title' },
    { why: 'My own reason' },
    { acceptance: 'My own finish condition' },
    { approved: true },
    { status: 'in-progress' },
    { status: 'done' },
    { status: 'archived' },
    { status: 'cancelled' },
    { owner: 'Junior' },
    { owner: 'Agent' },
    { owner: 'Review needed' },
    { origin: 'user' },
    { business: 'group' },
    { kind: 'project' },
    { priority: 2 },
    { parentId: 'offer-project' },
    { dependsOn: ['offer'] },
    { sources: [{ label: 'My source', url: 'https://example.com/source' }] },
    { steps: oldTask().steps.map((step, index) => index === 0 ? { ...step, done: true } : step) },
    { steps: oldTask().steps.map((step, index) => index === 0 ? { ...step, text: 'My step' } : step) },
    { steps: [...oldTask().steps].reverse() },
    { steps: [] },
    { evidence: [{ id: 'proof', title: 'My record', url: 'https://example.com/proof', accepted: false, addedAt: '2026-11-06T12:00:00Z' }] },
    { reported: true },
    { reported: false },
    { due: '2026-12-01' },
  ];
  for (const patch of edits) {
    const input = structuredClone(seedV2Items);
    const editedIndex = input.findIndex(item => item.id === 'assets-review');
    input[editedIndex] = { ...input[editedIndex], ...patch };
    const before = structuredClone(input);
    const refreshed = refreshSeedCopy(input, 2);
    assert.deepEqual(refreshed.updatedIds, seedItems.map(item => item.id));
    assert.deepEqual(refreshed.items.slice(0, seedItems.length), seedItems);
    assert.deepEqual(refreshed.items.slice(seedItems.length), before, 'must preserve ' + Object.keys(patch).join(', '));
    assert.equal(refreshed.items[seedItems.length + editedIndex], input[editedIndex]);
    assert.deepEqual(input, before);
    assert.doesNotThrow(() => validateWorkspace(refreshed.items));
    assert.equal(refreshSeedCopy(refreshed.items, refreshed.seedPlanVersion).items, refreshed.items);
  }
});

test('custom links retain their parents, prerequisites, children and original meaning', () => {
  const legacy = structuredClone(seedV2Items);
  const custom: WorkItem = { ...oldTask(), id: 'my-task', title: 'My custom task', origin: 'user', parentId: 'delivery-review', dependsOn: ['delivery-process'] };
  const input = [...legacy, custom];
  const next = refreshSeedCopy(input, 2);
  assert.deepEqual(next.items.slice(seedItems.length), input);
  assert.equal(next.items.at(-1), custom);
  assert.doesNotThrow(() => validateWorkspace(next.items));
  for (const item of input) assert.equal(next.items.find(candidate => candidate.id === item.id), item);
});

test('empty, custom-only and incomplete legacy workspaces are not repopulated', () => {
  const custom: WorkItem = { ...oldTask(), id: 'my-task', parentId: undefined, origin: 'user' };
  for (const input of [[], [custom], [oldTask()], seedV2Items.filter(item => item.id !== 'devicecare-gate')]) {
    const next = refreshSeedCopy(input);
    assert.equal(next.items, input);
    assert.deepEqual(next.updatedIds, []);
    assert.equal(next.seedPlanVersion, 3);
  }
});

test('an existing sales identity is never overwritten or duplicated', () => {
  const collision: WorkItem = { ...oldTask(), id: seedItems[0].id, parentId: undefined, title: 'User-owned record', origin: 'user' };
  const input = [...structuredClone(seedV2Items), collision];
  const next = refreshSeedCopy(input, 2);
  assert.equal(next.items, input);
  assert.deepEqual(next.updatedIds, []);
});

test('deleting every new task from a mixed migrated plan does not resurrect the plan', () => {
  const legacy = structuredClone(seedV2Items);
  legacy[0].why = 'My retained company goal';
  const migrated = refreshSeedCopy(legacy, 2);
  const storage = memory();
  writeDraft(storage, migrated.items, 0, migrated.seedPlanVersion);
  const newIds = new Set(seedItems.map(item => item.id));
  const afterDelete = migrated.items.filter(item => !newIds.has(item.id));
  writeDraft(storage, afterDelete, 1);
  const saved = readDraft(storage)!;
  assert.equal(saved.seedPlanVersion, 3);
  const next = refreshSeedCopy(saved.items, saved.seedPlanVersion);
  assert.deepEqual(next.items, legacy);
  assert.deepEqual(next.updatedIds, []);
});

test('current and future plan versions are not reseeded even if their items look old', () => {
  for (const version of [3, 4]) {
    const input = structuredClone(seedV2Items);
    const next = refreshSeedCopy(input, version);
    assert.equal(next.items, input);
    assert.deepEqual(next.updatedIds, []);
    assert.equal(next.seedPlanVersion, version);
  }
});

test('object property order does not hide an unchanged legacy plan', () => {
  const reordered = seedV2Items.map(item => {
    const record = Object.fromEntries(Object.entries(item).reverse()) as WorkItem;
    record.steps = record.steps.map(step => Object.fromEntries(Object.entries(step).reverse()) as typeof step);
    return record;
  });
  assert.deepEqual(refreshSeedCopy(reordered).items, seedItems);
});

test('a migrated plan saves with revision conflict protection and exports intact', () => {
  const storage = memory();
  writeDraft(storage, seedV2Items, 0, 2);
  const rawBefore = storage.getItem(DRAFT_KEY);
  const saved = readDraft(storage)!;
  const refreshed = refreshSeedCopy(saved.items, saved.seedPlanVersion);
  assert.equal(storage.getItem(DRAFT_KEY), rawBefore);
  assert.equal(saved.revision, 1);
  assert.equal(writeDraft(storage, refreshed.items, saved.revision, refreshed.seedPlanVersion), 2);
  assert.deepEqual(readDraft(storage)!.items, seedItems);
  assert.deepEqual(parseImport(exportDraft(refreshed.items)), seedItems);
  assert.throws(() => writeDraft(storage, refreshed.items, saved.revision), /another tab/i);
});

test('a deliberately imported older plan remains exactly as imported after reload', () => {
  const storage = memory();
  const imported = parseImport(exportDraft(seedV1Items));
  assert.deepEqual(imported, seedV1Items);
  writeDraft(storage, imported, 0);
  const saved = readDraft(storage)!;
  const reloaded = refreshSeedCopy(saved.items, saved.seedPlanVersion);
  assert.deepEqual(reloaded.items, imported);
  assert.deepEqual(reloaded.updatedIds, []);
});

test('a mixed workspace stays valid at the item limit and is unchanged above it', () => {
  const input = structuredClone(seedV2Items);
  while (input.length < 1000 - seedItems.length) {
    input.push({ ...oldTask(), id: 'custom-' + input.length, origin: 'user' });
  }
  const atLimit = refreshSeedCopy(input, 2);
  assert.equal(atLimit.items.length, 1000);
  assert.doesNotThrow(() => validateWorkspace(atLimit.items));
  input.push({ ...oldTask(), id: 'one-more-custom', origin: 'user' });
  assert.doesNotThrow(() => validateWorkspace(input));
  const overLimit = refreshSeedCopy(input, 2);
  assert.equal(overLimit.items, input);
  assert.deepEqual(overLimit.updatedIds, []);
  assert.equal(overLimit.seedPlanVersion, 3);
});

test('a mixed workspace near 2 MB loads unchanged when new suggestions do not fit', () => {
  const input = structuredClone(seedV2Items);
  for (;;) {
    const next: WorkItem = { ...oldTask(), id: 'large-custom-' + input.length, origin: 'user', why: 'x'.repeat(9000) };
    if (Buffer.byteLength(JSON.stringify([...input, next]), 'utf8') > 2_000_000) break;
    input.push(next);
  }
  assert.ok(input.length < 1000);
  assert.doesNotThrow(() => validateWorkspace(input));
  assert.ok(Buffer.byteLength(JSON.stringify([...seedItems, ...input]), 'utf8') > 2_000_000);
  const refreshed = refreshSeedCopy(input, 2);
  assert.equal(refreshed.items, input);
  assert.deepEqual(refreshed.updatedIds, []);
  assert.equal(refreshed.seedPlanVersion, 3);
});
