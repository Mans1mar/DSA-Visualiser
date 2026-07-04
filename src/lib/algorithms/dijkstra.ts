import type { Step } from "@/types/step";
import type { Graph } from "@/lib/graph/types";
import { getNeighbors } from "@/lib/graph/types";
import { GraphStepRecorder } from "./graph-step-recorder";

export const DIJKSTRA_SOURCE = [
  "function dijkstra(graph, start) {",
  "  const dist = { [start]: 0 }; // everything else starts at Infinity",
  "  const pq = [{ node: start, dist: 0 }];",
  "  const visited = new Set();",
  "  while (pq.length > 0) {",
  "    pq.sort((a, b) => a.dist - b.dist);",
  "    const { node, dist: d } = pq.shift();",
  "    if (visited.has(node)) continue;",
  "    visited.add(node);",
  "    for (const { id: neighbor, weight } of neighbors(node)) {",
  "      const newDist = d + weight;",
  "      if (newDist < dist[neighbor]) {",
  "        dist[neighbor] = newDist;",
  "        pq.push({ node: neighbor, dist: newDist });",
  "      }",
  "    }",
  "  }",
  "  return dist;",
  "}",
];

// Line-for-line pseudocode counterpart to DIJKSTRA_SOURCE.
export const DIJKSTRA_PSEUDOCODE = [
  "function dijkstra(graph, start)",
  "    dist[start] = 0, dist[every other node] = infinity",
  "    pq = [(start, 0)]",
  "    visited = {}",
  "    while pq is not empty",
  "        sort pq by distance, closest first",
  "        (node, d) = remove closest entry from pq",
  "        if node in visited, skip it",
  "        add node to visited",
  "        for each neighbor of node with edge weight w",
  "            newDist = d + w",
  "            if newDist < dist[neighbor]",
  "                dist[neighbor] = newDist",
  "                add (neighbor, newDist) to pq",
  "            end if",
  "        end for",
  "    end while",
  "    return dist",
  "end function",
];

function formatDist(d: number): string {
  return d === Infinity ? "infinity" : String(d);
}

/**
 * The priority queue here is a plain array, re-sorted every iteration
 * instead of a binary heap - O(n log n) per extraction instead of
 * O(log n), but it makes "what's in the queue right now, in order"
 * trivial to show at every step, which matters more than raw
 * performance for a graph this size.
 */
export function dijkstra(graph: Graph, start: string): Step[] {
  const rec = new GraphStepRecorder();
  const distances: Record<string, number> = {};
  for (const node of graph.nodes) distances[node.id] = Infinity;
  distances[start] = 0;

  type PQEntry = { node: string; dist: number };
  const pq: PQEntry[] = [{ node: start, dist: 0 }];
  const visited = new Set<string>();
  const pqLabels = () => pq.map((e) => `${e.node}:${formatDist(e.dist)}`);

  rec.record({
    lineOfCode: 2,
    description: `Initialize distances: ${start} = 0, everything else = infinity.`,
    variables: { distances: { ...distances } },
    priorityQueue: pqLabels(),
  });

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    rec.record({
      lineOfCode: 6,
      description: "Sort the priority queue so the closest node is first.",
      variables: { distances: { ...distances } },
      priorityQueue: pqLabels(),
    });

    const { node, dist } = pq.shift()!;

    if (visited.has(node)) {
      rec.record({
        lineOfCode: 8,
        description: `${node} was already finalized with a shorter distance - skip this stale entry.`,
        variables: { node, dist, distances: { ...distances } },
        currentNode: node,
        priorityQueue: pqLabels(),
      });
      continue;
    }

    visited.add(node);
    rec.markVisited(node);
    rec.record({
      lineOfCode: 9,
      description: `Extract ${node} (distance ${dist}) - this is now its final shortest distance.`,
      variables: { node, dist, distances: { ...distances } },
      currentNode: node,
      priorityQueue: pqLabels(),
    });

    for (const { id: neighbor, weight } of getNeighbors(graph, node)) {
      const newDist = dist + weight;
      const improves = newDist < distances[neighbor];
      rec.record({
        lineOfCode: 12,
        description: improves
          ? `${node} -> ${neighbor}: ${dist} + ${weight} = ${newDist}, better than ${formatDist(distances[neighbor])} - relax it.`
          : `${node} -> ${neighbor}: ${dist} + ${weight} = ${newDist}, not better than ${formatDist(distances[neighbor])} - skip.`,
        variables: { node, neighbor, weight, newDist, distances: { ...distances } },
        currentNode: node,
        currentEdge: [node, neighbor],
        priorityQueue: pqLabels(),
      });

      if (improves) {
        distances[neighbor] = newDist;
        rec.setTreeEdge(node, neighbor);
        pq.push({ node: neighbor, dist: newDist });
        rec.record({
          lineOfCode: 13,
          description: `Update distance[${neighbor}] = ${newDist} and add it to the priority queue.`,
          variables: { node, neighbor, newDist, distances: { ...distances } },
          currentNode: node,
          currentEdge: [node, neighbor],
          priorityQueue: pqLabels(),
        });
      }
    }
  }

  rec.record({
    lineOfCode: 18,
    description:
      "Priority queue is empty - Dijkstra complete. Every reachable node has its shortest distance.",
    variables: { distances: { ...distances } },
    priorityQueue: [],
  });

  return rec.getSteps();
}
