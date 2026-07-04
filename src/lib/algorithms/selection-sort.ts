import type { Step } from "@/types/step";
import type { LanguageSources } from "./languages";
import { StepRecorder } from "./step-recorder";

// Line-for-line across all three languages (and SELECTION_SORT_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const SELECTION_SORT_SOURCES: LanguageSources = {
  java: [
    "static void selectionSort(int[] arr) {",
    "  int n = arr.length;",
    "  for (int i = 0; i < n - 1; i++) {",
    "    int minIndex = i;",
    "    for (int j = i + 1; j < n; j++) {",
    "      if (arr[j] < arr[minIndex]) {",
    "        minIndex = j;",
    "      }",
    "    }",
    "    swap(arr, i, minIndex);",
    "    // arr[i] is now in its final position",
    "  }",
    "  // arr[n - 1] is now in its final position",
    "}",
  ],
  cpp: [
    "void selectionSort(vector<int>& arr) {",
    "  int n = arr.size();",
    "  for (int i = 0; i < n - 1; i++) {",
    "    int minIndex = i;",
    "    for (int j = i + 1; j < n; j++) {",
    "      if (arr[j] < arr[minIndex]) {",
    "        minIndex = j;",
    "      }",
    "    }",
    "    swap(arr[i], arr[minIndex]);",
    "    // arr[i] is now in its final position",
    "  }",
    "  // arr[n - 1] is now in its final position",
    "}",
  ],
  python: [
    "def selection_sort(arr):",
    "    n = len(arr)",
    "    for i in range(n - 1):",
    "        min_index = i",
    "        for j in range(i + 1, n):",
    "            if arr[j] < arr[min_index]:",
    "                min_index = j",
    "            # end if",
    "        # end for",
    "        arr[i], arr[min_index] = arr[min_index], arr[i]",
    "        # arr[i] is now in its final position",
    "    # end for",
    "    # arr[n - 1] is now in its final position",
    "    # end selection_sort",
  ],
};

// Line-for-line pseudocode counterpart to SELECTION_SORT_SOURCES.
export const SELECTION_SORT_PSEUDOCODE = [
  "function selectionSort(array)",
  "    n = length(array)",
  "    for i = 0 to n - 2",
  "        minIndex = i",
  "        for j = i + 1 to n - 1",
  "            if array[j] < array[minIndex]",
  "                minIndex = j",
  "            end if",
  "        end for",
  "        swap array[i] and array[minIndex]",
  "        mark array[i] as sorted",
  "    end for",
  "    mark array[n - 1] as sorted",
  "end function",
];

/**
 * Each pass finds the true minimum of the remaining unsorted suffix and
 * swaps it into index i - since every element to i's right is scanned
 * before the swap happens, arr[i] is provably the i-th smallest overall
 * and never touched again, so sortedIndices grows incrementally.
 */
export function selectionSort(input: number[]): Step[] {
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
    let minIndex = i;
    rec.record({
      lineOfCode: 4,
      description: `Assume index ${i} holds the smallest value in the unsorted range [${i}, ${n - 1}].`,
      variables: { i, minIndex },
      pointers: { i, minIndex },
      array: arr,
    });

    for (let j = i + 1; j < n; j++) {
      const isSmaller = arr[j] < arr[minIndex];
      rec.record({
        lineOfCode: 6,
        description: isSmaller
          ? `arr[${j}] = ${arr[j]} < arr[${minIndex}] = ${arr[minIndex]}, new minimum found.`
          : `arr[${j}] = ${arr[j]} >= arr[${minIndex}] = ${arr[minIndex]}, minimum unchanged.`,
        variables: { i, j, minIndex },
        pointers: { i, j, minIndex },
        comparing: [j, minIndex],
        comparisonMade: true,
        array: arr,
      });

      if (isSmaller) {
        minIndex = j;
        rec.record({
          lineOfCode: 7,
          description: `New minimum is arr[${minIndex}] = ${arr[minIndex]}.`,
          variables: { i, j, minIndex },
          pointers: { i, j, minIndex },
          array: arr,
        });
      }
    }

    if (minIndex !== i) {
      rec.record({
        lineOfCode: 10,
        description: `Swap arr[${i}] and arr[${minIndex}] to place the minimum at index ${i}.`,
        variables: { i, minIndex },
        pointers: { i, minIndex },
        swapping: [i, minIndex],
        array: arr,
      });
      swap(i, minIndex);
    }

    rec.markSorted(i);
    rec.record({
      lineOfCode: 11,
      description: `arr[${i}] = ${arr[i]} is now in its final sorted position.`,
      variables: { i },
      pointers: { i },
      array: arr,
    });
  }

  if (n > 0) rec.markSorted(n - 1);

  rec.record({
    lineOfCode: 14,
    description: n <= 1 ? "Nothing to sort." : "The array is fully sorted.",
    variables: { n },
    array: arr,
  });

  return rec.getSteps();
}
