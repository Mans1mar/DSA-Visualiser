import { BFS_SOURCES, BFS_PSEUDOCODE, bfs } from "./bfs";
import { BINARY_SEARCH_SOURCES, BINARY_SEARCH_PSEUDOCODE, binarySearch } from "./binary-search";
import { BST_DELETE_SOURCES, BST_DELETE_PSEUDOCODE, bstDelete } from "./bst-delete";
import { BST_INORDER_SOURCES, BST_INORDER_PSEUDOCODE, bstInorder } from "./bst-inorder";
import { BST_INSERT_SOURCES, BST_INSERT_PSEUDOCODE, bstInsert } from "./bst-insert";
import {
  BST_LEVELORDER_SOURCES,
  BST_LEVELORDER_PSEUDOCODE,
  bstLevelOrder,
} from "./bst-levelorder";
import { BST_POSTORDER_SOURCES, BST_POSTORDER_PSEUDOCODE, bstPostorder } from "./bst-postorder";
import { BST_PREORDER_SOURCES, BST_PREORDER_PSEUDOCODE, bstPreorder } from "./bst-preorder";
import { BST_SEARCH_SOURCES, BST_SEARCH_PSEUDOCODE, bstSearch } from "./bst-search";
import { BUBBLE_SORT_SOURCES, BUBBLE_SORT_PSEUDOCODE, bubbleSort } from "./bubble-sort";
import { DFS_SOURCES, DFS_PSEUDOCODE, dfs } from "./dfs";
import { DIJKSTRA_SOURCES, DIJKSTRA_PSEUDOCODE, dijkstra } from "./dijkstra";
import {
  INSERTION_SORT_SOURCES,
  INSERTION_SORT_PSEUDOCODE,
  insertionSort,
} from "./insertion-sort";
import { JUMP_SEARCH_SOURCES, JUMP_SEARCH_PSEUDOCODE, jumpSearch } from "./jump-search";
import type { LanguageSources } from "./languages";
import { LINEAR_SEARCH_SOURCES, LINEAR_SEARCH_PSEUDOCODE, linearSearch } from "./linear-search";
import { MERGE_SORT_SOURCES, MERGE_SORT_PSEUDOCODE, mergeSort } from "./merge-sort";
import { QUICK_SORT_SOURCES, QUICK_SORT_PSEUDOCODE, quickSort } from "./quick-sort";
import { SEARCH_SAMPLE_INPUT, SEARCH_TARGET } from "./search-shared";
import {
  SELECTION_SORT_SOURCES,
  SELECTION_SORT_PSEUDOCODE,
  selectionSort,
} from "./selection-sort";
import { TREE_SAMPLE_VALUES, TREE_SEARCH_TARGET, TREE_DELETE_TARGET } from "./tree-shared";
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
  /** Only present for algorithms that search for a specific value
   * (Linear/Binary/Jump Search) - absent for Sorting, which has no
   * target. Its presence is what the UI uses to decide whether to show
   * a target input control at all. */
  defaultTarget?: number;
  run: (input: number[], target?: number) => Step[];
};

export type GraphAlgorithmMeta = BaseAlgorithmMeta & {
  kind: "graph";
  graph: Graph;
  startNode: string;
  run: (graph: Graph, start: string) => Step[];
};

export type TreeAlgorithmMeta = BaseAlgorithmMeta & {
  kind: "tree";
  /** Values inserted in order into an initially empty BST to build the
   * starting tree shown when the page loads - analogous to sampleInput
   * for array algorithms. BST Insert visualizes building up from empty
   * using this same sequence; Search/Delete/Traversals build silently
   * from it first and only visualize their own operation. */
  sampleValues: number[];
  /** Only present for Search and Delete - the value being searched for
   * or removed. Absent for Insert (nothing to target - it inserts every
   * value in sampleValues) and the four traversals (no target, just
   * walk the whole tree). Same role as ArrayAlgorithmMeta's
   * defaultTarget. */
  defaultTarget?: number;
  run: (values: number[], target?: number) => Step[];
};

