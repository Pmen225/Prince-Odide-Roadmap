"use client";

import { useEffect, useMemo, useRef, useState, memo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
  type NodeProps,
  type Node,
  type Edge,
} from "@xyflow/react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Scan,
  Target,
  GitBranch,
  Check,
  Bot,
  Circle,
  LockKeyhole,
  Maximize2,
} from "lucide-react";
import {
  getBlockers,
  getChildren,
  isVerified,
  type WorkItem,
  type Business,
} from "@/lib/work-model";
import {
  arrangeGraph,
  mapLinks,
  visibleWork,
  type MapMode,
  type PositionMap,
} from "@/lib/graph-layout";

type CardData = {
  item: WorkItem;
  childCount: number;
  expanded: boolean;
  blockers: number;
  verified: boolean;
  focused: boolean;
  onExpand: (id: string) => void;
};
type WorkNode = Node<CardData, "work">;

const kindLabels: Record<WorkItem["kind"], string> = {
  goal: "Goal",
  milestone: "Outcome",
  project: "Work group",
  task: "Task",
};

function workState(item: WorkItem, blockers: number, verified: boolean) {
  if (verified) return { label: "Verified", name: "verified" };
  if (!item.approved)
    return {
      label: item.origin === "proposal" ? "Suggested" : "Draft",
      name: "suggested",
    };
  if (blockers) return { label: "Waiting", name: "blocked" };
  if (item.status === "done") return { label: "Needs proof", name: "unverified" };
  if (item.status === "in-progress")
    return { label: "In progress", name: "in-progress" };
  return { label: "Ready", name: "ready" };
}

