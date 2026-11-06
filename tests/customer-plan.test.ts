import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seedItems } from '../lib/seed.ts';
import { getStartingPoints } from '../lib/start-focus.ts';
import { validateWorkspace } from '../lib/work-model.ts';

test('the first action works the existing customer replies, not setup documents', () => {
  assert.equal(getStartingPoints(seedItems)[0]?.id, 'sales-01-replies');
  assert.match(getStartingPoints(seedItems)[0]?.title ?? '', /replies/);
  assert.ok(!getStartingPoints(seedItems).some(item => /website|document|tracker|assets/i.test(item.title)));
});

test('customer work can start without writing a service manual or completing a batch', () => {
  for (const id of ['sales-01-replies', 'sales-03-local-demand', 'sales-04-qualify']) {
    assert.deepEqual(seedItems.find(item => item.id === id)?.dependsOn, []);
  }
  // A real buyer can go straight to qualification; a five-contact target is not a gate.
  assert.ok(!seedItems.find(item => item.id === 'sales-04-qualify')?.dependsOn.includes('sales-03-local-demand'));
});

test('a firm quote still requires a real job and a checked delivery cost', () => {
  assert.deepEqual(seedItems.find(item => item.id === 'sales-05-costs')?.dependsOn, ['sales-04-qualify']);
  assert.deepEqual(seedItems.find(item => item.id === 'sales-06-quote')?.dependsOn, ['sales-05-costs']);
  assert.deepEqual(seedItems.find(item => item.id === 'sales-08-deliver')?.dependsOn, ['sales-07-book']);
  assert.deepEqual(seedItems.find(item => item.id === 'sales-09-payment')?.dependsOn, ['sales-08-deliver']);
});

test('both Hormozi libraries inform the actions without claiming business results', () => {
  const items = validateWorkspace(seedItems);
  assert.ok(items.every(item => item.id.startsWith('sales-')));
  assert.ok(items.every(item => item.origin === 'proposal' && !item.approved && item.status === 'not-started'));
  assert.ok(items.every(item => item.evidence.length === 0 && item.steps.every(step => !step.done)));
  const sources = items.flatMap(item => item.sources);
  assert.ok(sources.some(source => source.url.includes('hormozi-youtube-channel-skill')));
  assert.ok(sources.some(source => source.url.includes('alex-hormozi-full-course')));
  assert.ok(items.filter(item => item.kind === 'task').every(item => item.sources.length > 0));
  // Private campaign ledgers, customer records and health data must not enter public source.
  assert.doesNotMatch(JSON.stringify(items), /app\.notion\.com|p\.mensah@|40f702|cognitive|diagnosis|1000.*emails/i);
});
