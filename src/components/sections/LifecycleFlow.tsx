"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LifecycleNode, SiteContent } from "@/content/types";
import {
  FLOW_PLAY_SEQUENCE,
  LIFECYCLE_EDGES,
  LIFECYCLE_LAYOUT,
  buildFlowPath,
  getHighlightContext,
  getNodePhase,
  getPlayheadIndex,
  getPortPoint,
  getUpstreamNodes,
  groupNodesByPhase,
  inferEdgePorts,
  type NodeMetrics,
} from "@/lib/lifecycleFlow";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const groupStyles = {
  trigger: "border-accent-warm/30 bg-accent-warm/10 text-accent-warm",
  core: "border-accent/30 bg-accent/10 text-accent-warm",
  output: "border-accent-dim/30 bg-accent-dim/10 text-accent-warm",
  integration: "border-muted/40 bg-muted/10 text-foreground/80",
};

const groupGlow = {
  trigger: "shadow-[0_0_28px_rgba(252,211,77,0.22)]",
  core: "shadow-[0_0_32px_rgba(245,158,11,0.28)]",
  output: "shadow-[0_0_28px_rgba(217,119,6,0.22)]",
  integration: "shadow-[0_0_24px_rgba(160,139,114,0.18)]",
};

type EdgePath = {
  id: string;
  d: string;
  length: number;
};

function useNodeMetrics(
  containerRef: RefObject<HTMLElement | null>,
  nodeRefs: RefObject<Record<string, HTMLButtonElement | null>>,
) {
  const [metrics, setMetrics] = useState<Record<string, NodeMetrics>>({});

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const next: Record<string, NodeMetrics> = {};

    for (const [id, element] of Object.entries(nodeRefs.current)) {
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      next[id] = {
        center: {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        },
        width: rect.width,
        height: rect.height,
      };
    }

    setMetrics(next);
  }, [containerRef, nodeRefs]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, measure]);

  return { metrics, remeasure: measure };
}

function buildEdgePaths(metrics: Record<string, NodeMetrics>): EdgePath[] {
  const measureLength = (d: string) => {
    const probe = document.createElementNS("http://www.w3.org/2000/svg", "path");
    probe.setAttribute("d", d);
    return probe.getTotalLength();
  };

  return LIFECYCLE_EDGES.flatMap(([source, target]) => {
    const sourceMetrics = metrics[source];
    const targetMetrics = metrics[target];
    if (!sourceMetrics || !targetMetrics) return [];

    const ports = inferEdgePorts(source, target);
    const from = getPortPoint(sourceMetrics, ports.from);
    const to = getPortPoint(targetMetrics, ports.to);
    const d = buildFlowPath(from, to, ports.from, ports.to);

    return [
      {
        id: `${source}->${target}`,
        d,
        length: measureLength(d),
      },
    ];
  });
}

