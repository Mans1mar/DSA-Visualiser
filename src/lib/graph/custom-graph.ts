import { circularLayout } from "./random-graph";
import { isConnected } from "./types";
import type { Graph, GraphEdge } from "./types";

const EDGE_PATTERN = /^([A-Za-z0-9]{1,3})\s*-\s*([A-Za-z0-9]{1,3})\s*(?::\s*(\d+))?$/;
const MIN_NODES = 2;
const MAX_NODES = 10;
const MIN_WEIGHT = 1;
const MAX_WEIGHT = 99;

export type ParseGraphResult = { graph: Graph } | { error: string };

/** Parses a comma-separated edge list like "A-B:4, B-C:1, A-C:2" (weight
 * defaults to 1 when omitted). Node positions come from the same
 * circular layout random graphs use, placed in order of first
 * appearance. Connectivity from the first node listed is required -
 * BFS/DFS/Dijkstra all assume the whole graph is reachable from the
 * start node, and a disconnected custom graph would silently under-visit
 * instead of surfacing as a clear error. */
export function parseCustomGraph(text: string): ParseGraphResult {
  const tokens = text
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) {
    return { error: "Enter at least one edge, e.g. A-B:4, B-C:1." };
  }

  const nodeIds: string[] = [];
  const edges: GraphEdge[] = [];
  const seenPairs = new Set<string>();

  for (const token of tokens) {
    const match = EDGE_PATTERN.exec(token);
    if (!match) {
      return { error: `"${token}" isn't a valid edge - use the form A-B or A-B:weight.` };
    }
    const [, from, to, weightToken] = match;
    if (from === to) {
      return { error: `"${token}" connects a node to itself, which isn't supported.` };
    }
    const weight = weightToken ? Number(weightToken) : 1;
    if (weight < MIN_WEIGHT || weight > MAX_WEIGHT) {
      return { error: `Edge weights must be between ${MIN_WEIGHT} and ${MAX_WEIGHT}.` };
    }
    const pairKey = [from, to].sort().join("-");
    if (seenPairs.has(pairKey)) {
      return { error: `Duplicate edge between ${from} and ${to}.` };
    }
    seenPairs.add(pairKey);
    if (!nodeIds.includes(from)) nodeIds.push(from);
    if (!nodeIds.includes(to)) nodeIds.push(to);
    edges.push({ from, to, weight });
  }

  if (nodeIds.length < MIN_NODES) {
    return { error: `Enter at least ${MIN_NODES} distinct nodes.` };
  }
  if (nodeIds.length > MAX_NODES) {
    return { error: `Enter at most ${MAX_NODES} distinct nodes.` };
  }

  const graph: Graph = { nodes: circularLayout(nodeIds), edges };

  if (!isConnected(graph, nodeIds[0])) {
    return {
      error:
        "Every node must be reachable from the first node listed - the graph is disconnected.",
    };
  }

  return { graph };
}

/** Inverse of parseCustomGraph, so the current graph can be shown back
 * as editable text (initial display, and after Randomize). */
export function graphToText(graph: Graph): string {
  return graph.edges.map((edge) => `${edge.from}-${edge.to}:${edge.weight}`).join(", ");
}
