import type { Step } from "@/types/step";
import type { LanguageSources } from "./languages";
import { StepRecorder } from "./step-recorder";

// Line-for-line across all three languages (and BUBBLE_SORT_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const BUBBLE_SORT_SOURCES: LanguageSources = {
  java: [
    "static void bubbleSort(int[] arr) {",
    "  int n = arr.length;",
    "  for (int i = 0; i < n - 1; i++) {",
    "    boolean swapped = false;",
    "    for (int j = 0; j < n - i - 1; j++) {",
    "      if (arr[j] > arr[j + 1]) {",
    "        swap(arr, j, j + 1);",
    "        swapped = true;",
    "      }",
    "    }",
    "    // arr[n - i - 1] is now in its final position",
    "    if (!swapped) break;",
    "  }",
    "}",
  ],
  cpp: [
    "void bubbleSort(vector<int>& arr) {",
    "  int n = arr.size();",
    "  for (int i = 0; i < n - 1; i++) {",
    "    bool swapped = false;",
    "    for (int j = 0; j < n - i - 1; j++) {",
    "      if (arr[j] > arr[j + 1]) {",
    "        swap(arr[j], arr[j + 1]);",
    "        swapped = true;",
    "      }",
    "    }",
    "    // arr[n - i - 1] is now in its final position",
    "    if (!swapped) break;",
    "  }",
    "}",
  ],
  python: [
    "def bubble_sort(arr):",
    "    n = len(arr)",
    "    for i in range(n - 1):",
    "        swapped = False",
    "        for j in range(n - i - 1):",
    "            if arr[j] > arr[j + 1]:",
    "                arr[j], arr[j + 1] = arr[j + 1], arr[j]",
    "                swapped = True",
    "            # end if",
    "        # end for",
    "        # arr[n - i - 1] is now in its final position",
    "        if not swapped: break",
    "    # end for",
    "    # end bubble_sort",
  ],
};

// Line-for-line pseudocode counterpart to BUBBLE_SORT_SOURCES.
export const BUBBLE_SORT_PSEUDOCODE = [
  "function bubbleSort(array)",
  "    n = length(array)",
  "    for i = 0 to n - 2",
  "        swapped = false",
  "        for j = 0 to n - i - 2",
  "            if array[j] > array[j + 1]",
  "                swap array[j] and array[j + 1]",
  "                swapped = true",
  "            end if",
  "        end for",
  "        mark array[n - i - 1] as sorted",
  "        if not swapped, break",
  "    end for",
  "end function",
];

/**
 * Each pass bubbles the largest remaining value up to index n-i-1, and
 * that index is provably never touched by any later pass (which only
 * ever scans [0, n-i-2]) - so, like Quick Sort, sortedIndices can grow
 * incrementally instead of waiting for the whole run to finish.
 */
export function bubbleSort(input: number[]): Step[] {
  const arr = [...input];
  const n = arr.length;
  const rec = new StepRecorder();

  function swap(i: number, j: number) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  rec.record({
    lineOfCode: 2,
    description: `Start with n = ${n} elements.`,
    variables: { n },
    array: arr,
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    rec.record({
      lineOfCode: 4,
      description: `Pass ${i + 1}: scan the unsorted range [0, ${n - i - 2}] for out-of-order neighbors.`,
      variables: { i },
      array: arr,
    });

    for (let j = 0; j < n - i - 1; j++) {
      const shouldSwap = arr[j] > arr[j + 1];
      rec.record({
        lineOfCode: 6,
        description: shouldSwap
          ? `arr[${j}] = ${arr[j]} > arr[${j + 1}] = ${arr[j + 1]}, so swap them.`
          : `arr[${j}] = ${arr[j]} <= arr[${j + 1}] = ${arr[j + 1]}, already in order.`,
        variables: { i, j },
        pointers: { j, next: j + 1 },
        comparing: [j, j + 1],
        comparisonMade: true,
        array: arr,
      });

      if (shouldSwap) {
        swap(j, j + 1);
        swapped = true;
        rec.record({
          lineOfCode: 7,
          description: `Swapped. Array is now [${arr.join(", ")}].`,
          variables: { i, j },
          pointers: { j, next: j + 1 },
          swapping: [j, j + 1],
          array: arr,
        });
      }
    }

    const finalIndex = n - i - 1;
    rec.markSorted(finalIndex);
    rec.record({
      lineOfCode: 11,
      description: `The largest remaining value has bubbled up to index ${finalIndex} - it's now final.`,
      variables: { i, finalIndex },
      pointers: { finalIndex },
      array: arr,
    });

    if (!swapped) {
      rec.markAllSorted(n);
      rec.record({
        lineOfCode: 12,
        description: "No swaps this pass - the rest of the array is already sorted.",
        variables: { i },
        array: arr,
      });
      break;
    }
  }

  // If every pass swapped (so the early-exit above never fired), the
  // loop still finishes after n-1 passes have each finalized one index
  // from the end - the single element left at index 0 must already be
  // the smallest, but nothing has explicitly marked it yet.
  if (n > 0) rec.markSorted(0);

  rec.record({
    lineOfCode: 14,
    description: n <= 1 ? "Nothing to sort." : "The array is fully sorted.",
    variables: { n },
    array: arr,
  });

  return rec.getSteps();
}
