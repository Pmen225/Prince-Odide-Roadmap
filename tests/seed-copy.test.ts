import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seedItems } from '../lib/seed.ts';
import { seedV1Items } from '../lib/seed-v1.ts';
import { refreshSeedCopy } from '../lib/seed-copy-migration.ts';
import { getPriorities, getProgress, validateWorkspace, type WorkItem } from '../lib/work-model.ts';
import { readDraft, writeDraft, parseImport, exportDraft, DRAFT_KEY } from '../lib/storage.ts';

const oldTask = () => structuredClone(seedV1Items.find(item => item.id === 'assets-review')!);

test('concrete copy keeps all seed identities, links, states and source guidance', () => {
  const current = validateWorkspace(seedItems);
  const previous = validateWorkspace(seedV1Items);
  assert.equal(current.length, 26);
  assert.deepEqual(current.map(item => item.id), previous.map(item => item.id));
  for (const item of current) {
    const old = previous.find(candidate => candidate.id === item.id)!;
    assert.equal(item.kind, old.kind);
    assert.equal(item.business, old.business);
    assert.equal(item.parentId, old.parentId);
    assert.deepEqual(item.dependsOn, old.dependsOn);
    assert.deepEqual(item.sources, old.sources);
    assert.deepEqual(item.steps.map(step => step.id), old.steps.map(step => step.id));
    assert.equal(item.approved, false);
    assert.equal(item.origin, 'proposal');
    assert.equal(item.owner, 'Unassigned');
    assert.equal(item.status, 'not-started');
    assert.deepEqual(item.evidence, []);
    assert.equal(item.steps.every(step => !step.done), true);
    assert.doesNotMatch(item.title, /assets|define|expansion gate|delivery evidence|ITAT|iPad/i);
  }
  assert.deepEqual(getPriorities(current, 'all'), []);
  assert.deepEqual(getProgress(current, 'all'), { verified: 0, total: 0, percent: null });
});

test('an untouched original draft receives the new copy without mutating the original', () => {
  const original = validateWorkspace(seedV1Items);
  const before = structuredClone(original);
  const refreshed = refreshSeedCopy(original);
  assert.deepEqual(refreshed.updatedIds, seedItems.map(item => item.id));
  assert.deepEqual(refreshed.items, seedItems);
  assert.deepEqual(original, before);
  assert.notEqual(refreshed.items[0], seedItems[0]);
  assert.match(refreshed.items.find(item => item.id === 'assets-review')!.title, /website, documents and tools/);
  assert.match(refreshed.items.find(item => item.id === 'offer')!.title, /customer will pay for/);
  assert.match(refreshed.items.find(item => item.id === 'revenue-proof')!.title, /sales and payments tracker/);
});

test('copy refresh is idempotent and preserves already-current items', () => {
  const first = refreshSeedCopy(validateWorkspace(seedV1Items));
  const second = refreshSeedCopy(first.items);
  assert.deepEqual(second.updatedIds, []);
  assert.equal(second.items, first.items);
  assert.deepEqual(second.items, seedItems);
});

test('every user edit, working state and approval preserves the whole old item', () => {
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
    const edited = { ...oldTask(), ...patch };
    const input = [edited];
    const before = structuredClone(input);
    const refreshed = refreshSeedCopy(input);
    assert.deepEqual(refreshed.updatedIds, [], `must preserve ${Object.keys(patch).join(', ')}`);
    assert.equal(refreshed.items, input);
    assert.equal(refreshed.items[0], edited);
    assert.deepEqual(input, before);
  }
});

test('mixed workspaces update only pristine items and keep order and custom work', () => {
  const old = validateWorkspace(seedV1Items);
  const custom: WorkItem = { ...oldTask(), id: 'my-task', title: 'My custom task', origin: 'user' };
  const edited = { ...old[3], title: 'Do not change this title' };
  const mixed = [...old.slice(0, 3), edited, ...old.slice(4), custom];
  const next = refreshSeedCopy(mixed);
  assert.equal(next.updatedIds.length, 25);
  assert.equal(next.items[3], edited);
  assert.equal(next.items.at(-1), custom);
  assert.deepEqual(next.items.map(item => item.id), mixed.map(item => item.id));
  assert.doesNotThrow(() => validateWorkspace(next.items));
  assert.deepEqual(refreshSeedCopy([]), { items: [], updatedIds: [] });
});

test('object property order changes do not hide an unchanged original proposal', () => {
  const original = oldTask();
  const reordered = Object.fromEntries(Object.entries(original).reverse()) as WorkItem;
  reordered.steps = reordered.steps.map(step => Object.fromEntries(Object.entries(step).reverse()) as typeof step);
  const next = refreshSeedCopy([reordered]);
  assert.deepEqual(next.updatedIds, [original.id]);
  assert.deepEqual(next.items[0], seedItems.find(item => item.id === original.id));
});

test('a v1 draft can refresh copy and save using the existing revision check', () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
  writeDraft(storage, seedV1Items, 0);
  const rawBefore = storage.getItem(DRAFT_KEY);
  const saved = readDraft(storage)!;
  const refreshed = refreshSeedCopy(saved.items);
  // The helper is pure: callers choose whether to save a refresh.
  assert.equal(storage.getItem(DRAFT_KEY), rawBefore);
  assert.equal(saved.revision, 1);
  assert.equal(writeDraft(storage, refreshed.items, saved.revision), 2);
  assert.deepEqual(readDraft(storage)!.items, seedItems);
  assert.deepEqual(parseImport(exportDraft(refreshed.items)), seedItems);
  assert.throws(() => writeDraft(storage, refreshed.items, saved.revision), /another tab/i);
});
