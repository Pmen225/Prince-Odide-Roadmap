export type Business = 'group' | 'itad' | 'device-care';
export type WorkKind = 'goal' | 'milestone' | 'project' | 'task';
export type WorkStatus = 'not-started' | 'in-progress' | 'done' | 'cancelled' | 'archived';
export type Owner = 'Junior' | 'Agent' | 'Unassigned' | 'Review needed';
export type WorkItem = {
  id: string;
  title: string;
  kind: WorkKind;
  business: Business;
  status: WorkStatus;
  owner: Owner;
  parentId?: string;
  dependsOn: string[];
  why: string;
  steps: { id: string; text: string; done: boolean }[];
  acceptance: string;
  evidence: { id: string; title: string; url: string; accepted: boolean; addedAt: string }[];
  sources: { label: string; url: string; chapter?: string }[];
  priority: 1 | 2 | 3;
  origin: 'proposal' | 'user';
  approved: boolean;
  reported?: boolean;
  due?: string;
};

const active = (item: WorkItem) => item.status !== 'cancelled' && item.status !== 'archived';
const inScope = (item: WorkItem, business: 'all' | Business) => business === 'all' || item.business === business || item.business === 'group';

export function getChildren(id: string, items: WorkItem[]): WorkItem[] {
  return items.filter(item => item.parentId === id);
}

export function getAncestors(id: string, items: WorkItem[]): WorkItem[] {
  const byId = new Map(items.map(item => [item.id, item]));
  const result: WorkItem[] = [];
  const seen = new Set([id]);
  let parentId = byId.get(id)?.parentId;
  while (parentId && !seen.has(parentId)) {
    seen.add(parentId);
    const parent = byId.get(parentId);
    if (!parent) break;
    result.push(parent);
    parentId = parent.parentId;
  }
  return result;
}

export function getDescendants(id: string, items: WorkItem[]): WorkItem[] {
  const result: WorkItem[] = [];
  const seen = new Set([id]);
  const pending = [id];
  for (let index = 0; index < pending.length; index++) {
    for (const child of getChildren(pending[index], items)) {
      if (seen.has(child.id)) continue;
      seen.add(child.id);
      pending.push(child.id);
      result.push(child);
    }
  }
  return result;
}

function verifier(items: WorkItem[]) {
  const byId = new Map(items.map(item => [item.id, item]));
  const checked = new Map<string, boolean>();
  const checking = new Set<string>();
  const verify = (item: WorkItem): boolean => {
    if (checked.has(item.id)) return checked.get(item.id)!;
    if (checking.has(item.id)) return false;
    if (!item.approved || !active(item) || item.status !== 'done' || !item.acceptance.trim() ||
      item.steps.some(step => !step.done) || !item.evidence.some(evidence => evidence.accepted) ||
      getAncestors(item.id, items).some(ancestor => !active(ancestor))) return false;
    checking.add(item.id);
    const verified = item.dependsOn.every(id => {
      const prerequisite = byId.get(id);
      return prerequisite !== undefined && verify(prerequisite);
    }) && getChildren(item.id, items).filter(child => child.approved && active(child)).every(verify);
    checking.delete(item.id);
    checked.set(item.id, verified);
    return verified;
  };
  return verify;
}

export function isVerified(item: WorkItem, items: WorkItem[] = [item]): boolean {
  return verifier(items)(item);
}

export function getBlockers(item: WorkItem, items: WorkItem[]): WorkItem[] {
  const verify = verifier(items);
  return items.filter(candidate => item.dependsOn.includes(candidate.id) && !verify(candidate));
}

// Completion waits on prerequisites and approved children. Checking both edge
// types together also rejects a child waiting on its own parent to finish.
function graphError(items: WorkItem[]): string | null {
  const byId = new Map(items.map(item => [item.id, item]));
  for (const item of items) {
    if (item.parentId === item.id) return 'An item cannot be its own parent.';
    if (item.parentId && !byId.has(item.parentId)) return `Parent "${item.parentId}" does not exist.`;
    for (const id of item.dependsOn) {
      if (id === item.id) return 'An item cannot depend on itself.';
      if (!byId.has(id)) return `Prerequisite "${id}" does not exist.`;
    }
  }
  const edges = new Map(items.map(item => [item.id, [...item.dependsOn]]));
  for (const item of items) if (item.parentId) edges.get(item.parentId)!.push(item.id);
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const hasCycle = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const next of edges.get(id) ?? []) if (hasCycle(next)) return true;
    visiting.delete(id);
    visited.add(id);
    return false;
  };
  return items.some(item => hasCycle(item.id)) ? 'This relationship creates a cycle or a parent–prerequisite deadlock.' : null;
}

