import type { Step } from "@/types/step";
import type { LanguageSources } from "./languages";
import { StepRecorder } from "./step-recorder";

// Line-for-line across all three languages (and MERGE_SORT_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const MERGE_SORT_SOURCES: LanguageSources = {
  java: [
    "static void mergeSort(int[] arr, int lo, int hi) {",
    "  if (lo >= hi) return;",
    "  int mid = (lo + hi) / 2;",
    "  mergeSort(arr, lo, mid);",
    "  mergeSort(arr, mid + 1, hi);",
    "  merge(arr, lo, mid, hi);",
    "}",
    "",
    "static void merge(int[] arr, int lo, int mid, int hi) {",
    "  int[] left = Arrays.copyOfRange(arr, lo, mid + 1);",
    "  int[] right = Arrays.copyOfRange(arr, mid + 1, hi + 1);",
    "  int i = 0, j = 0, k = lo;",
    "  while (i < left.length && j < right.length) {",
    "    if (left[i] <= right[j]) {",
    "      arr[k] = left[i];",
    "      i++;",
    "    } else {",
    "      arr[k] = right[j];",
    "      j++;",
    "    }",
    "    k++;",
    "  }",
    "  while (i < left.length) {",
    "    arr[k] = left[i];",
    "    i++;",
    "    k++;",
    "  }",
    "  while (j < right.length) {",
    "    arr[k] = right[j];",
    "    j++;",
    "    k++;",
    "  }",
    "}",
  ],
  cpp: [
    "void mergeSort(vector<int>& arr, int lo, int hi) {",
    "  if (lo >= hi) return;",
    "  int mid = (lo + hi) / 2;",
    "  mergeSort(arr, lo, mid);",
    "  mergeSort(arr, mid + 1, hi);",
    "  merge(arr, lo, mid, hi);",
    "}",
    "",
    "void merge(vector<int>& arr, int lo, int mid, int hi) {",
    "  vector<int> left(arr.begin() + lo, arr.begin() + mid + 1);",
    "  vector<int> right(arr.begin() + mid + 1, arr.begin() + hi + 1);",
    "  int i = 0, j = 0, k = lo;",
    "  while (i < left.size() && j < right.size()) {",
    "    if (left[i] <= right[j]) {",
    "      arr[k] = left[i];",
    "      i++;",
    "    } else {",
    "      arr[k] = right[j];",
    "      j++;",
    "    }",
    "    k++;",
    "  }",
    "  while (i < left.size()) {",
    "    arr[k] = left[i];",
    "    i++;",
    "    k++;",
    "  }",
    "  while (j < right.size()) {",
    "    arr[k] = right[j];",
    "    j++;",
    "    k++;",
    "  }",
    "}",
  ],
  python: [
    "def merge_sort(arr, lo, hi):",
    "    if lo >= hi: return",
    "    mid = (lo + hi) // 2",
    "    merge_sort(arr, lo, mid)",
    "    merge_sort(arr, mid + 1, hi)",
    "    merge(arr, lo, mid, hi)",
    "    # end merge_sort",
    "",
    "def merge(arr, lo, mid, hi):",
    "    left = arr[lo:mid + 1]",
    "    right = arr[mid + 1:hi + 1]",
    "    i, j, k = 0, 0, lo",
    "    while i < len(left) and j < len(right):",
    "        if left[i] <= right[j]:",
    "            arr[k] = left[i]",
    "            i += 1",
    "        else:",
    "            arr[k] = right[j]",
    "            j += 1",
    "        # end if",
    "        k += 1",
    "    # end while",
    "    while i < len(left):",
    "        arr[k] = left[i]",
    "        i += 1",
    "        k += 1",
    "    # end while",
    "    while j < len(right):",
    "        arr[k] = right[j]",
    "        j += 1",
    "        k += 1",
    "    # end while",
    "    # end merge",
  ],
};

// Line-for-line pseudocode counterpart to MERGE_SORT_SOURCE - every
// lineOfCode the algorithm below emits refers to the same line number
// in both, so swapping between them never breaks highlighting.
export const MERGE_SORT_PSEUDOCODE = [
  "function mergeSort(array, lo, hi)",
  "    if lo >= hi, return",
  "    mid = middle index of lo..hi",
  "    mergeSort(array, lo, mid)",
  "    mergeSort(array, mid + 1, hi)",
  "    merge(array, lo, mid, hi)",
  "end function",
  "",
  "function merge(array, lo, mid, hi)",
  "    left = copy of array[lo..mid]",
  "    right = copy of array[mid+1..hi]",
  "    i = 0, j = 0, k = lo",
  "    while i < length(left) and j < length(right)",
  "        if left[i] <= right[j]",
  "            array[k] = left[i]",
  "            i = i + 1",
  "        else",
  "            array[k] = right[j]",
  "            j = j + 1",
  "        end if",
  "        k = k + 1",
  "    end while",
  "    while i < length(left)",
  "        array[k] = left[i]",
  "        i = i + 1",
  "        k = k + 1",
  "    end while",
  "    while j < length(right)",
  "        array[k] = right[j]",
  "        j = j + 1",
  "        k = k + 1",
  "    end while",
  "end function",
];

/**
 * Merge sort never finalizes an index's position until the outermost
 * merge (the one spanning the whole array) completes - a range merged
 * at a deeper recursion level is only sorted *relative to itself* and
 * can still be reordered by a later merge with its sibling range. So
 * sortedIndices only gets populated once, at that final merge.
 */
