import { MERGE_SORT_SOURCE, MERGE_SORT_PSEUDOCODE, mergeSort } from "./merge-sort";
import { QUICK_SORT_SOURCE, QUICK_SORT_PSEUDOCODE, quickSort } from "./quick-sort";
import { BFS_SOURCE, BFS_PSEUDOCODE, bfs } from "./bfs";
import { DFS_SOURCE, DFS_PSEUDOCODE, dfs } from "./dfs";
import { DIJKSTRA_SOURCE, DIJKSTRA_PSEUDOCODE, dijkstra } from "./dijkstra";
import { SAMPLE_GRAPH, SAMPLE_GRAPH_START } from "@/lib/graph/sample-graph";
import type { Graph } from "@/lib/graph/types";
import type { Step } from "@/types/step";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Category = "Sorting" | "Graph" | "Tree" | "Searching";

export type ComplexityRow = {
  best: string;
  average: string;
  worst: string;
};

type BaseAlgorithmMeta = {
  slug: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  shortDescription: string;
  timeComplexity: ComplexityRow;
  spaceComplexity: string;
  overview: {
    whatItDoes: string;
    whenToUse: string;
    pros: string[];
    cons: string[];
  };
  complexityComparison: string;
  /** Real, runnable-ish JS shown in the standalone Code tab. */
  source: string[];
  /** Higher-level pseudocode shown inline next to the visualization -
   * line-for-line matched to `source` so the same lineOfCode highlights
   * the right line in either one. */
  pseudocode: string[];
};

export type ArrayAlgorithmMeta = BaseAlgorithmMeta & {
  kind: "array";
  sampleInput: number[];
  run: (input: number[]) => Step[];
};

export type GraphAlgorithmMeta = BaseAlgorithmMeta & {
  kind: "graph";
  graph: Graph;
  startNode: string;
  run: (graph: Graph, start: string) => Step[];
};

export type AlgorithmMeta = ArrayAlgorithmMeta | GraphAlgorithmMeta;

const SAMPLE_INPUT = [8, 3, 5, 4, 7, 6, 1, 2];

