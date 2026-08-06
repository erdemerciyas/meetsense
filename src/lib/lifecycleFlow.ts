import type { LifecycleNode } from "@/content/types";

export type FlowLayout = {
  phase: number;
  /** 1–4 grid row inside each phase column */
  row: number;
};

export type PortSide = "left" | "right" | "top" | "bottom";

export type Point = { x: number; y: number };

export type NodeMetrics = {
  center: Point;
  width: number;
  height: number;
};

export const LIFECYCLE_LAYOUT: Record<string, FlowLayout> = {
  calendar: { phase: 0, row: 1 },
  manual: { phase: 0, row: 3 },
  bot: { phase: 1, row: 2 },
  record: { phase: 2, row: 1 },
  assistant: { phase: 2, row: 3 },
  meetsense: { phase: 3, row: 1 },
  transcript: { phase: 3, row: 2 },
  diarization: { phase: 3, row: 3 },
  analysis: { phase: 3, row: 4 },
  jira: { phase: 4, row: 1 },
  trello: { phase: 4, row: 2 },
  azure: { phase: 4, row: 3 },
  dashboard: { phase: 4, row: 4 },
};

export const LIFECYCLE_EDGES: [string, string][] = [
  ["calendar", "bot"],
  ["manual", "bot"],
  ["bot", "record"],
  ["bot", "assistant"],
  ["record", "meetsense"],
  ["meetsense", "transcript"],
  ["meetsense", "diarization"],
  ["transcript", "analysis"],
  ["diarization", "analysis"],
  ["analysis", "jira"],
  ["analysis", "trello"],
  ["analysis", "azure"],
  ["analysis", "dashboard"],
];

/** Guided walkthrough order for play / step controls */
export const FLOW_PLAY_SEQUENCE = [
  "calendar",
  "manual",
  "bot",
  "record",
  "assistant",
  "meetsense",
  "transcript",
  "diarization",
  "analysis",
  "jira",
  "trello",
  "azure",
  "dashboard",
] as const;

export function getNodesForPhase(phase: number): string[] {
  return Object.entries(LIFECYCLE_LAYOUT)
    .filter(([, layout]) => layout.phase === phase)
    .map(([id]) => id);
}

export function getUpstreamNodes(nodeId: string): string[] {
  return LIFECYCLE_EDGES.filter(([, target]) => target === nodeId).map(
    ([source]) => source,
  );
}

export function getDownstreamNodes(nodeId: string): string[] {
  return LIFECYCLE_EDGES.filter(([source]) => source === nodeId).map(
    ([, target]) => target,
  );
}

export function getUpstreamPath(nodeId: string): Set<string> {
  const visited = new Set<string>();
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const upstream of getUpstreamNodes(current)) {
      if (!visited.has(upstream)) queue.push(upstream);
    }
  }

  return visited;
}

export function getHighlightContext(nodeId: string | null, phase: number) {
  const nodes = nodeId
    ? getUpstreamPath(nodeId)
    : getActiveNodesForPhase(phase);
  const edges = new Set<string>();

  for (const [source, target] of LIFECYCLE_EDGES) {
    if (nodes.has(source) && nodes.has(target)) {
      edges.add(`${source}->${target}`);
    }
  }

  return { nodes, edges };
}

export function getActiveNodesForPhase(phase: number): Set<string> {
  const active = new Set<string>();
  for (let step = 0; step <= phase; step++) {
    for (const id of getNodesForPhase(step)) active.add(id);
  }
  return active;
}

export function inferEdgePorts(
  sourceId: string,
  targetId: string,
): { from: PortSide; to: PortSide } {
  const source = LIFECYCLE_LAYOUT[sourceId];
  const target = LIFECYCLE_LAYOUT[targetId];

  if (source && target && source.phase === target.phase) {
    return source.row < target.row
      ? { from: "bottom", to: "top" }
      : { from: "top", to: "bottom" };
  }

  return { from: "right", to: "left" };
}

export function getPortPoint(
  metrics: NodeMetrics,
  side: PortSide,
): Point {
  const { center, width, height } = metrics;
  const pad = 2;

  switch (side) {
    case "right":
      return { x: center.x + width / 2 - pad, y: center.y };
    case "left":
      return { x: center.x - width / 2 + pad, y: center.y };
    case "top":
      return { x: center.x, y: center.y - height / 2 + pad };
    case "bottom":
      return { x: center.x, y: center.y + height / 2 - pad };
  }
}

export function buildFlowPath(
  from: Point,
  to: Point,
  fromSide: PortSide,
  toSide: PortSide,
): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (fromSide === "right" && toSide === "left") {
    const bend = Math.max(40, Math.abs(dx) * 0.45);
    const c1x = from.x + bend;
    const c2x = to.x - bend;
    return `M ${from.x} ${from.y} C ${c1x} ${from.y}, ${c2x} ${to.y}, ${to.x} ${to.y}`;
  }

  if (fromSide === "bottom" && toSide === "top") {
    const bend = Math.max(28, Math.abs(dy) * 0.4);
    const c1y = from.y + bend;
    const c2y = to.y - bend;
    return `M ${from.x} ${from.y} C ${from.x} ${c1y}, ${to.x} ${c2y}, ${to.x} ${to.y}`;
  }

  if (fromSide === "top" && toSide === "bottom") {
    const bend = Math.max(28, Math.abs(dy) * 0.4);
    const c1y = from.y - bend;
    const c2y = to.y + bend;
    return `M ${from.x} ${from.y} C ${from.x} ${c1y}, ${to.x} ${c2y}, ${to.x} ${to.y}`;
  }

  const cx = from.x + dx * 0.5;
  const cy = from.y + dy * 0.5;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

export function groupNodesByPhase(nodes: LifecycleNode[]): LifecycleNode[][] {
  const phaseCount =
    Math.max(...Object.values(LIFECYCLE_LAYOUT).map((layout) => layout.phase)) + 1;

  const buckets: LifecycleNode[][] = Array.from({ length: phaseCount }, () => []);
  for (const node of nodes) {
    const layout = LIFECYCLE_LAYOUT[node.id];
    if (layout) buckets[layout.phase].push(node);
  }

  for (const bucket of buckets) {
    bucket.sort(
      (a, b) =>
        (LIFECYCLE_LAYOUT[a.id]?.row ?? 0) - (LIFECYCLE_LAYOUT[b.id]?.row ?? 0),
    );
  }

  return buckets;
}

export function getPlayheadIndex(nodeId: string | null): number {
  if (!nodeId) return 0;
  const index = FLOW_PLAY_SEQUENCE.indexOf(
    nodeId as (typeof FLOW_PLAY_SEQUENCE)[number],
  );
  return index >= 0 ? index : 0;
}

export function getNodePhase(nodeId: string): number {
  return LIFECYCLE_LAYOUT[nodeId]?.phase ?? 0;
}