export function mergeSort(input: number[]): Step[] {
  const arr = [...input];
  const n = arr.length;
  const rec = new StepRecorder();

  function merge(lo: number, mid: number, hi: number) {
    rec.pushCall({ fnName: "merge", args: [lo, mid, hi] });
    rec.record({
      lineOfCode: 9,
      description: `Merge the sorted halves [${lo}, ${mid}] and [${mid + 1}, ${hi}].`,
      variables: { lo, mid, hi },
      pointers: { lo, mid, hi },
      dividers: [mid],
      array: arr,
    });

    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    rec.record({
      lineOfCode: 11,
      description: `Copy out the left half [${left.join(", ")}] and right half [${right.join(", ")}].`,
      variables: { lo, mid, hi, left, right },
      pointers: { lo, mid, hi },
      dividers: [mid],
      array: arr,
    });

    let i = 0;
    let j = 0;
    let k = lo;
    rec.record({
      lineOfCode: 12,
      description: "Set up pointers i, j into the two copies, and k into the array.",
      variables: { i, j, k },
      pointers: { i, j, k },
      dividers: [mid],
      array: arr,
    });

    while (i < left.length && j < right.length) {
      const takeLeft = left[i] <= right[j];
      rec.record({
        lineOfCode: 14,
        description: takeLeft
          ? `left[${i}] = ${left[i]} <= right[${j}] = ${right[j]}, so take ${left[i]} from the left half.`
          : `left[${i}] = ${left[i]} > right[${j}] = ${right[j]}, so take ${right[j]} from the right half.`,
        variables: { i, j, k, left, right },
        pointers: { i, j, k },
        dividers: [mid],
        comparisonMade: true,
        array: arr,
      });

      const value = takeLeft ? left[i] : right[j];
      arr[k] = value;
      if (takeLeft) i++;
      else j++;

      rec.record({
        lineOfCode: takeLeft ? 15 : 18,
        description: `Write ${value} into position ${k}.`,
        variables: { i, j, k, left, right },
        pointers: { i, j, k },
        swapping: [k, k],
        dividers: [mid],
        array: arr,
      });
      k++;
    }

    while (i < left.length) {
      const value = left[i];
      arr[k] = value;
      rec.record({
        lineOfCode: 24,
        description: `Left half has leftover values - write ${value} into position ${k}.`,
        variables: { i, j, k, left, right },
        pointers: { i, j, k },
        swapping: [k, k],
        dividers: [mid],
        array: arr,
      });
      i++;
      k++;
    }

    while (j < right.length) {
      const value = right[j];
      arr[k] = value;
      rec.record({
        lineOfCode: 29,
        description: `Right half has leftover values - write ${value} into position ${k}.`,
        variables: { i, j, k, left, right },
        pointers: { i, j, k },
        swapping: [k, k],
        dividers: [mid],
        array: arr,
      });
      j++;
      k++;
    }

    const isFullArray = lo === 0 && hi === n - 1;
    if (isFullArray) rec.markAllSorted(n);
    rec.record({
      lineOfCode: 33,
      description: isFullArray
        ? "Merge complete - the array is fully sorted!"
        : `Merge complete. [${lo}, ${hi}] is sorted relative to itself, but may still move again in a later merge.`,
      variables: { lo, mid, hi },
      pointers: { lo, mid, hi },
      array: arr,
    });

    rec.popCall();
  }

  function sort(lo: number, hi: number) {
    rec.pushCall({ fnName: "mergeSort", args: [lo, hi] });
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
      // A lone element in a *subrange* isn't final - it can still move
      // when this range is merged with its sibling higher up. Only the
      // n === 1 whole-array case (handled after the top-level call
      // below) is actually final.
      rec.popCall();
      return;
    }

    const mid = Math.floor((lo + hi) / 2);
    rec.record({
      lineOfCode: 3,
      description: `Split at mid = ${mid}.`,
      variables: { lo, hi, mid },
      pointers: { lo, mid, hi },
      dividers: [mid],
      array: arr,
    });

    rec.record({
      lineOfCode: 4,
      description: `Recursively sort the left half [${lo}, ${mid}].`,
      variables: { lo, hi, mid },
      pointers: { lo, mid, hi },
      dividers: [mid],
      array: arr,
    });
    sort(lo, mid);

    rec.record({
      lineOfCode: 5,
      description: `Recursively sort the right half [${mid + 1}, ${hi}].`,
      variables: { lo, hi, mid },
      pointers: { lo, mid, hi },
      dividers: [mid],
      array: arr,
    });
    sort(mid + 1, hi);

    rec.record({
      lineOfCode: 6,
      description: "Both halves are sorted individually - merge them.",
      variables: { lo, hi, mid },
      pointers: { lo, mid, hi },
      dividers: [mid],
      array: arr,
    });
    merge(lo, mid, hi);

    rec.popCall();
  }

  if (n > 0) sort(0, n - 1);

  if (n <= 1) {
    if (n === 1) rec.markSorted(0);
    rec.record({
      lineOfCode: 7,
      description: n === 0 ? "Empty array - nothing to sort." : "Single element - already sorted.",
      variables: { n },
      array: arr,
    });
  }

  return rec.getSteps();
}