export const ALGORITHM_CATALOG: Record<string, AlgorithmMeta> = {
  "merge-sort": {
    kind: "array",
    slug: "merge-sort",
    name: "Merge Sort",
    category: "Sorting",
    difficulty: "Medium",
    shortDescription:
      "Divide-and-conquer sort that splits the array, sorts each half, then merges.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(n)",
    overview: {
      whatItDoes:
        "Merge Sort recursively splits the array in half until each piece has at most one element, then merges pieces back together in sorted order. All of the actual sorting work happens during the merge step.",
      whenToUse:
        "When you need a guaranteed O(n log n) runtime regardless of input order, or a stable sort where equal elements must keep their original relative order - for example, sorting large datasets, linked lists, or data that doesn't fit in memory.",
      pros: [
        "Guaranteed O(n log n) time, even in the worst case",
        "Stable - equal elements retain their original order",
        "Well suited to linked lists and external sorting",
      ],
      cons: [
        "Needs O(n) extra space for the merge step - not in-place",
        "Usually slower in practice than Quick Sort on small, in-memory arrays due to allocation and copying",
      ],
    },
    complexityComparison:
      "Quick Sort is usually faster in practice thanks to better cache locality and no extra allocation, but it has an O(n²) worst case. Merge Sort trades that worst case away for a guaranteed O(n log n) runtime, at the cost of O(n) extra memory.",
    source: MERGE_SORT_SOURCE,
    pseudocode: MERGE_SORT_PSEUDOCODE,
    sampleInput: SAMPLE_INPUT,
    run: mergeSort,
  },
  "quick-sort": {
    kind: "array",
    slug: "quick-sort",
    name: "Quick Sort",
    category: "Sorting",
    difficulty: "Medium",
    shortDescription: "Partitions around a pivot, recursively sorting each side in place.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)",
    overview: {
      whatItDoes:
        "Quick Sort picks a pivot, partitions the array so smaller elements end up to its left and larger ones to its right, then recursively sorts each side. The pivot lands in its final sorted position after every partition step.",
      whenToUse:
        "When average-case speed and low memory overhead matter more than a worst-case guarantee - for example, general-purpose in-memory sorting where the input isn't adversarially ordered.",
      pros: [
        "Very fast in practice - good cache locality and sorts in place",
        "Only O(log n) extra space for the recursion, unlike Merge Sort's O(n) buffer",
        "No auxiliary array needed",
      ],
      cons: [
        "Worst case O(n²) on already-sorted or adversarial input with a naive pivot choice",
        "Not stable - equal elements can end up reordered",
      ],
    },
    complexityComparison:
      "Merge Sort guarantees O(n log n) but needs O(n) extra space. Quick Sort is typically faster and uses only O(log n) space, at the risk of degrading to O(n²) on unlucky pivot choices.",
    source: QUICK_SORT_SOURCE,
    pseudocode: QUICK_SORT_PSEUDOCODE,
    sampleInput: SAMPLE_INPUT,
    run: quickSort,
  },
  bfs: {
    kind: "graph",
    slug: "bfs",
    name: "Breadth-First Search",
    category: "Graph",
    difficulty: "Easy",
    shortDescription: "Explores a graph level by level using a queue.",
    timeComplexity: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    spaceComplexity: "O(V)",
    overview: {
      whatItDoes:
        "Breadth-First Search explores a graph outward from a start node one layer at a time, using a queue so every neighbor at the current distance gets visited before moving further away.",
      whenToUse:
        "When you need the shortest path in an unweighted graph, or need to explore nodes in order of distance from the start - for example, the fewest hops between two people in a social network, or solving a maze.",
      pros: [
        "Guarantees the shortest path (fewest edges) in an unweighted graph",
        "Simple to reason about - explores strictly in order of distance from the start",
        "Never revisits a node, so it always terminates on finite graphs",
      ],
      cons: [
        "Uses O(V) memory for the queue and visited set, significant on wide graphs",
        "Ignores edge weights - fewest hops isn't necessarily the lowest-weight path",
      ],
    },
    complexityComparison:
      "DFS explores the same graph in the same O(V + E) time but trades BFS's shortest-path guarantee for lower typical memory use, since it only needs to remember one path at a time via the call stack. Dijkstra generalizes BFS to weighted graphs at the cost of a priority queue.",
    source: BFS_SOURCE,
    pseudocode: BFS_PSEUDOCODE,
    graph: SAMPLE_GRAPH,
    startNode: SAMPLE_GRAPH_START,
    run: bfs,
  },
  dfs: {
    kind: "graph",
    slug: "dfs",
    name: "Depth-First Search",
    category: "Graph",
    difficulty: "Easy",
    shortDescription: "Explores as far as possible along each branch before backtracking.",
    timeComplexity: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    spaceComplexity: "O(V)",
    overview: {
      whatItDoes:
        "Depth-First Search dives down one path as far as it can go before backtracking, using recursion (or an explicit stack) to remember where to return to.",
      whenToUse:
        "When you need to explore every reachable node and don't care about shortest paths - for example, detecting cycles, topological sorting, or checking whether a graph is connected.",
      pros: [
        "Uses less memory than BFS on deep, narrow graphs - only needs to remember the current path",
        "Naturally suited to problems like cycle detection and topological sort",
        "Simple recursive implementation",
      ],
      cons: [
        "Doesn't guarantee the shortest path",
        "Can recurse very deeply on large graphs, risking a stack overflow without an explicit-stack rewrite",
      ],
    },
    complexityComparison:
      "BFS and DFS both run in O(V + E) time; DFS just uses the call stack instead of a queue, which is why it goes deep instead of level by level. Reach for BFS when you need shortest paths by hop count, DFS when you just need to visit everything or care about path structure like cycles or ordering.",
    source: DFS_SOURCE,
    pseudocode: DFS_PSEUDOCODE,
    graph: SAMPLE_GRAPH,
    startNode: SAMPLE_GRAPH_START,
    run: dfs,
  },
  dijkstra: {
    kind: "graph",
    slug: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "Graph",
    difficulty: "Hard",
    shortDescription: "Finds shortest paths from a source using a priority queue.",
    timeComplexity: {
      best: "O((V + E) log V)",
      average: "O((V + E) log V)",
      worst: "O((V + E) log V)",
    },
    spaceComplexity: "O(V)",
    overview: {
      whatItDoes:
        "Dijkstra's Algorithm finds the shortest path from a source node to every other node in a weighted graph with non-negative weights, always expanding the closest not-yet-finalized node next via a priority queue ordered by distance.",
      whenToUse:
        "When you need shortest paths in a weighted graph - for example, routing and navigation, network latency optimization, or any graph where some edges cost more to traverse than others.",
      pros: [
        "Guarantees the shortest path in graphs with non-negative weights",
        "More general than BFS - handles weighted edges, not just hop count",
        "Finalizes nodes one at a time, so it can stop early once a specific target is reached",
      ],
      cons: [
        "Doesn't work correctly with negative edge weights (use Bellman-Ford instead)",
        "Needs a priority queue to hit its best time complexity - a naive one degrades toward O(V²)",
      ],
    },
    complexityComparison:
      "BFS is really Dijkstra's algorithm on a graph where every edge has weight 1 - both expand the closest unvisited node first. Dijkstra generalizes that idea to weighted graphs at the cost of maintaining a priority queue instead of a plain queue. (This implementation re-sorts a plain array every iteration for visualization clarity, rather than a binary heap - correct, but not the O((V+E) log V) textbook bound.)",
    source: DIJKSTRA_SOURCE,
    pseudocode: DIJKSTRA_PSEUDOCODE,
    graph: SAMPLE_GRAPH,
    startNode: SAMPLE_GRAPH_START,
    run: dijkstra,
  },
};

export function getAlgorithm(slug: string): AlgorithmMeta | undefined {
  return ALGORITHM_CATALOG[slug];
}

/** Homepage category order. Tree and Searching stay "coming soon" for the
 * whole MVP; Graph now has BFS/DFS/Dijkstra. */
export const CATEGORY_ORDER: Category[] = ["Sorting", "Graph", "Tree", "Searching"];

export function getAllAlgorithms(): AlgorithmMeta[] {
  return Object.values(ALGORITHM_CATALOG);
}

export function getAlgorithmsByCategory(category: Category): AlgorithmMeta[] {
  return getAllAlgorithms().filter((algorithm) => algorithm.category === category);
}
