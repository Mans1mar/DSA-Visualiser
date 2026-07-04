import { cn } from "@/lib/utils";
import type { Graph } from "@/lib/graph/types";
import type { Step } from "@/types/step";

type GraphViewProps = {
  graph: Graph;
  step: Step;
};

function edgeKey(a: string, b: string) {
  return [a, b].sort().join("--");
}

function collectFrontierIds(step: Step): Set<string> {
  const ids = new Set<string>();
  for (const item of step.dataStructureState?.queue ?? []) {
    if (typeof item === "string") ids.add(item);
  }
  for (const item of step.dataStructureState?.priorityQueue ?? []) {
    if (typeof item === "string") ids.add(item.split(":")[0]);
  }
  return ids;
}

export function GraphView({ graph, step }: GraphViewProps) {
  const visited = new Set(step.dataStructureState?.visitedNodes ?? []);
  const treeEdgeSet = new Set(
    (step.dataStructureState?.treeEdges ?? []).map(([a, b]) => edgeKey(a, b))
  );
  const frontierIds = collectFrontierIds(step);
  const distances = step.variables.distances as Record<string, number> | undefined;
  const currentEdgeKey = step.currentEdge ? edgeKey(step.currentEdge[0], step.currentEdge[1]) : undefined;
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));

  const xs = graph.nodes.map((node) => node.x);
  const ys = graph.nodes.map((node) => node.y);
  const padding = 44;
  const minX = Math.min(...xs) - padding;
  const minY = Math.min(...ys) - padding;
  const width = Math.max(...xs) - Math.min(...xs) + padding * 2;
  const height = Math.max(...ys) - Math.min(...ys) + padding * 2;

  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <svg viewBox={`${minX} ${minY} ${width} ${height}`} className="w-full" style={{ maxHeight: 380 }}>
        {graph.edges.map((edge) => {
          const key = edgeKey(edge.from, edge.to);
          const isCurrent = key === currentEdgeKey;
          const isTree = treeEdgeSet.has(key);
          const from = nodesById.get(edge.from)!;
          const to = nodesById.get(edge.to)!;
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={key}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                strokeWidth={isCurrent || isTree ? 3 : 1.5}
                className={cn(
                  "transition-all duration-300",
                  isCurrent ? "edge-current" : isTree ? "edge-tree" : "edge-default"
                )}
              />
              <rect
                x={midX - 8}
                y={midY - 15}
                width={16}
                height={13}
                rx={3}
                className="fill-muted-foreground/50"
              />
              <text
                x={midX}
                y={midY - 5}
                textAnchor="middle"
                className="fill-background text-[10px] font-medium select-none"
              >
                {edge.weight}
              </text>
            </g>
          );
        })}

        {graph.nodes.map((node) => {
          const isCurrent = node.id === step.currentNode;
          const isVisited = visited.has(node.id);
          const isFrontier = !isVisited && !isCurrent && frontierIds.has(node.id);
          const nodeClass = isCurrent
            ? "node-current"
            : isVisited
              ? "node-visited"
              : isFrontier
                ? "node-frontier"
                : "node-default";
          const dist = distances?.[node.id];

          return (
            <g key={node.id} className="transition-all duration-300">
              <circle cx={node.x} cy={node.y} r={22} strokeWidth={2.5} className={nodeClass} />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className="fill-foreground text-sm font-semibold select-none"
              >
                {node.id}
              </text>
              {dist !== undefined && (
                <rect
                  x={node.x - 14}
                  y={node.y + 28}
                  width={28}
                  height={14}
                  rx={4}
                  className="fill-background"
                />
              )}
              {dist !== undefined && (
                <text
                  x={node.x}
                  y={node.y + 38}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono text-[11px] font-semibold select-none"
                >
                  {dist === Infinity ? "∞" : dist}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
