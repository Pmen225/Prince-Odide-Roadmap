import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seedItems } from '../lib/seed.ts';
import {
  getAncestors, getBlockers, getChildren, getDescendants, getPriorities,
  getProgress, isVerified, updateItem, validateDependency, validateParent,
  validateWorkspace, type WorkItem,
} from '../lib/work-model.ts';

function task(id: string, patch: Partial<WorkItem> = {}): WorkItem {
  return {
    id, title: `Work ${id}`, kind: 'task', business: 'itad', status: 'not-started',
    owner: 'Junior', dependsOn: [], why: 'Deliver a checked result',
    steps: [{ id: `${id}-step`, text: 'Do the work', done: false }],
    acceptance: 'The result passes review', evidence: [], sources: [],
    priority: 2, origin: 'user', approved: true, ...patch,
  };
}

function completed(id: string, patch: Partial<WorkItem> = {}): WorkItem {
  return task(id, {
    status: 'done', steps: [{ id: `${id}-step`, text: 'Do the work', done: true }],
    evidence: [{ id: `${id}-proof`, title: 'Review result', url: 'https://example.com/proof', accepted: true, addedAt: '2026-11-05T12:00:00.000Z' }],
    ...patch,
  });
}

test('Done is verified only for approved work with accepted evidence and finished steps', () => {
  assert.equal(isVerified(completed('a')), true);
  assert.equal(isVerified(completed('a', { approved: false })), false);
  assert.equal(isVerified(completed('a', { evidence: [], reported: true })), false);
  assert.equal(isVerified(completed('a', { steps: [{ id: 's', text: 'Check', done: false }] })), false);
  assert.equal(isVerified(completed('a', { status: 'in-progress' })), false);
  assert.equal(isVerified(completed('a', { acceptance: '' })), false);
  assert.equal(isVerified(completed('a', { evidence: [{ id: 'e', title: 'Unaccepted', url: 'https://example.com', accepted: false, addedAt: '2026-11-05T00:00:00Z' }] })), false);
});

test('imports reject impossible evidence calendar dates rather than normalizing them', () => {
  const item = completed('a');
  item.evidence[0].addedAt = '2026-02-30T12:00:00.000Z';
  assert.throws(() => validateWorkspace([item]), /evidence date/i);
});

test('reopening a prerequisite removes downstream verification and changes the ready queue', () => {
  const items = [completed('a'), completed('b', { dependsOn: ['a'] }), task('c', { dependsOn: ['b'] })];
  assert.equal(isVerified(items[1], items), true);
  assert.deepEqual(getPriorities(items, 'all').map(item => item.id), ['c']);
  assert.deepEqual(getProgress(items, 'all'), { verified: 2, total: 3, percent: 67 });
  const reopened = updateItem(items, 'a', { status: 'in-progress' });
  assert.equal(isVerified(reopened[1], reopened), false);
  assert.deepEqual(getBlockers(reopened[1], reopened).map(item => item.id), ['a']);
  assert.deepEqual(getPriorities(reopened, 'all').map(item => item.id), ['a']);
  assert.deepEqual(getProgress(reopened, 'all'), { verified: 0, total: 3, percent: 0 });
  assert.equal(items[0].status, 'done');
});

test('hierarchy traversal is ordered, cycle-safe and does not include the starting item', () => {
  const items = [task('root', { kind: 'goal' }), task('a', { parentId: 'root', kind: 'project' }), task('b', { parentId: 'root' }), task('leaf', { parentId: 'a' })];
  assert.deepEqual(getChildren('root', items).map(item => item.id), ['a', 'b']);
  assert.deepEqual(getAncestors('leaf', items).map(item => item.id), ['a', 'root']);
  assert.deepEqual(getDescendants('root', items).map(item => item.id), ['a', 'b', 'leaf']);
  assert.deepEqual(getAncestors('missing', items), []);
  assert.deepEqual(getDescendants('missing', items), []);
  const broken = [task('a', { parentId: 'b' }), task('b', { parentId: 'a' })];
  assert.deepEqual(getAncestors('a', broken).map(item => item.id), ['b']);
  assert.deepEqual(getDescendants('a', broken).map(item => item.id), ['b']);
});

test('relationship changes reject self, missing, duplicate, cyclic and hierarchy-deadlock edges', () => {
  const items = [task('root', { kind: 'goal' }), task('a', { parentId: 'root' }), task('b', { parentId: 'root', dependsOn: ['a'] }), task('free')];
  assert.equal(validateDependency(items, 'free', 'b'), null);
  assert.match(validateDependency(items, 'a', 'a')!, /itself/i);
  assert.match(validateDependency(items, 'a', 'missing')!, /does not exist/i);
  assert.match(validateDependency(items, 'missing', 'a')!, /does not exist/i);
  assert.match(validateDependency(items, 'b', 'a')!, /already/i);
  assert.match(validateDependency(items, 'a', 'b')!, /cycle/i);
  assert.match(validateDependency(items, 'a', 'root')!, /deadlock/i);
  assert.equal(validateParent(items, 'free', 'root'), null);
  assert.match(validateParent(items, 'root', 'root')!, /own parent/i);
  assert.match(validateParent(items, 'root', 'a')!, /cycle/i);
  assert.match(validateParent(items, 'a', 'missing')!, /does not exist/i);
  assert.match(validateParent(items, 'missing', 'a')!, /does not exist/i);
  assert.match(validateParent(items, 'b', 'a')!, /deadlock/i);
  assert.deepEqual(items[1].dependsOn, []);
  assert.equal(items[3].parentId, undefined);
});