function FlowEdges({
  edgePaths,
  activeEdges,
  playheadEdgeId,
  reducedMotion,
}: {
  edgePaths: EdgePath[];
  activeEdges: Set<string>;
  playheadEdgeId: string | null;
  reducedMotion: boolean;
}) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lifecycle-active-edge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(252,211,77,0.55)" />
          <stop offset="50%" stopColor="rgba(245,158,11,1)" />
          <stop offset="100%" stopColor="rgba(217,119,6,0.55)" />
        </linearGradient>
        <filter id="lifecycle-edge-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {edgePaths.map((edge) => {
        const isActive = activeEdges.has(edge.id);
        const isPlayhead = playheadEdgeId === edge.id;

        return (
          <g key={edge.id}>
            <path
              d={edge.d}
              fill="none"
              stroke="rgba(61,50,40,0.75)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <motion.path
              d={edge.d}
              fill="none"
              stroke={isActive ? "url(#lifecycle-active-edge)" : "rgba(245,158,11,0.1)"}
              strokeWidth={isActive ? 2.5 : 1.5}
              strokeLinecap="round"
              filter={isActive ? "url(#lifecycle-edge-glow)" : undefined}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.35,
                strokeDashoffset: isActive ? 0 : edge.length * 0.88,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ strokeDasharray: edge.length }}
            />
            {isActive && isPlayhead && !reducedMotion ? (
              <motion.circle
                r={4}
                fill="#8b8cc7"
                filter="url(#lifecycle-edge-glow)"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <animateMotion
                  dur="1.2s"
                  repeatCount="indefinite"
                  path={edge.d}
                />
              </motion.circle>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function FlowNode({
  node,
  groupLabel,
  gridRow,
  isActive,
  isDimmed,
  isSelected,
  isPlayhead,
  onSelect,
  onHover,
  nodeRef,
}: {
  node: LifecycleNode;
  groupLabel: string;
  gridRow: number;
  isActive: boolean;
  isDimmed: boolean;
  isSelected: boolean;
  isPlayhead: boolean;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
  nodeRef: (element: HTMLButtonElement | null) => void;
}) {
  return (
    <div
      className="flex items-center"
      style={{ gridRow }}
    >
      <motion.button
        ref={nodeRef}
        type="button"
        onClick={onSelect}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onFocus={() => onHover(true)}
        onBlur={() => onHover(false)}
        initial={false}
        animate={{
          opacity: isDimmed ? 0.28 : 1,
          scale: isSelected ? 1.02 : isPlayhead ? 1.015 : 1,
          y: isPlayhead ? -2 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "lifecycle-node glass-panel relative w-full rounded-2xl border p-3.5 text-left md:p-4",
          isActive && "border-accent/40",
          isSelected && cn("border-accent", groupGlow[node.group]),
          isPlayhead && !isSelected && "border-accent-warm/50",
          !isActive && !isSelected && !isPlayhead && "border-white/10",
        )}
        aria-pressed={isSelected}
      >
        {isPlayhead ? (
          <motion.span
            className="pointer-events-none absolute -inset-px rounded-2xl ring-2 ring-accent-warm/50"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}

        <span
          className={cn(
            "inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider",
            groupStyles[node.group],
          )}
        >
          {groupLabel}
        </span>
        <h3 className="mt-2 font-display text-sm font-semibold text-white md:text-base">
          {node.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted md:text-sm">
          {node.description}
        </p>
      </motion.button>
    </div>
  );
}

function PhaseColumn({
  phaseIndex,
  phaseLabel,
  nodes,
  groupLabels,
  activePhase,
  highlightNodes,
  selectedNodeId,
  playheadNodeId,
  hoveredNodeId,
  onSelectNode,
  onHoverNode,
  onRegisterNode,
}: {
  phaseIndex: number;
  phaseLabel: string;
  nodes: LifecycleNode[];
  groupLabels: Record<LifecycleNode["group"], string>;
  activePhase: number;
  highlightNodes: Set<string>;
  selectedNodeId: string | null;
  playheadNodeId: string | null;
  hoveredNodeId: string | null;
  onSelectNode: (id: string) => void;
  onHoverNode: (id: string | null) => void;
  onRegisterNode: (id: string, el: HTMLButtonElement | null) => void;
}) {
  const isPhaseActive = phaseIndex <= activePhase;
  const isCurrentPhase = phaseIndex === activePhase;

  return (
    <div
      className={cn(
        "relative z-10 flex flex-col transition-colors duration-500",
        isCurrentPhase && "z-20",
      )}
    >
      <motion.div
        animate={{
          opacity: isPhaseActive ? 1 : 0.45,
          scale: isCurrentPhase ? 1 : 0.98,
        }}
        transition={{ duration: 0.35 }}
        className={cn(
          "mb-4 rounded-full border px-3 py-1.5 text-center text-[11px] font-medium uppercase tracking-wider",
          isCurrentPhase
            ? "border-accent/50 bg-accent/15 text-accent-warm shadow-[0_0_24px_rgba(245,158,11,0.12)]"
            : isPhaseActive
              ? "border-accent/25 bg-accent/5 text-foreground/80"
              : "border-white/10 bg-white/5 text-muted",
        )}
      >
        {phaseLabel}
      </motion.div>

      <div className="grid min-h-[520px] flex-1 grid-rows-4 gap-3 md:min-h-[560px] md:gap-4">
        {nodes.map((node) => {
          const layout = LIFECYCLE_LAYOUT[node.id];
          const isHighlighted = highlightNodes.has(node.id);
          const isDimmed = hoveredNodeId
            ? !isHighlighted
            : !isPhaseActive && !isHighlighted;
          const isSelected = selectedNodeId === node.id;
          const isPlayhead = playheadNodeId === node.id;

          return (
            <FlowNode
              key={node.id}
              node={node}
              groupLabel={groupLabels[node.group]}
              gridRow={layout?.row ?? 1}
              isActive={isHighlighted || isPhaseActive}
              isDimmed={isDimmed}
              isSelected={isSelected}
              isPlayhead={isPlayhead}
              onSelect={() => onSelectNode(node.id)}
              onHover={(hovering) => onHoverNode(hovering ? node.id : null)}
              nodeRef={(el) => onRegisterNode(node.id, el)}
            />
          );
        })}
      </div>
    </div>
  );
}

function DesktopFlow({
  content,
  activePhase,
  selectedNodeId,
  hoveredNodeId,
  playheadNodeId,
  isPlaying,
  onSelectNode,
  onHoverNode,
  reducedMotion,
}: {
  content: SiteContent["lifecycle"];
  activePhase: number;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  playheadNodeId: string | null;
  isPlaying: boolean;
  onSelectNode: (id: string) => void;
  onHoverNode: (id: string | null) => void;
  reducedMotion: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { metrics, remeasure } = useNodeMetrics(containerRef, nodeRefs);

  const phaseBuckets = useMemo(
    () => groupNodesByPhase(content.nodes),
    [content.nodes],
  );

  const focusNodeId = hoveredNodeId ?? selectedNodeId;
  const { nodes: highlightNodes, edges: activeEdges } = getHighlightContext(
    focusNodeId,
    activePhase,
  );

  const edgePaths = useMemo(() => buildEdgePaths(metrics), [metrics]);

  const playheadEdgeId = useMemo(() => {
    if (!isPlaying || !playheadNodeId) return null;
    const upstreams = getUpstreamNodes(playheadNodeId);
    if (upstreams.length === 0) return null;

    const source = upstreams.reduce((latest, current) => {
      const latestIndex = FLOW_PLAY_SEQUENCE.indexOf(
        latest as (typeof FLOW_PLAY_SEQUENCE)[number],
      );
      const currentIndex = FLOW_PLAY_SEQUENCE.indexOf(
        current as (typeof FLOW_PLAY_SEQUENCE)[number],
      );
      return currentIndex > latestIndex ? current : latest;
    });

    return `${source}->${playheadNodeId}`;
  }, [isPlaying, playheadNodeId]);

  useLayoutEffect(() => {
    remeasure();
  }, [activePhase, selectedNodeId, playheadNodeId, remeasure]);

  return (
    <div
      ref={containerRef}
      className="relative hidden min-h-[600px] lg:grid lg:grid-cols-5 lg:gap-5 xl:gap-6"
    >
      <FlowEdges
        edgePaths={edgePaths}
        activeEdges={activeEdges}
        playheadEdgeId={playheadEdgeId}
        reducedMotion={reducedMotion}
      />

      {phaseBuckets.map((bucket, phaseIndex) => (
        <PhaseColumn
          key={phaseIndex}
          phaseIndex={phaseIndex}
          phaseLabel={content.phases[phaseIndex]}
          nodes={bucket}
          groupLabels={content.groupLabels}
          activePhase={activePhase}
          highlightNodes={highlightNodes}
          selectedNodeId={selectedNodeId}
          playheadNodeId={playheadNodeId}
          hoveredNodeId={hoveredNodeId}
          onSelectNode={onSelectNode}
          onHoverNode={onHoverNode}
          onRegisterNode={(id, el) => {
            nodeRefs.current[id] = el;
          }}
        />
      ))}
    </div>
  );
}

function MobileFlow({
  content,
  activePhase,
  selectedNodeId,
  playheadNodeId,
  onSelectNode,
}: {
  content: SiteContent["lifecycle"];
  activePhase: number;
  selectedNodeId: string | null;
  playheadNodeId: string | null;
  onSelectNode: (id: string) => void;
}) {
  const phaseBuckets = useMemo(
    () => groupNodesByPhase(content.nodes),
    [content.nodes],
  );

  return (
    <div className="space-y-8 lg:hidden">
      {phaseBuckets.map((bucket, phaseIndex) => {
        const isPhaseActive = phaseIndex <= activePhase;
        const isCurrentPhase = phaseIndex === activePhase;

        return (
          <div key={phaseIndex} className="relative">
            <div
              className={cn(
                "mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors",
                isCurrentPhase
                  ? "border-accent/50 bg-accent/15 text-accent-warm"
                  : isPhaseActive
                    ? "border-accent/25 bg-accent/5 text-foreground/80"
                    : "border-white/10 bg-white/5 text-muted",
              )}
            >
              {phaseIndex + 1}. {content.phases[phaseIndex]}
            </div>

            <div className="space-y-3 border-l border-accent/20 pl-5">
              {bucket.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isPlayhead = playheadNodeId === node.id;

                return (
                  <motion.button
                    key={node.id}
                    type="button"
                    onClick={() => onSelectNode(node.id)}
                    initial={false}
                    animate={{
                      opacity: isPhaseActive ? 1 : 0.4,
                      x: isPlayhead ? 4 : 0,
                    }}
                    className={cn(
                      "lifecycle-node glass-panel relative w-full rounded-2xl border p-4 text-left",
                      isSelected
                        ? cn("border-accent", groupGlow[node.group])
                        : "border-white/10",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider",
                        groupStyles[node.group],
                      )}
                    >
                      {content.groupLabels[node.group]}
                    </span>
                    <h3 className="mt-2 font-display text-base font-semibold text-white">
                      {node.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{node.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProgressRail({
  progress,
  phaseCount,
  activePhase,
}: {
  progress: number;
  phaseCount: number;
  activePhase: number;
}) {
  return (
    <div className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-white/8">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent-dim via-accent to-accent-warm"
        initial={false}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 flex justify-between px-0.5">
        {Array.from({ length: phaseCount }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "mt-[-3px] h-3 w-3 rounded-full border-2 transition-colors duration-300",
              index <= activePhase
                ? "border-accent bg-accent"
                : "border-white/20 bg-background",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function NodeDetailPanel({
  node,
  groupLabel,
  stepIndex,
  totalSteps,
}: {
  node: LifecycleNode;
  groupLabel: string;
  stepIndex: number;
  totalSteps: number;
}) {
  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel mt-8 rounded-2xl border border-accent/20 p-5 md:p-7"
    >
      <div className="flex items-center justify-between gap-4">
        <span
          className={cn(
            "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider",
            groupStyles[node.group],
          )}
        >
          {groupLabel}
        </span>
        <span className="text-xs tabular-nums text-muted">
          {stepIndex + 1} / {totalSteps}
        </span>
      </div>
      <h3 className="mt-4 font-display text-2xl font-semibold text-white md:text-3xl">
        {node.title}
      </h3>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
        {node.description}
      </p>
    </motion.div>
  );
}

export function LifecycleFlow({
  content,
}: {
  content: SiteContent["lifecycle"];
}) {
  const reducedMotion = useReducedMotion();
  const [activePhase, setActivePhase] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    FLOW_PLAY_SEQUENCE[0],
  );
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [playheadNodeId, setPlayheadNodeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);

  const selectedNode = content.nodes.find((node) => node.id === selectedNodeId);
  const currentStepIndex = getPlayheadIndex(selectedNodeId);
  const activePlayheadId = isPlaying && !reducedMotion ? playheadNodeId : null;
  const playProgress =
    FLOW_PLAY_SEQUENCE.length > 1
      ? currentStepIndex / (FLOW_PLAY_SEQUENCE.length - 1)
      : 0;

  const goToPlayIndex = useCallback((index: number) => {
    const nodeId = FLOW_PLAY_SEQUENCE[index];
    setPlayIndex(index);
    setSelectedNodeId(nodeId);
    setPlayheadNodeId(nodeId);
    setActivePhase(getNodePhase(nodeId));
  }, []);

  useEffect(() => {
    if (!isPlaying || reducedMotion) return;

    const timer = window.setInterval(() => {
      setPlayIndex((current) => {
        const next = current >= FLOW_PLAY_SEQUENCE.length - 1 ? 0 : current + 1;
        const nodeId = FLOW_PLAY_SEQUENCE[next];
        setSelectedNodeId(nodeId);
        setPlayheadNodeId(nodeId);
        setActivePhase(getNodePhase(nodeId));
        return next;
      });
    }, 2400);

    return () => window.clearInterval(timer);
  }, [isPlaying, reducedMotion]);

  const handlePhaseSelect = (phase: number) => {
    setIsPlaying(false);
    setActivePhase(phase);
    const phaseNode = content.nodes.find(
      (node) => LIFECYCLE_LAYOUT[node.id]?.phase === phase,
    );
    if (phaseNode) {
      setSelectedNodeId(phaseNode.id);
      setPlayIndex(getPlayheadIndex(phaseNode.id));
    }
  };

  const handleNodeSelect = (nodeId: string) => {
    setIsPlaying(false);
    setSelectedNodeId(nodeId);
    setPlayheadNodeId(null);
    setActivePhase(getNodePhase(nodeId));
    setPlayIndex(getPlayheadIndex(nodeId));
  };

  const handleStep = () => {
    setIsPlaying(false);
    const next = playIndex >= FLOW_PLAY_SEQUENCE.length - 1 ? 0 : playIndex + 1;
    goToPlayIndex(next);
  };

  const handlePlayToggle = () => {
    setIsPlaying((playing) => {
      if (!playing) {
        setPlayheadNodeId(FLOW_PLAY_SEQUENCE[playIndex]);
      }
      return !playing;
    });
  };

  return (
    <div className="mt-14">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm text-muted">{content.flowHint}</p>
          <ProgressRail
            progress={playProgress}
            phaseCount={content.phases.length}
            activePhase={activePhase}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePlayToggle}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-medium transition-all duration-300",
              isPlaying
                ? "border-accent/50 bg-accent/15 text-accent-warm"
                : "border-white/10 bg-white/5 text-foreground hover:border-accent/30",
            )}
            aria-pressed={isPlaying}
          >
            <motion.span
              className="inline-block h-2 w-2 rounded-full bg-accent-warm"
              animate={isPlaying ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] } : { scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, repeat: isPlaying ? Infinity : 0 }}
            />
            {isPlaying ? content.pauseLabel : content.playLabel}
          </button>

          <button
            type="button"
            onClick={handleStep}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-accent/30"
          >
            {content.stepLabel}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {content.phases.map((phase, index) => (
          <button
            key={phase}
            type="button"
            onClick={() => handlePhaseSelect(index)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300",
              index === activePhase
                ? "border-accent bg-accent/15 text-accent-warm shadow-[0_0_20px_rgba(245,158,11,0.12)]"
                : index < activePhase
                  ? "border-accent/25 bg-accent/5 text-foreground/80"
                  : "border-white/10 bg-white/5 text-muted hover:border-white/20",
            )}
            aria-pressed={index === activePhase}
          >
            {index + 1}. {phase}
          </button>
        ))}
      </div>

      <div className="relative mt-10 overflow-hidden rounded-3xl border border-white/10 elevated-card-lg p-4 md:p-8">
        <div
          className="pointer-events-none absolute inset-0 grid-bg opacity-30"
          aria-hidden="true"
        />

        <DesktopFlow
          content={content}
          activePhase={activePhase}
          selectedNodeId={selectedNodeId}
          hoveredNodeId={hoveredNodeId}
          playheadNodeId={activePlayheadId}
          isPlaying={isPlaying}
          onSelectNode={handleNodeSelect}
          onHoverNode={setHoveredNodeId}
          reducedMotion={reducedMotion}
        />

        <MobileFlow
          content={content}
          activePhase={activePhase}
          selectedNodeId={selectedNodeId}
          playheadNodeId={activePlayheadId}
          onSelectNode={handleNodeSelect}
        />
      </div>

      <AnimatePresence mode="wait">
        {selectedNode ? (
          <NodeDetailPanel
            node={selectedNode}
            groupLabel={content.groupLabels[selectedNode.group]}
            stepIndex={getPlayheadIndex(selectedNode.id)}
            totalSteps={FLOW_PLAY_SEQUENCE.length}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