export function validateDependency(items: WorkItem[], taskId: string, prerequisiteId: string): string | null {
  const item = items.find(candidate => candidate.id === taskId);
  if (!item) return `Work item "${taskId}" does not exist.`;
  if (!items.some(candidate => candidate.id === prerequisiteId)) return `Prerequisite "${prerequisiteId}" does not exist.`;
  if (taskId === prerequisiteId) return 'An item cannot depend on itself.';
  if (item.dependsOn.includes(prerequisiteId)) return 'This prerequisite is already linked.';
  return graphError(items.map(candidate => candidate.id === taskId ? { ...candidate, dependsOn: [...candidate.dependsOn, prerequisiteId] } : candidate));
}

export function validateParent(items: WorkItem[], childId: string, parentId: string): string | null {
  if (!items.some(item => item.id === childId)) return `Work item "${childId}" does not exist.`;
  if (!items.some(item => item.id === parentId)) return `Parent "${parentId}" does not exist.`;
  if (childId === parentId) return 'An item cannot be its own parent.';
  return graphError(items.map(item => item.id === childId ? { ...item, parentId } : item));
}

function eligibleTasks(items: WorkItem[], business: 'all' | Business): WorkItem[] {
  return items.filter(item => item.kind === 'task' && item.approved && active(item) && inScope(item, business) &&
    !getChildren(item.id, items).some(active) && !getAncestors(item.id, items).some(ancestor => !active(ancestor)));
}

export function getPriorities(items: WorkItem[], business: 'all' | Business): WorkItem[] {
  const verify = verifier(items);
  const byId = new Map(items.map(item => [item.id, item]));
  const prerequisites = new Set(items.filter(item => item.approved && active(item)).flatMap(item => item.dependsOn));
  return eligibleTasks(items, business)
    .filter(item => (item.status === 'not-started' || item.status === 'in-progress') && item.dependsOn.every(id => {
      const prerequisite = byId.get(id);
      return prerequisite !== undefined && verify(prerequisite);
    }))
    .sort((a, b) => Number(prerequisites.has(b.id)) - Number(prerequisites.has(a.id)) ||
      a.priority - b.priority || (a.due ?? '9999-12-31').localeCompare(b.due ?? '9999-12-31') ||
      Number(b.business === 'itad') - Number(a.business === 'itad') || a.id.localeCompare(b.id))
    .slice(0, 3);
}

export function getProgress(items: WorkItem[], business: 'all' | Business): { verified: number; total: number; percent: number | null } {
  const tasks = eligibleTasks(items, business);
  const verify = verifier(items);
  const verified = tasks.filter(verify).length;
  return { verified, total: tasks.length, percent: tasks.length ? Math.round(verified / tasks.length * 100) : null };
}

const itemFields = new Set(['id', 'title', 'kind', 'business', 'status', 'owner', 'parentId', 'dependsOn', 'why', 'steps', 'acceptance', 'evidence', 'sources', 'priority', 'origin', 'approved', 'reported', 'due']);

function record(value: unknown, label: string, fields: Set<string>): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) throw new Error(`${label} must be an object.`);
  if (Object.keys(value).some(key => !fields.has(key))) throw new Error(`${label} has an unsupported field.`);
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string, max: number, allowEmpty = false): asserts value is string {
  if (typeof value !== 'string' || value.length > max || (!allowEmpty && !value.trim())) throw new Error(`${label} must be ${allowEmpty ? 'text' : 'non-empty text'} of at most ${max} characters.`);
}

function bool(value: unknown, label: string): asserts value is boolean {
  if (typeof value !== 'boolean') throw new Error(`${label} must be true or false.`);
}

function list(value: unknown, label: string, max: number): asserts value is unknown[] {
  if (!Array.isArray(value) || value.length > max) throw new Error(`${label} must be a list with at most ${max} entries.`);
}

function oneOf(value: unknown, values: readonly unknown[], label: string) {
  if (!values.includes(value)) throw new Error(`${label} is not supported.`);
}

function url(value: unknown, label: string) {
  text(value, label, 2048);
  let parsed: URL;
  try { parsed = new URL(value); } catch { throw new Error(`${label} must be a valid HTTP or HTTPS URL.`); }
  if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) throw new Error(`${label} must be a valid HTTP or HTTPS URL without credentials.`);
}

function unique(values: unknown[], label: string) {
  if (new Set(values).size !== values.length) throw new Error(`${label} must not contain duplicate IDs.`);
}

