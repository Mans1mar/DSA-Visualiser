import type { Step } from "@/types/step";
import type { LanguageSources } from "./languages";
import { StepRecorder } from "./step-recorder";

// Line-for-line across all three languages (and INSERTION_SORT_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const INSERTION_SORT_SOURCES: LanguageSources = {
  java: [
    "static void insertionSort(int[] arr) {",
    "  int n = arr.length;",
    "  for (int i = 1; i < n; i++) {",
    "    int key = arr[i];",
    "    int j = i - 1;",
    "    while (j >= 0 && arr[j] > key) {",
    "      arr[j + 1] = arr[j];",
    "      j--;",
    "    }",
    "    arr[j + 1] = key;",
    "  }",
    "  // array is now fully sorted",
    "}",
  ],
  cpp: [
    "void insertionSort(vector<int>& arr) {",
    "  int n = arr.size();",
    "  for (int i = 1; i < n; i++) {",
    "    int key = arr[i];",
    "    int j = i - 1;",
    "    while (j >= 0 && arr[j] > key) {",
    "      arr[j + 1] = arr[j];",
    "      j--;",
    "    }",
    "    arr[j + 1] = key;",
    "  }",
    "  // array is now fully sorted",
    "}",
  ],
  python: [
    "def insertion_sort(arr):",
    "    n = len(arr)",
    "    for i in range(1, n):",
    "        key = arr[i]",
    "        j = i - 1",
    "        while j >= 0 and arr[j] > key:",
    "            arr[j + 1] = arr[j]",
    "            j -= 1",
    "        # end while",
    "        arr[j + 1] = key",
    "    # end for",
    "    # array is now fully sorted",
    "    # end insertion_sort",
  ],
};

// Line-for-line pseudocode counterpart to INSERTION_SORT_SOURCES.
export const INSERTION_SORT_PSEUDOCODE = [
  "function insertionSort(array)",
  "    n = length(array)",
  "    for i = 1 to n - 1",
  "        key = array[i]",
  "        j = i - 1",
  "        while j >= 0 and array[j] > key",
  "            array[j + 1] = array[j]",
  "            j = j - 1",
  "        end while",
  "        array[j + 1] = key",
  "    end for",
  "    array is now fully sorted",
  "end function",
];

/**
 * Every insertion only ever shifts elements *rightward* to open a gap,
 * so a value can always still be displaced further right by a smaller
 * key arriving later - no index is provably in its final position until
 * the whole pass completes, same reasoning as Merge Sort's merges.
 */
export function insertionSort(input: number[]): Step[] {
  const arr = [...input];
  const n = arr.length;
  const rec = new StepRecorder();

  rec.record({
    lineOfCode: 2,
    description:
      n > 0
        ? `Start with n = ${n} elements. A single-element prefix is trivially sorted within itself.`
        : "Empty array - nothing to sort.",
    variables: { n },
    array: arr,
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    rec.record({
      lineOfCode: 4,
      description: `Take key = arr[${i}] = ${key} and find its place in the sorted prefix [0, ${i - 1}].`,
      variables: { i, key },
      pointers: { i, gap: i },
      array: arr,
    });

    while (j >= 0 && arr[j] > key) {
      rec.record({
        lineOfCode: 6,
        description: `arr[${j}] = ${arr[j]} > key (${key}), shift it one place right.`,
        variables: { i, key, j },
        pointers: { compare: j, gap: j + 1 },
        comparing: [j, j + 1],
        comparisonMade: true,
        array: arr,
      });
      arr[j + 1] = arr[j];
      j--;
      rec.record({
        lineOfCode: 7,
        description: `Shifted. Array is now [${arr.join(", ")}].`,
        variables: { i, key, j },
        pointers: { gap: j + 1 },
        swapping: [j + 1, j + 2],
        array: arr,
      });
    }

    if (j >= 0) {
      rec.record({
        lineOfCode: 6,
        description: `arr[${j}] = ${arr[j]} <= key (${key}) - key's place is right after it.`,
        variables: { i, key, j },
        pointers: { compare: j, gap: j + 1 },
        comparing: [j, j + 1],
        comparisonMade: true,
        array: arr,
      });
    }

    arr[j + 1] = key;
    rec.record({
      lineOfCode: 10,
      description: `Insert key (${key}) at index ${j + 1}.`,
      variables: { i, key, j },
      pointers: { gap: j + 1 },
      swapping: [j + 1, j + 1],
      array: arr,
    });
  }

  rec.markAllSorted(n);
  rec.record({
    lineOfCode: 13,
    description: n <= 1 ? "Nothing to sort." : "The array is fully sorted.",
    variables: { n },
    array: arr,
  });

  return rec.getSteps();
}