const NodeCard = memo(function NodeCard({
  data,
  selected,
}: NodeProps<WorkNode>) {
  const { item, childCount, expanded, blockers, verified, focused, onExpand } =
    data;
  const status = workState(item, blockers, verified);
  const hasOwner = item.owner !== "Unassigned" && item.owner !== "Review needed";
  return (
    <div
      className={`map-node kind-${item.kind} state-${status.name} ${selected ? "is-selected" : ""} ${focused ? "is-focus" : ""}`}
    >
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <div className="node-eyebrow">
        <span>
          {kindLabels[item.kind]}
          {item.business === "itad"
            ? " · ITAD"
            : item.business === "device-care"
              ? " · Device Care"
              : ""}
        </span>
        {focused && <Target size={13} aria-label="Next task" />}
      </div>
      <div className="node-title" title={item.title}>
        {item.title}
      </div>
      <div className="node-bottom">
        <span
          className={`node-status status-${status.name}`}
          title={!item.approved ? "Not approved for work" : undefined}
        >
          {verified ? (
            <Check size={12} aria-hidden="true" />
          ) : blockers && item.approved ? (
            <LockKeyhole size={12} aria-hidden="true" />
          ) : (
            <Circle size={9} aria-hidden="true" />
          )}
          {status.label}
        </span>
        {hasOwner && (
          <span
            className="node-owner"
            title={
              item.owner === "Agent"
                ? "Assigned to Agent. No agent run is connected."
                : `Owner: ${item.owner}`
            }
          >
            {item.owner === "Agent" && <Bot size={12} aria-hidden="true" />}
            {item.owner}
          </span>
        )}
      </div>
      {childCount > 0 && (
        <button
          className="node-expand nodrag nopan"
          aria-label={`${expanded ? "Collapse" : "Expand"} ${item.title}`}
          aria-expanded={expanded}
          onClick={(event) => {
            event.stopPropagation();
            onExpand(item.id);
          }}
        >
          <span>{childCount}</span>
          {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>
      )}
      <Handle type="source" position={Position.Right} isConnectable={false} />
    </div>
  );
});
const nodeTypes = { work: NodeCard };

export type CommandMapProps = {
  items: WorkItem[];
  expanded: string[];
  business: "all" | Business;
  mode: MapMode;
  selected: string | null;
  focusIds: string[];
  onSelect: (id: string) => void;
  onExpand: (id: string) => void;
  revealId: string | null;
  layoutRevision: number;
};

function Graph(props: CommandMapProps) {
  const {
    items,
    expanded,
    business,
    mode,
    selected,
    focusIds,
    onSelect,
    onExpand,
    revealId,
    layoutRevision,
  } = props;
  const flow = useReactFlow<WorkNode>();
  const [positions, setPositions] = useState<PositionMap>({});
  const [layoutResult, setLayoutResult] = useState({
    signature: "",
    error: "",
  });
  const [zoom, setZoom] = useState(1);
  const lastReveal = useRef<string | null>(null);
  const manual = useRef<Record<MapMode, PositionMap>>({
    mind: {},
    dependencies: {},
  });
  const visible = useMemo(
    () => visibleWork(items, expanded, business, mode),
    [items, expanded, business, mode],
  );
  const links = useMemo(() => mapLinks(visible, mode), [visible, mode]);
  const signature = JSON.stringify([
    visible.map((item) => [item.id, item.parentId]),
    links.map((link) => link.id),
    mode,
    layoutRevision,
  ]);
  const layingOut = signature !== layoutResult.signature;
  const layoutError = layingOut ? "" : layoutResult.error;
  useEffect(() => {
    let current = true;
    arrangeGraph(visible, links)
      .then((layout) => {
        if (!current) return;
        setPositions({ ...layout, ...manual.current[mode] });
        setLayoutResult({ signature, error: "" });
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            flow.fitView({ padding: 0.2, duration: 0, maxZoom: 1 }),
          ),
        );
      })
      .catch(() => {
        if (current)
          setLayoutResult({
            signature,
            error:
              "The map could not be arranged. Open a task below, or try Arrange map.",
          });
      });
    return () => {
      current = false;
    };
    // Layout depends on the visible graph structure, not edits to titles or steps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);
  useEffect(() => {
    manual.current = { mind: {}, dependencies: {} };
  }, [layoutRevision]);
  useEffect(() => {
    if (!revealId) {
      lastReveal.current = null;
      return;
    }
    if (!positions[revealId] || lastReveal.current === revealId) return;
    lastReveal.current = revealId;
    flow.fitView({
      nodes: [{ id: revealId }],
      duration: 0,
      padding: 1,
      maxZoom: 1,
    });
  }, [revealId, positions, flow]);
  const nodes: WorkNode[] = visible.map((item) => {
    const blockers = getBlockers(item, items).length;
    const verified = isVerified(item, items);
    return {
      id: item.id,
      type: "work",
      position: positions[item.id] ?? { x: 0, y: 0 },
      selected: item.id === selected,
      ariaLabel: `${item.title}. ${kindLabels[item.kind]}. ${workState(item, blockers, verified).label}. ${item.approved ? "Approved." : "Not approved."}`,
      deletable: false,
      data: {
        item,
        childCount:
          mode === "dependencies"
            ? 0
            : getChildren(item.id, items).filter(
                (child) => !["archived", "cancelled"].includes(child.status),
              ).length,
        expanded: expanded.includes(item.id),
        blockers,
        verified,
        // Keep one attention cue. An open card takes priority over the queue.
        focused: !selected && focusIds[0] === item.id,
        onExpand,
      },
    };
  });
  const edges: Edge[] = links.map((link) => ({
    id: link.id,
    source: link.source,
    target: link.target,
    type: "default",
    style: {
      stroke: link.dependency ? "#77818d" : "#47515e",
      strokeWidth: 1.35,
      ...(link.dependency ? { strokeDasharray: "5 4" } : {}),
    },
    markerEnd: link.dependency
      ? {
          type: MarkerType.ArrowClosed,
          color: "#77818d",
          width: 18,
          height: 18,
        }
      : undefined,
  }));
  return (
    <div
      className="map-canvas"
      aria-label={mode === "mind" ? "Business mind map" : "Task dependency map"}
      onKeyDownCapture={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        const target = event.target;
        // React Flow selects nodes with the keyboard, but does not call
        // onNodeClick. Open the same details without hijacking child buttons.
        if (
          !(target instanceof HTMLElement) ||
          !target.matches(".react-flow__node")
        )
          return;
        const id = target.dataset.id;
        if (!id) return;
        event.preventDefault();
        event.stopPropagation();
        onSelect(id);
      }}
    >
      <ReactFlow<WorkNode>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onSelect(node.id)}
        onNodesChange={(changes) => {
          const moved = changes.filter(
            (change) => change.type === "position" && change.position,
          );
          if (!moved.length) return;
          setPositions((previous) => {
            const next = { ...previous };
            for (const change of moved) {
              if (change.type === "position" && change.position) {
                next[change.id] = change.position;
                manual.current[mode][change.id] = change.position;
              }
            }
            return next;
          });
        }}
        onMoveEnd={(_, viewport) => setZoom(viewport.zoom)}
        nodesConnectable={false}
        edgesFocusable={false}
        deleteKeyCode={null}
        minZoom={0.15}
        maxZoom={1.8}
        panOnScroll
        selectionOnDrag={false}
        zoomOnDoubleClick={false}
        colorMode="dark"
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1, duration: 0 }}
        ariaLabelConfig={{
          "node.a11yDescription.default":
            "Press Enter or Space to open the steps. Use the expand button to show the work inside a card. Arrow keys move a selected card.",
        }}
        proOptions={{ hideAttribution: false }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1}
          color="#222931"
        />
      </ReactFlow>
      <div className="map-caption">
        <GitBranch size={14} aria-hidden="true" />
        {mode === "mind"
          ? "Open a card for its steps. Use its arrow to see the work inside."
          : "Arrows show what must finish first. Open a card to see why."}
      </div>
      {layingOut && (
        <div className="map-loading" role="status">
          Arranging your map…
        </div>
      )}
      {layoutError && (
        <div className="map-error" role="alert">
          <p>{layoutError}</p>
          <ul className="map-fallback-list" aria-label="Tasks shown on the map">
            {visible.map((item) => (
              <li key={item.id}>
                <button onClick={() => onSelect(item.id)}>
                  {item.title}
                  <ChevronRight size={15} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!visible.length && (
        <div className="map-empty">
          <GitBranch size={28} />
          <h3>No tasks in this view</h3>
          <p>Select another business or add your first task.</p>
        </div>
      )}
      <div className="map-controls">
        <button
          aria-label="Zoom in"
          onClick={() => flow.zoomIn({ duration: 0 })}
        >
          <Plus size={16} />
        </button>
        <button
          aria-label="Zoom out"
          onClick={() => flow.zoomOut({ duration: 0 })}
        >
          <Minus size={16} />
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button
          aria-label="Fit entire map"
          onClick={() =>
            flow.fitView({ padding: 0.2, duration: 0, maxZoom: 1 })
          }
        >
          <Scan size={16} />
        </button>
        <button
          className="fit-label"
          onClick={() =>
            flow.fitView({ padding: 0.2, duration: 0, maxZoom: 1 })
          }
        >
          <Maximize2 size={13} /> Fit map
        </button>
      </div>
      <details className="map-colour-key">
        <summary>Colour key</summary>
        <div className="map-key-items">
          <span>
            <Target size={13} className="key-focus" aria-hidden="true" />
            Blue — your focus
          </span>
          <span>
            <LockKeyhole size={13} className="key-waiting" aria-hidden="true" />
            Amber — waiting on other work
          </span>
          <span>
            <Check size={13} className="key-verified" aria-hidden="true" />
            Green — checked and complete
          </span>
          <p>Other work stays neutral. Suggested work is not approved.</p>
        </div>
      </details>
    </div>
  );
}

export function CommandMap(props: CommandMapProps) {
  return (
    <ReactFlowProvider>
      <Graph {...props} />
    </ReactFlowProvider>
  );
}
