import { MERGE_SORT_SOURCE, mergeSort } from "./merge-sort";
import { QUICK_SORT_SOURCE, quickSort } from "./quick-sort";
import type { Step } from "@/types/step";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Category = "Sorting" | "Graph" | "Tree" | "Searching";

export type ComplexityRow = {
  best: string;
  average: string;
  worst: string;
};

export type AlgorithmMeta = {
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
  source: string[];
  sampleInput: number[];
  run: (input: number[]) => Step[];
};

const SAMPLE_INPUT = [8, 3, 5, 4, 7, 6, 1, 2];

export const ALGORITHM_CATALOG: Record<string, AlgorithmMeta> = {
  "merge-sort": {
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
    sampleInput: SAMPLE_INPUT,
    run: mergeSort,
  },
  "quick-sort": {
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
    sampleInput: SAMPLE_INPUT,
    run: quickSort,
  },
};

export function getAlgorithm(slug: string): AlgorithmMeta | undefined {
  return ALGORITHM_CATALOG[slug];
}

/** Homepage category order. Graph/Tree/Searching render as "coming soon"
 * until their algorithms exist (Tree and Searching stay that way for the
 * whole MVP; Graph fills in once Phase 6 lands). */
export const CATEGORY_ORDER: Category[] = ["Sorting", "Graph", "Tree", "Searching"];

export function getAllAlgorithms(): AlgorithmMeta[] {
  return Object.values(ALGORITHM_CATALOG);
}

export function getAlgorithmsByCategory(category: Category): AlgorithmMeta[] {
  return getAllAlgorithms().filter((algorithm) => algorithm.category === category);
}
