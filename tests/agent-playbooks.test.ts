import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seedItems } from '../lib/seed.ts';
import { playbooks, resources, getPlaybook, buildAgentBrief, buildEndToEndBrief, hasTaskChanges, closedParentItems, calculateJobEconomics } from '../lib/agent-playbooks.ts';

test('each sales task has a complete executable handover, not a title-only checklist', () => {
  const tasks = seedItems.filter(item => item.kind === 'task');
  assert.equal(tasks.length, 11);
  assert.equal(playbooks.length, tasks.length);
  for (const task of tasks) {
    const book = getPlaybook(task.id);
    assert.ok(book, task.id);
    assert.ok(book.start.length > 40);
    assert.ok(book.resources.length >= 2);
    assert.ok(book.resources.every(id => resources.some(resource => resource.id === id)));
    assert.ok(book.inputs.length >= 3);
    assert.ok(book.procedure.length >= 5);
    assert.ok(book.procedure.every(step => step.tool && step.actions.length >= 2 && step.check));
    assert.ok(book.decisions.length >= 3);
    assert.ok(book.output.fields.length >= 4);
    assert.ok(book.done.length >= 3);
    assert.ok(book.example.input && book.example.action && book.example.result);
    assert.ok(book.humanGate && book.recovery);
  }
});

test('a copyable brief carries current task state, real resources, procedure and evidence rules', () => {
  const task = seedItems.find(item => item.id === 'sales-01-replies')!;
  const text = buildAgentBrief(task, seedItems);
  for (const section of ['ITAD - Outreach', 'ODIDE outreach email templates', 'General CRM', 'INPUTS', 'PROCEDURE', 'DECISION RULES', 'RETURN THIS RESULT', 'PROOF REQUIRED', 'ILLUSTRATION ONLY', 'STOP:']) assert.ok(text.includes(section), section);
  assert.match(text, /not authorisation to send/i);
  assert.match(text, /No agent is running/i);
  assert.match(text, /No mailbox access.*UNKNOWN/i);
  assert.match(text, /Message-ID/);
  assert.match(text, /human.*reply/i);
});

test('copying never changes the work or treats approval as permission to act outside the plan', () => {
  const before = JSON.stringify(seedItems);
  const text = buildEndToEndBrief(seedItems);
  assert.equal(JSON.stringify(seedItems), before);
  assert.match(text, /No agent is running/);
  assert.match(text, /exact recipient/);
  assert.match(text, /second sender/);
  assert.match(text, /physical/);
  assert.match(text, /30 minutes/);
  for (const item of seedItems.filter(item => item.kind === 'task')) assert.ok(text.includes(item.id));
  assert.equal((text.match(/### Current outreach rules \[policy\]/g) ?? []).length, 1);
  assert.equal((text.match(/## SHARED AUTHORITY AND SAFETY/g) ?? []).length, 1);
});

test('handover includes saved task and prerequisite proof without calling it fresh verification', () => {
  const items = structuredClone(seedItems);
  const quote = items.find(item => item.id === 'sales-06-quote')!;
  const costs = items.find(item => item.id === 'sales-05-costs')!;
  quote.evidence = [{ id: 'quote-receipt', title: 'Existing quote draft', url: 'https://example.com/jobs/demo/quote', accepted: false, addedAt: '2026-11-06T21:00:00Z' }];
  costs.evidence = [{ id: 'cost-review', title: 'Reviewed cost record', url: 'https://example.com/jobs/demo/costs', accepted: true, addedAt: '2026-11-06T20:00:00Z' }];
  const text = buildAgentBrief(quote, items);
  assert.match(text, /Not accepted: Existing quote draft/);
  assert.match(text, /Marked accepted in roadmap: Reviewed cost record/);
  assert.ok(text.includes(quote.evidence[0].url));
  assert.ok(text.includes(costs.evidence[0].url));
  assert.match(text, /not fresh provider verification/);
  assert.match(text, /Do not repeat an action/);
});

test('changed, inactive and missing prerequisites are carried into the brief', () => {
  const task = seedItems.find(item => item.id === 'sales-06-quote')!;
  assert.equal(hasTaskChanges(task), false);
  const edited = { ...task, title: 'Custom agreed scope', status: 'archived' as const, steps: [{ id: 'custom', text: 'Do not use the previous quote', done: false }] };
  assert.equal(hasTaskChanges(edited), true);
  const text = buildAgentBrief(edited, seedItems.filter(item => item.id !== 'sales-05-costs'));
  assert.match(text, /Custom agreed scope/);
  assert.match(text, /Do not use the previous quote/);
  assert.match(text, /CHANGED TASK/);
  assert.match(text, /CLOSED TASK/);
  assert.match(text, /MISSING: sales-05-costs/);
  assert.match(text, /STOP: Linked prerequisites are missing or not verified/);
  assert.equal(getPlaybook('user-task'), undefined);
});

test('closed parent work and changed business scope cannot look like an unchanged ready brief', () => {
  const items = structuredClone(seedItems);
  const task = items.find(item => item.id === 'sales-01-replies')!;
  const parent = items.find(item => item.id === task.parentId)!;
  parent.status = 'archived';
  assert.equal(closedParentItems(task, items)[0].id, parent.id);
  assert.match(buildAgentBrief(task, items), /STOP: CLOSED PARENT WORK/);
  task.business = 'device-care';
  assert.equal(hasTaskChanges(task), true);
  assert.match(buildAgentBrief(task, items), /Business: device-care/);
  assert.match(buildAgentBrief(task, items), /CHANGED TASK/);
});

test('partial scans and concurrent sends fail closed; standalone briefs resolve their linked resources', () => {
  assert.match(getPlaybook('sales-01-replies')!.done.join(' '), /partial scan is a checkpoint, never verified completion/);
  for (const id of ['sales-06-quote', 'sales-10-referral']) {
    const book = getPlaybook(id)!;
    assert.ok(book.resources.includes('register'));
    assert.ok(book.resources.includes('policy'));
  }
  for (const task of seedItems.filter(item => item.kind === 'task')) {
    const text = buildAgentBrief(task, seedItems);
    assert.match(text, /exclusive per-contact reservation/);
    assert.match(text, /do not send concurrently/);
  }
});

test('the worked economics distinguish margin, markup and unknown costs', () => {
  const result = calculateJobEconomics(200, [20, 60, 10, 30], 25);
  assert.equal(result.grossProfit, 80);
  assert.equal(result.grossMargin, 0.4);
  assert.equal(result.afterAcquisition, 55);
  assert.equal(calculateJobEconomics(0, [0], 0).grossMargin, null);
  assert.throws(() => calculateJobEconomics(200, [Number.NaN], 25));
  assert.throws(() => calculateJobEconomics(200, [-1], 25));
  assert.throws(() => calculateJobEconomics(100, [Number.MAX_VALUE, Number.MAX_VALUE], 0));
});

test('public playbooks resolve private resources without publishing private identifiers or messages', () => {
  const text = JSON.stringify({ playbooks, resources });
  assert.doesNotMatch(text, /app\.notion\.com\/p\/|p\.mensah@|C:\/Users|cognitive|diagnosis|1000.*emails/i);
  assert.match(text, /current.*schema/i);
  assert.match(text, /permission/i);
  assert.match(text, /no purchases/i);
});
