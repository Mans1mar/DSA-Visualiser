import type { Step } from "@/types/step";
import type { LanguageSources } from "./languages";
import { SEARCH_TARGET } from "./search-shared";
import { StepRecorder } from "./step-recorder";

// Line-for-line across all three languages (and JUMP_SEARCH_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const JUMP_SEARCH_SOURCES: LanguageSources = {
  java: [
    "static int jumpSearch(int[] arr, int target) {",
    "  Arrays.sort(arr); // Jump Search requires a sorted array",
    "  int n = arr.length;",
    "  int step = (int) Math.sqrt(n);",
    "  int prev = 0;",
    "  int curr = step;",
    "  while (curr < n && arr[Math.min(curr, n) - 1] < target) {",
    "    prev = curr;",
    "    curr += step;",
    "  }",
    "  for (int i = prev; i < Math.min(curr, n); i++) {",
    "    if (arr[i] == target) {",
    "      return i;",
    "    }",
    "  }",
    "  return -1;",
    "}",
  ],
  cpp: [
    "int jumpSearch(vector<int>& arr, int target) {",
    "  sort(arr.begin(), arr.end()); // Jump Search requires a sorted array",
    "  int n = arr.size();",
    "  int step = (int) sqrt(n);",
    "  int prev = 0;",
    "  int curr = step;",
    "  while (curr < n && arr[min(curr, n) - 1] < target) {",
    "    prev = curr;",
    "    curr += step;",
    "  }",
    "  for (int i = prev; i < min(curr, n); i++) {",
    "    if (arr[i] == target) {",
    "      return i;",
    "    }",
    "  }",
    "  return -1;",
    "}",
  ],
  python: [
    "def jump_search(arr, target):",
    "    arr.sort()  # Jump Search requires a sorted array",
    "    n = len(arr)",
    "    step = int(n ** 0.5)",
    "    prev = 0",
    "    curr = step",
    "    while curr < n and arr[min(curr, n) - 1] < target:",
    "        prev = curr",
    "        curr += step",
    "    # end while",
    "    for i in range(prev, min(curr, n)):",
    "        if arr[i] == target:",
    "            return i",
    "        # end if",
    "    # end for",
    "    return -1",
    "    # end jump_search",
  ],
};

// Line-for-line pseudocode counterpart to JUMP_SEARCH_SOURCES.
export const JUMP_SEARCH_PSEUDOCODE = [
  "function jumpSearch(array, target)",
  "    if array is not sorted, sort it first",
  "    n = length(array)",
  "    step = floor(sqrt(n))",
  "    prev = 0",
  "    curr = step",
  "    while curr < n and array[min(curr, n) - 1] < target",
  "        prev = curr",
  "        curr = curr + step",
  "    end while",
  "    for i = prev to min(curr, n) - 1",
  "        if array[i] == target",
  "            return i",
  "        end if",
  "    end for",
  "    return -1",
  "end function",
];

/**
 * Requires a sorted array, like Binary Search. Rather than silently
 * sorting behind the scenes, the sort is a real, visible step: the
 * array is shown in whatever order it arrived in first (matching what
 * the array input field displays), then an explicit "sort it first"
 * step shows the transition, and only after that does jumping begin.
 * activeRange shrinks coarsely to [prev, n-1] per jump, then narrows
 * within the identified block same as Linear Search's suffix shrinking.
 */
export function jumpSearch(input: number[], target: number = SEARCH_TARGET): Step[] {
  const original = [...input];
  const n = original.length;
  const rec = new StepRecorder();

  rec.record({
    lineOfCode: 1,
    description:
      n === 0
        ? "Empty array - nothing to search."
        : `Search for ${target} in an array of n = ${n} elements.`,
    variables: { n, target },
    array: original,
  });

  if (n === 0) return rec.getSteps();

  const isSorted = original.every((value, i) => i === 0 || original[i - 1] <= value);

  if (!isSorted) {
    rec.record({
      lineOfCode: 2,
      description: "Jump Search needs a sorted array - this one isn't sorted yet.",
      variables: { n, target },
      array: original,
    });
  }

  const arr = isSorted ? original : [...original].sort((a, b) => a - b);

  if (!isSorted) {
    rec.record({
      lineOfCode: 2,
      description: `Sorted the array: [${arr.join(", ")}].`,
      variables: { n, target },
      array: arr,
    });
  }

  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  let curr = step;

  rec.record({
    lineOfCode: 4,
    description: `Jumping ahead in blocks of ${step}.`,
    variables: { n, step, target },
    activeRange: [0, n - 1],
    array: arr,
  });

  while (curr < n && arr[Math.min(curr, n) - 1] < target) {
    const checkIndex = Math.min(curr, n) - 1;
    rec.record({
      lineOfCode: 7,
      description: `arr[${checkIndex}] = ${arr[checkIndex]} < ${target}, so the block ending here is too small - jump ahead.`,
      variables: { prev, curr, target },
      pointers: { prev, checkIndex },
      comparing: [checkIndex, checkIndex],
      comparisonMade: true,
      activeRange: [prev, n - 1],
      array: arr,
    });
    prev = curr;
    curr += step;
  }

  const blockEnd = Math.min(curr, n) - 1;
  rec.record({
    lineOfCode: 11,
    description: `Target must be in the block [${prev}, ${blockEnd}] (if it's here at all) - scan it left to right.`,
    variables: { prev, blockEnd, target },
    pointers: { prev, blockEnd },
    activeRange: [prev, blockEnd],
    array: arr,
  });

  for (let i = prev; i <= blockEnd; i++) {
    const isMatch = arr[i] === target;
    rec.record({
      lineOfCode: 12,
      description: isMatch
        ? `arr[${i}] = ${arr[i]} matches the target!`
        : `arr[${i}] = ${arr[i]} != ${target}, keep scanning the block.`,
      variables: { i, target },
      pointers: { i },
      comparing: [i, i],
      comparisonMade: true,
      activeRange: [i, blockEnd],
      array: arr,
    });

    if (isMatch) {
      rec.markFound(i);
      rec.record({
        lineOfCode: 13,
        description: `Found ${target} at index ${i}.`,
        variables: { i, target },
        pointers: { i },
        array: arr,
      });
      return rec.getSteps();
    }
  }

  rec.record({
    lineOfCode: 16,
    description: `${target} isn't in the array.`,
    variables: { target },
    array: arr,
  });

  return rec.getSteps();
}
