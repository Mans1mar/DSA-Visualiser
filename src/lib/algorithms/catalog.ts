import { BUBBLE_SORT_SOURCES, BUBBLE_SORT_PSEUDOCODE, bubbleSort } from "./bubble-sort";
import {
  INSERTION_SORT_SOURCES,
  INSERTION_SORT_PSEUDOCODE,
  insertionSort,
} from "./insertion-sort";
import { MERGE_SORT_SOURCES, MERGE_SORT_PSEUDOCODE, mergeSort } from "./merge-sort";
import { QUICK_SORT_SOURCES, QUICK_SORT_PSEUDOCODE, quickSort } from "./quick-sort";
import {
  SELECTION_SORT_SOURCES,
  SELECTION_SORT_PSEUDOCODE,
  selectionSort,
} from "./selection-sort";
import { BFS_SOURCES, BFS_PSEUDOCODE, bfs } from "./bfs";
import { DFS_SOURCES, DFS_PSEUDOCODE, dfs } from "./dfs";
import { DIJKSTRA_SOURCES, DIJKSTRA_PSEUDOCODE, dijkstra } from "./dijkstra";
import { SAMPLE_GRAPH, SAMPLE_GRAPH_START } from "@/lib/graph/sample-graph";
import type { Graph } from "@/lib/graph/types";
import type { LanguageSources } from "./languages";
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
  /** Real, runnable-ish code in each language, shown via the standalone
   * Code tab's language switcher - line-for-line matched across all
   * three languages (and against `pseudocode` below) so the same
   * lineOfCode highlights the right line no matter which is showing. */
  sources: LanguageSources;
  /** Higher-level pseudocode shown inline next to the visualization. */
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
    sources: MERGE_SORT_SOURCES,
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
    sources: QUICK_SORT_SOURCES,
    pseudocode: QUICK_SORT_PSEUDOCODE,
    sampleInput: SAMPLE_INPUT,
    run: quickSort,
  },
  "bubble-sort": {
    kind: "array",
    slug: "bubble-sort",
    name: "Bubble Sort",
    category: "Sorting",
    difficulty: "Easy",
    shortDescription:
      "Repeatedly steps through the array, swapping adjacent elements that are out of order.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    overview: {
      whatItDoes:
        "Bubble Sort repeatedly steps through the array, comparing each pair of adjacent elements and swapping them if they're out of order. Each full pass bubbles the largest remaining value up to its final position at the end of the unsorted range, and the passes repeat until one completes with no swaps.",
      whenToUse:
        "Rarely the right choice for real workloads - reach for it mainly as a teaching tool for the idea of repeated adjacent comparisons, or for tiny or nearly-sorted inputs where its early-exit optimization makes it competitive.",
      pros: [
        "Extremely simple to understand and implement",
        "In-place - O(1) extra memory",
        "Early-exit optimization makes it O(n) on already-sorted input",
        "Stable - equal elements retain their original order",
      ],
      cons: [
        "O(n²) time on average and in the worst case",
        "Far more swaps in practice than Selection Sort for the same input",
        "Rarely used outside of teaching",
      ],
    },
    complexityComparison:
      "Selection Sort makes the same O(n²) comparisons but far fewer swaps, since it swaps at most once per pass instead of on every out-of-order pair. Insertion Sort is usually faster in practice on nearly-sorted data. Merge Sort and Quick Sort both beat Bubble Sort asymptotically at O(n log n).",
    sources: BUBBLE_SORT_SOURCES,
    pseudocode: BUBBLE_SORT_PSEUDOCODE,
    sampleInput: SAMPLE_INPUT,
    run: bubbleSort,
  },
  "selection-sort": {
    kind: "array",
    slug: "selection-sort",
    name: "Selection Sort",
    category: "Sorting",
    difficulty: "Easy",
    shortDescription:
      "Repeatedly selects the minimum of the unsorted portion and swaps it into place.",
    timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    overview: {
      whatItDoes:
        "Selection Sort divides the array into a sorted prefix and an unsorted suffix. On each pass it scans the entire unsorted suffix to find its minimum, then swaps that minimum into the next position of the sorted prefix.",
      whenToUse:
        "When the cost of a swap is much higher than the cost of a comparison - for example writing to slow memory. Selection Sort makes at most n - 1 swaps total, far fewer than Bubble Sort, at the cost of always scanning the full remaining range even when the input is already sorted.",
      pros: [
        "Simple to implement",
        "In-place - O(1) extra memory",
        "Minimizes the number of swaps - at most n - 1 total",
      ],
      cons: [
        "O(n²) time in every case - doesn't benefit at all from partially-sorted input",
        "Not stable in its typical implementation - equal elements can be reordered",
        "Slower in practice than Insertion Sort despite fewer swaps, due to always scanning the full remaining range",
      ],
    },
    complexityComparison:
      "Bubble Sort and Insertion Sort can finish early or skip work on nearly-sorted input; Selection Sort always performs the same O(n²) comparisons regardless of input order, trading that adaptability for a guaranteed low swap count.",
    sources: SELECTION_SORT_SOURCES,
    pseudocode: SELECTION_SORT_PSEUDOCODE,
    sampleInput: SAMPLE_INPUT,
    run: selectionSort,
  },
  "insertion-sort": {
    kind: "array",
    slug: "insertion-sort",
    name: "Insertion Sort",
    category: "Sorting",
    difficulty: "Easy",
    shortDescription:
      "Builds a sorted prefix one element at a time by shifting larger values right.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    overview: {
      whatItDoes:
        "Insertion Sort builds up a sorted prefix one element at a time: it takes the next unsorted element and shifts larger elements in the sorted prefix rightward until it finds the correct place to insert it.",
      whenToUse:
        "For small arrays or nearly-sorted data, where it's typically the fastest simple sort - many production sort implementations fall back to Insertion Sort below some small size threshold. Also useful as an online algorithm, sorting data as it arrives.",
      pros: [
        "Adaptive - runs in close to O(n) time on nearly-sorted input",
        "Stable - equal elements retain their original order",
        "In-place - O(1) extra memory",
        "Works well as an online algorithm, sorting data as it arrives",
      ],
      cons: [
        "O(n²) time on average and in the worst case for random or reverse-sorted input",
        "Shifting elements makes it slower than Selection Sort's raw swap count on large, randomly-ordered arrays",
      ],
    },
    complexityComparison:
      "Insertion Sort is the most adaptive of the three simple sorts - it does the least work on nearly-sorted input, unlike Selection Sort's constant O(n²) regardless of order. Merge Sort and Quick Sort both scale better to large inputs at O(n log n), but carry more overhead that makes Insertion Sort competitive at small sizes.",
    sources: INSERTION_SORT_SOURCES,
    pseudocode: INSERTION_SORT_PSEUDOCODE,
    sampleInput: SAMPLE_INPUT,
    run: insertionSort,
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
    sources: BFS_SOURCES,
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
    sources: DFS_SOURCES,
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
    sources: DIJKSTRA_SOURCES,
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

const DIFFICULTY_ORDER: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 };

export function getAlgorithmsByCategory(category: Category): AlgorithmMeta[] {
  return getAllAlgorithms()
    .filter((algorithm) => algorithm.category === category)
    .sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
}

/** Runs an algorithm against an explicit input (a custom/random array or
 * graph, or the algorithm's own default), dispatching on kind - the one
 * place that needs to know array vs graph run() signatures differ, so
 * callers (the single algorithm page, Comparison Mode) don't each have
 * to re-derive it. Graph runs always start from the first node in the
 * given graph, falling back to the algorithm's declared start node only
 * when using the algorithm's own default graph. */
export function runAlgorithmWithInput(
  algorithm: AlgorithmMeta,
  input: number[] | Graph
): Step[] {
  return algorithm.kind === "array"
    ? algorithm.run(input as number[])
    : algorithm.run(input as Graph, (input as Graph).nodes[0]?.id ?? algorithm.startNode);
}

/** Runs an algorithm against its own sample input. */
export function runAlgorithm(algorithm: AlgorithmMeta): Step[] {
  return runAlgorithmWithInput(
    algorithm,
    algorithm.kind === "array" ? algorithm.sampleInput : algorithm.graph
  );
}
