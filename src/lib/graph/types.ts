export type GraphNode = {
  id: string;
  x: number;
  y: number;
};

export type GraphEdge = {
  from: string;
  to: string;
  weight: number;
};

/** Always undirected - BFS/DFS ignore weight, Dijkstra uses it. */
export type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type Neighbor = {
  id: string;
  weight: number;
};

/** Neighbors in the order edges were declared, both directions of an
 * undirected edge, sorted by node id for deterministic traversal order. */
export function getNeighbors(graph: Graph, nodeId: string): Neighbor[] {
  const neighbors: Neighbor[] = [];
  for (const edge of graph.edges) {
    if (edge.from === nodeId) neighbors.push({ id: edge.to, weight: edge.weight });
    else if (edge.to === nodeId) neighbors.push({ id: edge.from, weight: edge.weight });
  }
  return neighbors.sort((a, b) => a.id.localeCompare(b.id));
}
