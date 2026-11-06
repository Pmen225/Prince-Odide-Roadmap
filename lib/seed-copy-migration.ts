import { seedItems } from './seed.ts';
import { seedV1Items } from './seed-v1.ts';
import { seedV2Items } from './seed-v2.ts';
import { CURRENT_SEED_PLAN_VERSION } from './storage.ts';
import type { WorkItem } from './work-model.ts';

export type SeedCopyRefresh = {
  items: WorkItem[];
  updatedIds: string[];
  seedPlanVersion: number;
};

const firstById = new Map(seedV1Items.map(item => [item.id, item]));
const secondById = new Map(seedV2Items.map(item => [item.id, item]));
const currentIds = new Set(seedItems.map(item => item.id));

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
 * Replace only a complete, untouched legacy starter plan. A mixed plan keeps
 * its entire existing graph: edits, approvals, evidence and the meaning of all
 * links remain intact. New sales tasks use separate IDs and are placed first.
 * The saved version prevents deleted tasks (even the whole new plan) from
 * returning on the next load. This function itself never writes to storage.
 */
export function refreshSeedCopy(items: WorkItem[], previousVersion?: number): SeedCopyRefresh {
  const seedPlanVersion = Math.max(previousVersion ?? 0, CURRENT_SEED_PLAN_VERSION);
  const unchanged = { items, updatedIds: [], seedPlanVersion };
  if ((previousVersion ?? 0) >= CURRENT_SEED_PLAN_VERSION || !items.length ||
    items.some(item => currentIds.has(item.id))) return unchanged;

  const byId = new Map(items.map(item => [item.id, item]));
  const matchesLegacy = (item: WorkItem) =>
    sameValue(item, firstById.get(item.id)) || sameValue(item, secondById.get(item.id));
  // A fragment or unrelated user workspace is not permission to add a plan.
  if (![...secondById.keys()].every(id => byId.has(id)) || !items.some(matchesLegacy)) return unchanged;

  const pristine = items.length === secondById.size && items.every(matchesLegacy);
  const suggestions = structuredClone(seedItems);
  const next = pristine ? suggestions : [...suggestions, ...items];
  // A full user workspace must still load, even when there is no room for the
  // optional new plan. Never turn a safe saved draft into a recovery error.
  if (next.length > 1000 || new TextEncoder().encode(JSON.stringify(next)).byteLength > 2_000_000) return unchanged;
  return {
    items: next,
    updatedIds: suggestions.map(item => item.id),
    seedPlanVersion,
  };
}