test('progress counts approved active leaf tasks once and includes shared work in each relevant scope', () => {
  const items = [
    completed('shared', { business: 'group' }), completed('itad'), task('device', { business: 'device-care' }),
    task('proposal', { approved: false }), completed('cancelled', { status: 'cancelled' }),
    completed('archived', { status: 'archived' }), completed('parent'), task('leaf', { parentId: 'parent' }),
    task('old-project', { kind: 'project', status: 'archived' }), completed('hidden', { parentId: 'old-project' }),
    completed('milestone', { kind: 'milestone' }),
  ];
  assert.deepEqual(getProgress(items, 'all'), { verified: 2, total: 4, percent: 50 });
  assert.deepEqual(getProgress(items, 'itad'), { verified: 2, total: 3, percent: 67 });
  assert.deepEqual(getProgress(items, 'device-care'), { verified: 1, total: 2, percent: 50 });
  assert.deepEqual(getProgress(items, 'group'), { verified: 1, total: 1, percent: 100 });
  assert.deepEqual(getProgress([task('draft', { approved: false })], 'all'), { verified: 0, total: 0, percent: null });
  assert.deepEqual(getProgress([], 'all'), { verified: 0, total: 0, percent: null });
});

test('parent verification requires its own acceptance evidence as well as approved children', () => {
  const items = [completed('milestone', { kind: 'milestone' }), completed('child', { parentId: 'milestone' }), task('proposal', { parentId: 'milestone', approved: false }), task('cancelled', { parentId: 'milestone', status: 'cancelled' })];
  assert.equal(isVerified(items[0], items), true);
  assert.equal(isVerified({ ...items[0], evidence: [] }, items), false);
  const reopened = updateItem(items, 'child', { status: 'not-started' });
  assert.equal(isVerified(reopened[0], reopened), false);
  const invalidated = updateItem(items, 'child', { evidence: [{ ...items[1].evidence[0], accepted: false }] });
  assert.equal(isVerified(invalidated[0], invalidated), false);
  assert.equal(isVerified(items[0], items), true);
});

test('ready work ranks prerequisites, priority, due date, ITAD focus and stable ID, with a three-item limit', () => {
  const items = [
    task('dependent', { dependsOn: ['prerequisite'], priority: 1 }),
    task('late', { priority: 1, due: '2026-12-01' }),
    task('early-device', { business: 'device-care', priority: 1, due: '2026-11-01' }),
    task('early-itad', { priority: 1, due: '2026-11-01' }),
    task('prerequisite', { priority: 3 }), task('draft', { approved: false, priority: 1 }),
    completed('reported', { evidence: [], reported: true, priority: 1 }),
    task('missing', { dependsOn: ['absent'], priority: 1 }),
    task('cancelled', { status: 'cancelled', priority: 1 }),
  ];
  const original = items.map(item => item.id);
  assert.deepEqual(getPriorities(items, 'all').map(item => item.id), ['prerequisite', 'early-itad', 'early-device']);
  assert.deepEqual(getPriorities(items, 'itad').map(item => item.id), ['prerequisite', 'early-itad', 'late']);
  assert.deepEqual(getPriorities(items, 'device-care').map(item => item.id), ['early-device']);
  assert.deepEqual(getPriorities([task('z'), task('a')], 'all').map(item => item.id), ['a', 'z']);
  assert.deepEqual(items.map(item => item.id), original);
});

test('updates reject false Done claims and unapproved execution without changing stored inputs', () => {
  const items = [task('a'), task('draft', { approved: false })];
  const before = structuredClone(items);
  assert.throws(() => updateItem(items, 'a', { status: 'done' }), /accepted evidence/i);
  assert.throws(() => updateItem(items, 'draft', { status: 'in-progress' }), /approve/i);
  assert.throws(() => updateItem(items, 'draft', { steps: [{ id: 's', text: 'Work', done: true }] }), /approve/i);
  assert.throws(() => updateItem(items, 'a', { id: 'replacement' }), /ID cannot be changed/i);
  assert.throws(() => updateItem(items, 'missing', { title: 'Missing' }), /does not exist/i);
  assert.throws(() => updateItem(items, 'a', { dependsOn: ['a'] }), /itself/i);
  assert.throws(() => updateItem(items, 'a', { parentId: 'missing' }), /does not exist/i);
  const blocked = [task('prerequisite'), completed('b', { status: 'in-progress', dependsOn: ['prerequisite'] })];
  assert.throws(() => updateItem(blocked, 'b', { status: 'done' }), /verified prerequisites/i);
  const done = completed('a');
  const next = updateItem(items, 'a', { status: done.status, steps: done.steps, evidence: done.evidence });
  assert.equal(isVerified(next[0], next), true);
  next[0].steps[0].text = 'Change the returned copy';
  assert.deepEqual(items, before);
  assert.equal(done.steps[0].text, 'Do the work');
});

