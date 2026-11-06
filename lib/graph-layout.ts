import type { ELK } from "elkjs/lib/elk.bundled.js";
import type { WorkItem, Business } from "./work-model";
import { getAncestors } from "./work-model.ts";

export type MapMode = "mind" | "dependencies";
export type MapLink = {
  id: string;
  source: string;
  target: string;
  dependency: boolean;
};
export type PositionMap = Record<string, { x: number; y: number }>;

export function visibleWork(
  items: WorkItem[],
  expanded: string[],
  business: "all" | Business,
  mode: MapMode,
): WorkItem[] {
  const active = items.filter(
    (item) =>
      ![item, ...getAncestors(item.id, items)].some((entry) =>
        ["archived", "cancelled"].includes(entry.status),
      ),
  );
  const scope = active.filter(
    (item) =>
      business === "all" ||
      item.business === business ||
      item.business === "group",
  );
  const included = new Set(scope.map((item) => item.id));
  // Prerequisites outside the filter remain visible; a business filter must not hide blockers.
  const addPrerequisites = (item: WorkItem) => {
    for (const id of item.dependsOn) {
      if (included.has(id)) continue;
      const dependency = active.find((candidate) => candidate.id === id);
      if (dependency) {
        included.add(id);
        addPrerequisites(dependency);
      }
    }
  };
  if (mode === "dependencies") {
    scope.forEach(addPrerequisites);
    const referenced = new Set(
      active
        .filter((item) => included.has(item.id))
        .flatMap((item) => item.dependsOn),
    );
    return active.filter(
      (item) =>
        included.has(item.id) &&
        (item.kind === "task" ||
          item.dependsOn.length > 0 ||
          referenced.has(item.id)),
    );
  }
  return scope.filter((item) => {
    const visited = new Set<string>();
    let parent = item.parentId;
    while (parent && included.has(parent)) {
      if (visited.has(parent) || !expanded.includes(parent)) return false;
      visited.add(parent);
      parent = active.find((candidate) => candidate.id === parent)?.parentId;
    }
    return true;
  });
}

export function mapLinks(items: WorkItem[], mode: MapMode): MapLink[] {
  const ids = new Set(items.map((item) => item.id));
  return items.flatMap<MapLink>((item) =>
    mode === "mind"
      ? item.parentId && ids.has(item.parentId)
        ? [
            {
              id: `contains:${item.parentId}:${item.id}`,
              source: item.parentId,
              target: item.id,
              dependency: false,
            },
          ]
        : []
      : item.dependsOn
          .filter((id) => ids.has(id))
          .map((id) => ({
            id: `depends:${id}:${item.id}`,
            source: id,
            target: item.id,
            dependency: true,
          })),
  );
}

// Load the browser layout engine only when the client requests a layout.
// Importing these pure graph helpers during Worker SSR must not create a worker.
let layoutEngine: Promise<ELK> | undefined;
export async function arrangeGraph(
  items: WorkItem[],
  links: MapLink[],
): Promise<PositionMap> {
  const elk = await (layoutEngine ??= import("elkjs/lib/elk.bundled.js")
    .then(({ default: Engine }) => new Engine())
    .catch((error: unknown) => {
      layoutEngine = undefined;
      throw error;
    }));
  const graph = await elk.layout({
    id: "workspace",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "RIGHT",
      "elk.spacing.nodeNode": "30",
      "elk.layered.spacing.nodeNodeBetweenLayers": "64",
      "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
      "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
      "elk.padding": "[top=30,left=30,bottom=30,right=30]",
    },
    children: items.map((item) => ({
      id: item.id,
      width: 230,
      height: item.kind === "goal" ? 116 : 96,
    })),
    edges: links.map((link) => ({
      id: link.id,
      sources: [link.source],
      targets: [link.target],
    })),
  });
  return Object.fromEntries(
    (graph.children ?? []).map((node) => [
      node.id,
      { x: node.x ?? 0, y: node.y ?? 0 },
    ]),
  );
}
