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

/** BFS/DFS/Dijkstra all assume every node is reachable from the start
 * node - used to reject disconnected custom graphs at input time rather
 * than letting them silently under-visit. */
export function isConnected(graph: Graph, startId: string): boolean {
  const visited = new Set<string>([startId]);
  const queue = [startId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const neighbor of getNeighbors(graph, current)) {
      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        queue.push(neighbor.id);
      }
    }
  }
  return visited.size === graph.nodes.length;
}
