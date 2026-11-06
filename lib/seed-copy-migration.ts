import { seedItems } from './seed.ts';
import { seedV1Items } from './seed-v1.ts';
import type { WorkItem } from './work-model.ts';

export type SeedCopyRefresh = {
  items: WorkItem[];
  updatedIds: string[];
};

const previousById = new Map(seedV1Items.map(item => [item.id, item]));
const currentById = new Map(seedItems.map(item => [item.id, item]));

// Property order can change during export/import. Values, array order and the
// complete set of fields must still match. An extra field is treated as an edit.
function sameValue(left: unknown, right: unknown): boolean {
  if (left === right) return true;
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object')
    return false;

  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left) && Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => sameValue(value, right[index]));
  }

  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord).sort();
  const rightKeys = Object.keys(rightRecord).sort();
  return leftKeys.length === rightKeys.length &&
    leftKeys.every((key, index) => key === rightKeys[index] &&
      sameValue(leftRecord[key], rightRecord[key]));
}

/**
 * Refresh wording only for completely untouched, original seed proposals.
 * No storage write, approval, assignment, completion or relationship change.
 * Any user edit, including a checked step or a changed source, keeps the whole
 * item intact. Unknown and future items also remain intact.
 */
export function refreshSeedCopy(items: WorkItem[]): SeedCopyRefresh {
  const updatedIds: string[] = [];
  const next = items.map(item => {
    const previous = previousById.get(item.id);
    const current = currentById.get(item.id);
    if (
      !previous || !current ||
      item.origin !== 'proposal' || item.approved ||
      item.status !== 'not-started' || item.owner !== 'Unassigned' ||
      item.evidence.length > 0 || item.steps.some(step => step.done) ||
      !sameValue(item, previous)
    ) return item;

    updatedIds.push(item.id);
    return structuredClone(current);
  });

  return { items: updatedIds.length ? next : items, updatedIds };
}