test('imports preserve valid single goals and reported Done, but reject invalid fields and unsafe links', () => {
  const goal = task('goal', { kind: 'goal', approved: false, steps: [] });
  assert.deepEqual(validateWorkspace([goal]), [goal]);
  assert.deepEqual(validateWorkspace([]), []);
  const reported = completed('reported', { reported: true, evidence: [] });
  const checked = validateWorkspace([reported]);
  assert.equal(checked[0].status, 'done');
  assert.equal(checked[0].reported, true);
  assert.equal(isVerified(checked[0], checked), false);
  const invalid: unknown[] = [
    null, {}, [null], [{ ...goal, title: '' }], [{ ...goal, title: 'x'.repeat(301) }],
    [{ ...goal, approved: 'true' }], [{ ...goal, owner: 'Unknown' }], [{ ...goal, priority: 4 }],
    [{ ...goal, origin: 'import' }], [{ ...goal, business: 'unknown' }], [{ ...goal, status: 'complete' }],
    [{ ...goal, kind: 'step' }], [{ ...goal, extra: true }], [{ ...goal, dependsOn: 'a' }],
    [{ ...goal, steps: [{ id: 's', text: 'Work', done: 1 }] }],
    [{ ...goal, due: '2026-02-30' }], [{ ...goal, due: 'tomorrow' }],
    [{ ...goal, sources: [{ label: 'Script', url: 'javascript:alert(1)' }] }],
    [{ ...goal, sources: [{ label: 'Data', url: 'data:text/html,hello' }] }],
    [{ ...goal, sources: [{ label: 'Credentials', url: 'https://user:secret@example.com' }] }],
    [{ ...goal, sources: [{ label: 'File', url: 'file:///tmp/example' }] }],
    [{ ...goal, evidence: [{ id: 'e', title: 'Invalid', url: '/relative', accepted: true, addedAt: '2026-11-05T00:00:00Z' }] }],
  ];
  for (const input of invalid) assert.throws(() => validateWorkspace(input));
  checked[0].title = 'Changed copy';
  assert.equal(reported.title, 'Work reported');
});

test('imports reject duplicate identities, broken links and cycles before returning any workspace', () => {
  const invalid = [
    [task('a'), task('a')], [task('a', { dependsOn: ['missing'] })],
    [task('a', { parentId: 'missing' })], [task('a', { parentId: 'a' })],
    [task('a', { dependsOn: ['a'] })], [task('a'), task('b', { dependsOn: ['a', 'a'] })],
    [task('a', { dependsOn: ['b'] }), task('b', { dependsOn: ['a'] })],
    [task('a', { parentId: 'b' }), task('b', { parentId: 'a' })],
    [task('a', { kind: 'project' }), task('b', { parentId: 'a', dependsOn: ['a'] })],
    [task('a', { steps: [{ id: 's', text: 'One', done: false }, { id: 's', text: 'Two', done: false }] })],
  ];
  for (const input of invalid) assert.throws(() => validateWorkspace(input));
  const cyclic = [completed('a', { dependsOn: ['b'] }), completed('b', { dependsOn: ['a'] })];
  assert.equal(isVerified(cyclic[0], cyclic), false);
  assert.deepEqual(getPriorities(cyclic, 'all'), []);
});

test('workspace limits apply to item counts, nested lists and UTF-8 payload bytes', () => {
  assert.throws(() => validateWorkspace(Array.from({ length: 1001 }, (_, i) => task(`t-${i}`))), /1000/i);
  assert.throws(() => validateWorkspace([task('a', { steps: Array.from({ length: 101 }, (_, i) => ({ id: `s-${i}`, text: 'Work', done: false })) })]), /100/i);
  const payload = Array.from({ length: 150 }, (_, i) => task(`t-${i}`, { why: 'é'.repeat(9000) }));
  assert.ok(JSON.stringify(payload).length < 2_000_000);
  assert.throws(() => validateWorkspace(payload), /too large/i);
});

test('the proposed roadmap imports without invented completion or executable work', () => {
  const items = validateWorkspace(seedItems);
  assert.equal(items.length, seedItems.length);
  assert.equal(items[0].id, 'sales-goal');
  assert.equal(items.every(item => !item.approved && item.origin === 'proposal'), true);
  assert.deepEqual(getProgress(items, 'all'), { verified: 0, total: 0, percent: null });
  assert.deepEqual(getPriorities(items, 'all'), []);
});