export function validateWorkspace(value: unknown): WorkItem[] {
  list(value, 'Workspace', 1000);
  const records = value.map((entry, index) => {
    const label = `Item ${index + 1}`;
    const item = record(entry, label, itemFields);
    text(item.id, `${label} ID`, 120);
    text(item.title, `${label} title`, 300);
    oneOf(item.kind, ['goal', 'milestone', 'project', 'task'], `${label} kind`);
    oneOf(item.business, ['group', 'itad', 'device-care'], `${label} business`);
    oneOf(item.status, ['not-started', 'in-progress', 'done', 'cancelled', 'archived'], `${label} status`);
    oneOf(item.owner, ['Junior', 'Agent', 'Unassigned', 'Review needed'], `${label} owner`);
    oneOf(item.priority, [1, 2, 3], `${label} priority`);
    oneOf(item.origin, ['proposal', 'user'], `${label} origin`);
    bool(item.approved, `${label} approval`);
    if (item.reported !== undefined) bool(item.reported, `${label} reported flag`);
    if (item.parentId !== undefined) text(item.parentId, `${label} parent ID`, 120);
    text(item.why, `${label} reason`, 10000, true);
    text(item.acceptance, `${label} acceptance`, 10000, true);
    list(item.dependsOn, `${label} prerequisites`, 100);
    for (const id of item.dependsOn) text(id, `${label} prerequisite ID`, 120);
    unique(item.dependsOn, `${label} prerequisites`);
    list(item.steps, `${label} steps`, 100);
    const steps = item.steps.map((entry, stepIndex) => {
      const step = record(entry, `${label} step ${stepIndex + 1}`, new Set(['id', 'text', 'done']));
      text(step.id, `${label} step ID`, 120);
      text(step.text, `${label} step text`, 4000);
      bool(step.done, `${label} step completion`);
      return step;
    });
    unique(steps.map(step => step.id), `${label} steps`);
    list(item.evidence, `${label} evidence`, 100);
    const evidence = item.evidence.map((entry, evidenceIndex) => {
      const proof = record(entry, `${label} evidence ${evidenceIndex + 1}`, new Set(['id', 'title', 'url', 'accepted', 'addedAt']));
      text(proof.id, `${label} evidence ID`, 120);
      text(proof.title, `${label} evidence title`, 300);
      url(proof.url, `${label} evidence URL`);
      bool(proof.accepted, `${label} evidence acceptance`);
      text(proof.addedAt, `${label} evidence date`, 40);
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(proof.addedAt) || !Number.isFinite(Date.parse(proof.addedAt)) || new Date(proof.addedAt).toISOString().slice(0, 19) !== proof.addedAt.slice(0, 19)) throw new Error(`${label} evidence date must be a valid ISO UTC timestamp.`);
      return proof;
    });
    unique(evidence.map(proof => proof.id), `${label} evidence`);
    list(item.sources, `${label} sources`, 100);
    for (const entry of item.sources) {
      const source = record(entry, `${label} source`, new Set(['label', 'url', 'chapter']));
      text(source.label, `${label} source label`, 300);
      url(source.url, `${label} source URL`);
      if (source.chapter !== undefined) text(source.chapter, `${label} source chapter`, 300);
    }
    if (item.due !== undefined) {
      text(item.due, `${label} due date`, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(item.due) || !Number.isFinite(Date.parse(item.due)) || new Date(item.due).toISOString().slice(0, 10) !== item.due) throw new Error(`${label} due date must be a valid YYYY-MM-DD date.`);
    }
    return item;
  });
  unique(records.map(item => item.id), 'Workspace');
  const items = records as WorkItem[];
  const error = graphError(items);
  if (error) throw new Error(error);
  if (new TextEncoder().encode(JSON.stringify(items)).byteLength > 2_000_000) throw new Error('The workspace is too large. The maximum is 2 MB.');
  return structuredClone(items);
}

export function updateItem(items: WorkItem[], id: string, patch: Partial<WorkItem>): WorkItem[] {
  const existing = items.find(item => item.id === id);
  if (!existing) throw new Error(`Work item "${id}" does not exist.`);
  if (patch.id !== undefined && patch.id !== id) throw new Error('A work item ID cannot be changed.');
  const next = validateWorkspace(items.map(item => item.id === id ? { ...item, ...patch } : item));
  const updated = next.find(item => item.id === id)!;
  if (!updated.approved && ((patch.status !== undefined && ['in-progress', 'done'].includes(patch.status)) || patch.steps?.some(step => step.done))) throw new Error('Approve this work item before starting or completing it.');
  if (patch.status === 'done' && !isVerified(updated, next)) throw new Error('Done requires approved work, accepted evidence, all steps complete, and verified prerequisites and children.');
  return next;
}
