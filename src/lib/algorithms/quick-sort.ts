import type { Step } from "@/types/step";
import type { LanguageSources } from "./languages";
import { StepRecorder } from "./step-recorder";

// Line-for-line across all three languages (and QUICK_SORT_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const QUICK_SORT_SOURCES: LanguageSources = {
  java: [
    "static void quickSort(int[] arr, int lo, int hi) {",
    "  if (lo >= hi) return;",
    "  int p = partition(arr, lo, hi);",
    "  quickSort(arr, lo, p - 1);",
    "  quickSort(arr, p + 1, hi);",
    "}",
    "",
    "static int partition(int[] arr, int lo, int hi) {",
    "  int pivot = arr[hi];",
    "  int i = lo - 1;",
    "  for (int j = lo; j < hi; j++) {",
    "    if (arr[j] < pivot) {",
    "      i++;",
    "      swap(arr, i, j);",
    "    }",
    "  }",
    "  swap(arr, i + 1, hi);",
    "  return i + 1;",
    "}",
  ],
  cpp: [
    "void quickSort(vector<int>& arr, int lo, int hi) {",
    "  if (lo >= hi) return;",
    "  int p = partition(arr, lo, hi);",
    "  quickSort(arr, lo, p - 1);",
    "  quickSort(arr, p + 1, hi);",
    "}",
    "",
    "int partition(vector<int>& arr, int lo, int hi) {",
    "  int pivot = arr[hi];",
    "  int i = lo - 1;",
    "  for (int j = lo; j < hi; j++) {",
    "    if (arr[j] < pivot) {",
    "      i++;",
    "      swap(arr[i], arr[j]);",
    "    }",
    "  }",
    "  swap(arr[i + 1], arr[hi]);",
    "  return i + 1;",
    "}",
  ],
  python: [
    "def quick_sort(arr, lo, hi):",
    "    if lo >= hi: return",
    "    p = partition(arr, lo, hi)",
    "    quick_sort(arr, lo, p - 1)",
    "    quick_sort(arr, p + 1, hi)",
    "    # end quick_sort",
    "",
    "def partition(arr, lo, hi):",
    "    pivot = arr[hi]",
    "    i = lo - 1",
    "    for j in range(lo, hi):",
    "        if arr[j] < pivot:",
    "            i += 1",
    "            arr[i], arr[j] = arr[j], arr[i]",
    "        # end if",
    "    # end for",
    "    arr[i + 1], arr[hi] = arr[hi], arr[i + 1]",
    "    return i + 1",
    "    # end partition",
  ],
};

// Line-for-line pseudocode counterpart to QUICK_SORT_SOURCE.
export const QUICK_SORT_PSEUDOCODE = [
  "function quickSort(array, lo, hi)",
  "    if lo >= hi, return",
  "    p = partition(array, lo, hi)",
  "    quickSort(array, lo, p - 1)",
  "    quickSort(array, p + 1, hi)",
  "end function",
  "",
  "function partition(array, lo, hi)",
  "    pivot = array[hi]",
  "    i = lo - 1",
  "    for j = lo to hi - 1",
  "        if array[j] < pivot",
  "            i = i + 1",
  "            swap array[i] and array[j]",
  "        end if",
  "    end for",
  "    swap array[i + 1] and array[hi]",
  "    return i + 1",
  "end function",
];

/**
 * Lomuto partitioning places the pivot at its final sorted index the
 * moment partition() returns - later recursive calls only ever touch
 * [lo, p-1] and [p+1, hi], so that index is provably never touched
 * again. sortedIndices can therefore grow incrementally, unlike merge
 * sort where nothing is final until the last merge.
 */
