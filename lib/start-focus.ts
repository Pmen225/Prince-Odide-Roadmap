import {
  getAncestors, getBlockers, getChildren, getPriorities, isVerified,
  type Business, type WorkItem,
} from "./work-model.ts";

/** Keep the entry screen honest: ready work first, then review, never hidden work. */
export function getStartingPoints(items: WorkItem[], business: "all" | Business = "all"): WorkItem[] {
  const activeTasks = items.filter((item) =>
    item.kind === "task" && !["archived", "cancelled"].includes(item.status) &&
    (business === "all" || item.business === business || item.business === "group") &&
    !getAncestors(item.id, items).some((parent) => ["archived", "cancelled"].includes(parent.status)) &&
    !getChildren(item.id, items).some((child) => !["archived", "cancelled"].includes(child.status)),
  );
  const ready = getPriorities(items, business);
  if (ready.length) return ready;

  const needsProof = activeTasks.filter((item) => item.approved && item.status === "done" && !isVerified(item, items));
  if (needsProof.length) return needsProof.slice(0, 3);
  // Let the entry screen explain the prerequisite instead of changing subjects.
  if (activeTasks.some((item) => item.approved && item.status !== "done" && getBlockers(item, items).length)) return [];

  return activeTasks.filter((item) => !item.approved && item.status === "not-started" && getBlockers(item, items).length === 0)
    .sort((a, b) => a.priority - b.priority || Number(b.business === "itad") - Number(a.business === "itad"))
    .slice(0, 3);
}
