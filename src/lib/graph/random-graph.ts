import type { Graph, GraphNode } from "./types";

const NODE_LETTERS = "ABCDEFGH".split("");
const CENTER_X = 300;
const CENTER_Y = 190;
const RADIUS = 160;

/** Places node ids evenly around a circle - shared by random graph
 * generation and custom graph parsing so a hand-typed edge list gets
 * the same readable layout a random graph would. */
export function circularLayout(ids: string[]): GraphNode[] {
  return ids.map((id, i) => {
    const angle = (2 * Math.PI * i) / ids.length - Math.PI / 2;
    return {
      id,
      x: Math.round(CENTER_X + RADIUS * Math.cos(angle)),
      y: Math.round(CENTER_Y + RADIUS * Math.sin(angle)),
    };
  });
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomWeight(): number {
  return 1 + Math.floor(Math.random() * 10);
}

/**
 * Builds a random connected graph: a spanning tree first (each node
 * links to some earlier node in a shuffled order, which by construction
 * makes every node reachable from every other), then a handful of extra
 * edges layered on for cycles and alternate paths. Connectivity is
 * guaranteed by construction rather than checked after the fact -
 * BFS/DFS/Dijkstra all assume the graph is reachable from the start
 * node, and an accidentally-disconnected random graph would make that
 * assumption silently false instead of a visible edge case.
 */
export function generateRandomGraph(): Graph {
  const nodeCount = 5 + Math.floor(Math.random() * 4); // 5-8 nodes
  const ids = NODE_LETTERS.slice(0, nodeCount);

  const nodes = circularLayout(ids);

  const shuffled = shuffle(ids);
  const edges: Graph["edges"] = [];
  for (let i = 1; i < shuffled.length; i++) {
    const from = shuffled[i];
    const to = shuffled[Math.floor(Math.random() * i)];
    edges.push({ from, to, weight: randomWeight() });
  }

  const extraEdgeTarget = edges.length + Math.floor(nodeCount / 2);
  let attempts = 0;
  while (edges.length < extraEdgeTarget && attempts < 30) {
    attempts++;
    const a = ids[Math.floor(Math.random() * ids.length)];
    const b = ids[Math.floor(Math.random() * ids.length)];
    if (a === b) continue;
    const alreadyExists = edges.some(
      (edge) => (edge.from === a && edge.to === b) || (edge.from === b && edge.to === a)
    );
    if (alreadyExists) continue;
    edges.push({ from: a, to: b, weight: randomWeight() });
  }

  return { nodes, edges };
}