export function quickSort(input: number[]): Step[] {
  const arr = [...input];
  const n = arr.length;
  const rec = new StepRecorder();

  function swap(i: number, j: number) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // The pivot at index p splits [lo, hi] into [lo, p-1] and [p+1, hi] -
  // bracket it with dividers on whichever sides are non-empty.
  function pivotDividers(lo: number, hi: number, p: number): number[] {
    const dividers: number[] = [];
    if (p > lo) dividers.push(p - 1);
    if (p < hi) dividers.push(p);
    return dividers;
  }

  function partition(lo: number, hi: number): number {
    rec.pushCall({ fnName: "partition", args: [lo, hi] });

    const pivot = arr[hi];
    rec.record({
      lineOfCode: 9,
      description: `Choose the pivot: arr[${hi}] = ${pivot}.`,
      variables: { lo, hi, pivot },
      pointers: { lo, hi, pivot: hi },
      array: arr,
    });

    let i = lo - 1;
    rec.record({
      lineOfCode: 10,
      description: `Init i = ${i}. i tracks the boundary of values known to be less than the pivot.`,
      variables: { lo, hi, pivot, i },
      pointers: { lo, hi, i, pivot: hi },
      array: arr,
    });

    for (let j = lo; j < hi; j++) {
      const isLess = arr[j] < pivot;
      rec.record({
        lineOfCode: 12,
        description: isLess
          ? `arr[${j}] = ${arr[j]} < pivot (${pivot}), so it belongs on the left - swap it in.`
          : `arr[${j}] = ${arr[j]} >= pivot (${pivot}), leave it where it is.`,
        variables: { lo, hi, pivot, i, j },
        pointers: { lo, hi, i, j, pivot: hi },
        comparing: [j, hi],
        comparisonMade: true,
        array: arr,
      });

      if (isLess) {
        i++;
        if (i !== j) {
          rec.record({
            lineOfCode: 14,
            description: `Swap arr[${i}] and arr[${j}].`,
            variables: { lo, hi, pivot, i, j },
            pointers: { lo, hi, i, j, pivot: hi },
            swapping: [i, j],
            array: arr,
          });
          swap(i, j);
          rec.record({
            lineOfCode: 14,
            description: `Swapped. Array is now [${arr.join(", ")}].`,
            variables: { lo, hi, pivot, i, j },
            pointers: { lo, hi, i, j, pivot: hi },
            array: arr,
          });
        }
      }
    }

    rec.record({
      lineOfCode: 17,
      description: `Place the pivot in its final position - swap arr[${i + 1}] and arr[${hi}].`,
      variables: { lo, hi, pivot, i },
      pointers: { lo, hi, i, pivot: hi },
      swapping: [i + 1, hi],
      array: arr,
    });
    swap(i + 1, hi);
    rec.markSorted(i + 1);
    rec.record({
      lineOfCode: 18,
      description: `${pivot} is now in its final sorted position at index ${i + 1}.`,
      variables: { lo, hi, pivot, finalIndex: i + 1 },
      pointers: { lo, hi, pivot: i + 1 },
      dividers: pivotDividers(lo, hi, i + 1),
      array: arr,
    });

    rec.popCall();
    return i + 1;
  }

  function sort(lo: number, hi: number) {
    rec.pushCall({ fnName: "quickSort", args: [lo, hi] });
    rec.record({
      lineOfCode: 1,
      description:
        lo >= hi
          ? `Range [${lo}, ${hi}] has 0 or 1 elements - nothing to do.`
          : `Sort the range [${lo}, ${hi}].`,
      variables: { lo, hi },
      pointers: { lo, hi },
      array: arr,
    });

    if (lo >= hi) {
      if (lo === hi) rec.markSorted(lo);
      rec.popCall();
      return;
    }

    const p = partition(lo, hi);

    rec.record({
      lineOfCode: 4,
      description: `Recursively sort the left partition [${lo}, ${p - 1}].`,
      variables: { lo, hi, p },
      pointers: { lo, hi, p },
      dividers: pivotDividers(lo, hi, p),
      array: arr,
    });
    sort(lo, p - 1);

    rec.record({
      lineOfCode: 5,
      description: `Recursively sort the right partition [${p + 1}, ${hi}].`,
      variables: { lo, hi, p },
      pointers: { lo, hi, p },
      dividers: pivotDividers(lo, hi, p),
      array: arr,
    });
    sort(p + 1, hi);

    rec.popCall();
  }

  if (n > 0) sort(0, n - 1);

  if (n <= 1 && n === 1) rec.markSorted(0);

  rec.record({
    lineOfCode: 6,
    description:
      n <= 1 ? "Nothing to sort." : "The array is fully sorted.",
    variables: { n },
    array: arr,
  });

  return rec.getSteps();
}