export type AlgorithmMeta = ArrayAlgorithmMeta | GraphAlgorithmMeta | TreeAlgorithmMeta;

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
  "linear-search": {
    kind: "array",
    slug: "linear-search",
    name: "Linear Search",
    category: "Searching",
    difficulty: "Easy",
    shortDescription: "Checks every element left to right until the target turns up.",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    overview: {
      whatItDoes:
        "Linear Search checks each element in order, starting from the first, until it finds one equal to the target or runs out of elements to check.",
      whenToUse:
        "When the data isn't sorted and sorting it first isn't worth the cost for a single lookup, or the array is small enough that its simplicity outweighs the speed of a smarter search.",
      pros: [
        "Works on any array - no sorted-input requirement, unlike Binary or Jump Search",
        "Extremely simple to understand and implement",
        "No setup cost - nothing to prepare before the first search",
      ],
      cons: [
        "O(n) worst case - checks every element if the target is absent or last",
        "Doesn't take advantage of sorted data at all, unlike Binary or Jump Search",
      ],
    },
    complexityComparison:
      "Binary Search finds the same target in O(log n) and Jump Search in O(√n), both far faster than Linear Search's O(n) - but only because they require the array to already be sorted, a cost Linear Search never has to pay.",
    sources: LINEAR_SEARCH_SOURCES,
    pseudocode: LINEAR_SEARCH_PSEUDOCODE,
    sampleInput: SEARCH_SAMPLE_INPUT,
    defaultTarget: SEARCH_TARGET,
    run: linearSearch,
  },
  "binary-search": {
    kind: "array",
    slug: "binary-search",
    name: "Binary Search",
    category: "Searching",
    difficulty: "Easy",
    shortDescription: "Repeatedly halves a sorted array's search range around its midpoint.",
    timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(1)",
    overview: {
      whatItDoes:
        "Binary Search checks the middle element of the current search range against the target. If they match, it's done; otherwise it discards the half that can't contain the target and repeats on the remaining half, until the range is empty.",
      whenToUse:
        "When searching a sorted array (or one you can afford to sort once and search many times) - the classic choice whenever O(log n) lookups matter, such as searching a large sorted dataset or an index.",
      pros: [
        "O(log n) time - scales extremely well to large arrays",
        "Simple, well-understood, and easy to get right iteratively",
        "No extra memory beyond a couple of index variables",
      ],
      cons: [
        "Requires the array to already be sorted - sorting first costs O(n log n) if it isn't",
        "Random access only - awkward on data structures like linked lists that can't jump to an index in O(1)",
      ],
    },
    complexityComparison:
      "Jump Search trades Binary Search's O(log n) for a slower O(√n) in exchange for needing only backward jumps by a fixed block size instead of arbitrary random access - a better fit when jumping is cheap but jumping to an arbitrary index isn't. Linear Search needs no sorted precondition at all, at the cost of O(n) instead of O(log n).",
    sources: BINARY_SEARCH_SOURCES,
    pseudocode: BINARY_SEARCH_PSEUDOCODE,
    sampleInput: SEARCH_SAMPLE_INPUT,
    defaultTarget: SEARCH_TARGET,
    run: binarySearch,
  },
  "jump-search": {
    kind: "array",
    slug: "jump-search",
    name: "Jump Search",
    category: "Searching",
    difficulty: "Medium",
    shortDescription: "Jumps ahead in fixed-size blocks, then scans the block that must contain it.",
    timeComplexity: { best: "O(1)", average: "O(√n)", worst: "O(√n)" },
    spaceComplexity: "O(1)",
    overview: {
      whatItDoes:
        "Jump Search checks the last element of successive fixed-size blocks (of size √n) until it finds a block whose end is at least the target, then linearly scans just that one block for the target - never scanning more than one block plus one jump's worth of overshoot.",
      whenToUse:
        "On sorted data where jumping backward by a fixed step is cheap but random access to an arbitrary index (which Binary Search needs) is expensive or impossible - for example, sorted data on a slow-seek storage medium.",
      pros: [
        "O(√n) time - much better than Linear Search's O(n) on large arrays",
        "Only ever needs to jump forward by a fixed block size, not to an arbitrary index",
        "Simple to implement - no recursion, just a jump loop and a linear scan",
      ],
      cons: [
        "Requires the array to already be sorted, same as Binary Search",
        "Slower than Binary Search's O(log n) whenever arbitrary random access is actually available",
      ],
    },
    complexityComparison:
      "Binary Search beats Jump Search's O(√n) with O(log n), but needs arbitrary random access to the middle of any range - Jump Search only ever needs to jump ahead by a fixed block size. Linear Search needs no sorted precondition at all, at the cost of O(n).",
    sources: JUMP_SEARCH_SOURCES,
    pseudocode: JUMP_SEARCH_PSEUDOCODE,
    sampleInput: SEARCH_SAMPLE_INPUT,
    defaultTarget: SEARCH_TARGET,
    run: jumpSearch,
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
  "bst-insert": {
    kind: "tree",
    slug: "bst-insert",
    name: "BST Insert",
    category: "Tree",
    difficulty: "Easy",
    shortDescription: "Walks down from the root, comparing at each node, to find where a new value belongs.",
    timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    overview: {
      whatItDoes:
        "BST Insert walks down from the root, going left whenever the new value is smaller than the current node and right whenever it's larger, until it reaches an empty spot - that's where the new node is attached. Every value inserted this way keeps the tree's core invariant intact: everything in a node's left subtree is smaller, everything in its right subtree is larger.",
      whenToUse:
        "Whenever you need a dynamic, ordered collection that supports fast insertion alongside fast search - unlike a sorted array, which needs O(n) shifting to insert into the middle.",
      pros: [
        "O(log n) on a reasonably balanced tree - much faster than a sorted array's O(n) insert",
        "Keeps the tree's inorder traversal sorted at all times, with no separate sort step needed",
        "Simple recursive definition - a comparison and a recursive call in one direction",
      ],
      cons: [
        "Worst case O(n) if values arrive in sorted (or reverse-sorted) order - the tree degenerates into a straight chain",
        "No self-balancing here - a real-world tree that needs a worst-case guarantee reaches for AVL or red-black rules instead",
      ],
    },
    complexityComparison:
      "BST Search walks the exact same comparisons Insert does, just without attaching anything at the end - both share Insert's O(log n) average / O(n) worst case, since both depend entirely on the tree's current shape. BST Delete is the most involved of the three: it has to walk down to find the node like Insert and Search do, but then may need to search again for an inorder successor before it can finish.",
    sources: BST_INSERT_SOURCES,
    pseudocode: BST_INSERT_PSEUDOCODE,
    sampleValues: TREE_SAMPLE_VALUES,
    run: bstInsert,
  },
  "bst-search": {
    kind: "tree",
    slug: "bst-search",
    name: "BST Search",
    category: "Tree",
    difficulty: "Easy",
    shortDescription: "Walks down from the root, going left or right depending on the comparison, until it finds the target.",
    timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    overview: {
      whatItDoes:
        "BST Search compares the target against the current node - starting at the root - and moves left if the target is smaller, right if it's larger, or stops if they match. Each step rules out an entire subtree without looking at it, the same halving idea as Binary Search, but by following pointers instead of jumping to a computed midpoint.",
      whenToUse:
        "When your data already lives in a BST (built up via Insert) and you need repeated fast lookups without the upkeep of a plain sorted array, where inserting new values is expensive.",
      pros: [
        "O(log n) on a reasonably balanced tree",
        "No preprocessing needed beyond having built the tree via Insert - unlike Binary Search, which needs a sorted array",
        "Simple iterative or recursive definition, easy to reason about",
      ],
      cons: [
        "Worst case O(n) on a degenerate (chain-shaped) tree - no better than Linear Search",
        "Needs an existing tree structure - not a fit if your data is just a plain array",
      ],
    },
    complexityComparison:
      "BST Search is structurally identical to Binary Search's halving idea, but achieved by following node pointers instead of computing a midpoint index - trading Binary Search's guaranteed O(log n) (since a sorted array is always perfectly balanced) for BST Insert's O(log n) average that can degrade to O(n) if the tree itself is unbalanced. BST Delete performs this same walk first, then does extra work once it locates the node.",
    sources: BST_SEARCH_SOURCES,
    pseudocode: BST_SEARCH_PSEUDOCODE,
    sampleValues: TREE_SAMPLE_VALUES,
    defaultTarget: TREE_SEARCH_TARGET,
    run: bstSearch,
  },
  "bst-delete": {
    kind: "tree",
    slug: "bst-delete",
    name: "BST Delete",
    category: "Tree",
    difficulty: "Medium",
    shortDescription: "Locates a node like Search does, then removes it while keeping the BST shape valid.",
    timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    overview: {
      whatItDoes:
        "BST Delete first walks down to locate the target, exactly like Search. What happens next depends on how many children that node has: no children (or only one) means it can simply be removed or replaced by its one child, but two children need a stand-in - the inorder successor (the smallest value in the right subtree) - whose value gets copied into the deleted node before the successor itself is removed from further down the tree.",
      whenToUse:
        "Whenever a dynamic ordered collection needs removal as well as insertion and lookup - a plain sorted array needs O(n) shifting to delete from the middle, same as it does to insert.",
      pros: [
        "O(log n) on a reasonably balanced tree, matching Insert and Search",
        "Keeps the BST invariant intact afterward - an inorder traversal is still sorted",
        "The two-children case (copy the inorder successor, then delete it from where it was) generalizes cleanly to any node shape",
      ],
      cons: [
        "The most involved of the three core operations - three distinct cases to get right, unlike Insert and Search's single walk down",
        "Worst case O(n) on a degenerate tree, same as Insert and Search",
        "Repeated deletions can worsen an already-unbalanced tree further, with nothing here to correct it",
      ],
    },
    complexityComparison:
      "BST Delete starts with the exact same walk as BST Search, so it shares Search's O(log n) average / O(n) worst case for locating the node - the extra cost is the two-children case's second, shorter walk to find the inorder successor. Unlike Insert and Search, which only ever read or attach one node, Delete can restructure multiple parent-child links at once.",
    sources: BST_DELETE_SOURCES,
    pseudocode: BST_DELETE_PSEUDOCODE,
    sampleValues: TREE_SAMPLE_VALUES,
    defaultTarget: TREE_DELETE_TARGET,
    run: bstDelete,
  },
  "bst-inorder": {
    kind: "tree",
    slug: "bst-inorder",
    name: "Inorder Traversal",
    category: "Tree",
    difficulty: "Easy",
    shortDescription: "Visits left subtree, then this node, then right subtree - yields values in ascending order.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    overview: {
      whatItDoes:
        "Inorder Traversal recursively visits a node's left subtree, then the node itself, then its right subtree. Because a BST always keeps smaller values to the left and larger ones to the right, this order visits every value from smallest to largest - it's effectively a free sort of the tree's contents.",
      whenToUse:
        "Whenever you need a BST's values in sorted order - for example, printing a sorted report, or as the first step in rebuilding a perfectly balanced tree from an existing one.",
      pros: [
        "Produces values in ascending order for any BST, with no extra sorting step",
        "Visits every node exactly once - O(n), optimal for a full traversal",
        "Simple three-line recursive definition",
      ],
      cons: [
        "Needs O(h) auxiliary space for the recursion's call stack, which becomes O(n) on a degenerate tree",
        "Doesn't reveal the tree's shape the way Preorder or Level-order do - two very differently shaped BSTs holding the same values produce the identical inorder sequence",
      ],
    },
    complexityComparison:
      "All four traversals visit every node exactly once, so they share the same O(n) time - what differs is only the order nodes are visited in and what that order is useful for. Inorder is the one BST-specific case: only it yields sorted order, because of where it places the \"visit this node\" step relative to the left/right recursive calls.",
    sources: BST_INORDER_SOURCES,
    pseudocode: BST_INORDER_PSEUDOCODE,
    sampleValues: TREE_SAMPLE_VALUES,
    run: bstInorder,
  },
  "bst-preorder": {
    kind: "tree",
    slug: "bst-preorder",
    name: "Preorder Traversal",
    category: "Tree",
    difficulty: "Easy",
    shortDescription: "Visits this node first, then left subtree, then right subtree.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    overview: {
      whatItDoes:
        "Preorder Traversal visits a node before recursing into either of its children: this node, then its left subtree, then its right subtree. A parent always appears before its children in the resulting sequence, which is exactly what's needed to recreate the tree's shape from scratch.",
      whenToUse:
        "When you need to serialize a tree (write it out so it can be rebuilt later) or copy its structure - since parents always come before children, replaying the sequence with Insert reconstructs the same shape.",
      pros: [
        "Visits every node exactly once - O(n), optimal for a full traversal",
        "A node always appears before its children - ideal for copying or serializing tree structure",
        "Simple three-line recursive definition, just a reordering of Inorder's same three steps",
      ],
      cons: [
        "Doesn't yield sorted order the way Inorder does",
        "Needs O(h) auxiliary space for the recursion's call stack, which becomes O(n) on a degenerate tree",
      ],
    },
    complexityComparison:
      "All four traversals visit every node exactly once, so they share the same O(n) time - what differs is only the order nodes are visited in and what that order is useful for. Preorder's defining trait is that a node always precedes its children, unlike Postorder where it's the reverse.",
    sources: BST_PREORDER_SOURCES,
    pseudocode: BST_PREORDER_PSEUDOCODE,
    sampleValues: TREE_SAMPLE_VALUES,
    run: bstPreorder,
  },
  "bst-postorder": {
    kind: "tree",
    slug: "bst-postorder",
    name: "Postorder Traversal",
    category: "Tree",
    difficulty: "Easy",
    shortDescription: "Visits left subtree, then right subtree, then this node.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    overview: {
      whatItDoes:
        "Postorder Traversal visits both of a node's children before the node itself: its left subtree, then its right subtree, then the node. A node always appears only after everything beneath it, which is exactly the order needed to safely tear down or free a tree from the bottom up.",
      whenToUse:
        "When you need to process or delete a tree's nodes bottom-up - for example, freeing memory in a language without garbage collection, where a parent can't be freed while its children still need visiting.",
      pros: [
        "Visits every node exactly once - O(n), optimal for a full traversal",
        "A node always appears after both its children - the safe order for bottom-up deletion or aggregation (like computing subtree sizes)",
        "Simple three-line recursive definition, just a reordering of Inorder's same three steps",
      ],
      cons: [
        "Doesn't yield sorted order the way Inorder does",
        "Needs O(h) auxiliary space for the recursion's call stack, which becomes O(n) on a degenerate tree",
      ],
    },
    complexityComparison:
      "All four traversals visit every node exactly once, so they share the same O(n) time - what differs is only the order nodes are visited in and what that order is useful for. Postorder's defining trait is that a node always follows its children, the mirror image of Preorder.",
    sources: BST_POSTORDER_SOURCES,
    pseudocode: BST_POSTORDER_PSEUDOCODE,
    sampleValues: TREE_SAMPLE_VALUES,
    run: bstPostorder,
  },
  "bst-levelorder": {
    kind: "tree",
    slug: "bst-levelorder",
    name: "Level-order Traversal",
    category: "Tree",
    difficulty: "Easy",
    shortDescription: "Visits the root, then every node one level deeper, using a queue instead of recursion.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(w)",
    overview: {
      whatItDoes:
        "Level-order Traversal visits the root, then both its children, then all four grandchildren, and so on - breadth-first, one depth at a time. It uses an explicit queue rather than recursion: dequeue a node, visit it, enqueue its children, repeat, exactly the same shape as the Graph category's BFS.",
      whenToUse:
        "Whenever you need to process a tree level by level - for example, printing it row by row, or finding the shortest number of parent-child hops between two nodes.",
      pros: [
        "Visits every node exactly once - O(n), optimal for a full traversal",
        "The only traversal here that reveals the tree's shape level by level, rather than diving deep first",
        "No recursion needed - an explicit queue avoids any call-stack depth concerns entirely",
      ],
      cons: [
        "Needs O(w) auxiliary space for the queue, where w is the widest level - can be much more than the O(h) the other three traversals use on a wide, shallow tree",
        "Doesn't yield sorted order the way Inorder does",
      ],
    },
    complexityComparison:
      "All four traversals visit every node exactly once, so they share the same O(n) time - what differs is only the order nodes are visited in and what that order is useful for. Level-order is the odd one out structurally: Inorder, Preorder, and Postorder all recurse and pay for it in call-stack space, while Level-order trades that for an explicit queue - the same recursion-vs-queue tradeoff as DFS vs BFS on a graph.",
    sources: BST_LEVELORDER_SOURCES,
    pseudocode: BST_LEVELORDER_PSEUDOCODE,
    sampleValues: TREE_SAMPLE_VALUES,
    run: bstLevelOrder,
  },
};

