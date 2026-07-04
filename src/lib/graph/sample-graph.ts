import type { Graph } from "./types";

/** Hand-placed layout - one connected, undirected, weighted graph shared
 * by BFS, DFS, and Dijkstra so all three run on the same input. */
export const SAMPLE_GRAPH: Graph = {
  nodes: [
    { id: "A", x: 60, y: 190 },
    { id: "B", x: 190, y: 60 },
    { id: "C", x: 190, y: 320 },
    { id: "D", x: 330, y: 130 },
    { id: "E", x: 330, y: 290 },
    { id: "F", x: 460, y: 200 },
    { id: "G", x: 500, y: 70 },
  ],
  edges: [
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "C", weight: 2 },
    { from: "B", to: "C", weight: 1 },
    { from: "B", to: "D", weight: 5 },
    { from: "C", to: "D", weight: 8 },
    { from: "C", to: "E", weight: 10 },
    { from: "D", to: "E", weight: 2 },
    { from: "D", to: "F", weight: 6 },
    { from: "E", to: "F", weight: 3 },
    { from: "E", to: "G", weight: 9 },
    { from: "F", to: "G", weight: 1 },
  ],
};

export const SAMPLE_GRAPH_START = "A";