export function getAlgorithm(slug: string): AlgorithmMeta | undefined {
  return ALGORITHM_CATALOG[slug];
}

/** Homepage category order. */
export const CATEGORY_ORDER: Category[] = ["Sorting", "Searching", "Graph", "Tree"];

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
 * when using the algorithm's own default graph. `target` is only
 * meaningful for array-kind search algorithms - Sorting's run()
 * functions simply don't declare a second parameter, so passing one is
 * harmless. */
export function runAlgorithmWithInput(
  algorithm: AlgorithmMeta,
  input: number[] | Graph,
  target?: number
): Step[] {
  if (algorithm.kind === "graph") {
    return algorithm.run(input as Graph, (input as Graph).nodes[0]?.id ?? algorithm.startNode);
  }
  return algorithm.run(input as number[], target);
}

/** Runs an algorithm against its own sample input (and default target,
 * for search algorithms and Tree Search/Delete). */
export function runAlgorithm(algorithm: AlgorithmMeta): Step[] {
  return runAlgorithmWithInput(
    algorithm,
    algorithm.kind === "array"
      ? algorithm.sampleInput
      : algorithm.kind === "tree"
        ? algorithm.sampleValues
        : algorithm.graph,
    algorithm.kind === "array" || algorithm.kind === "tree" ? algorithm.defaultTarget : undefined
  );
}
