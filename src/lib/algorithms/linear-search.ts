import type { Step } from "@/types/step";
import type { LanguageSources } from "./languages";
import { StepRecorder } from "./step-recorder";

// Line-for-line across all three languages (and LINEAR_SEARCH_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const LINEAR_SEARCH_SOURCES: LanguageSources = {
  java: [
    "static int linearSearch(int[] arr, int target) {",
    "  for (int i = 0; i < arr.length; i++) {",
    "    if (arr[i] == target) {",
    "      return i;",
    "    }",
    "  }",
    "  return -1;",
    "}",
  ],
  cpp: [
    "int linearSearch(vector<int>& arr, int target) {",
    "  for (int i = 0; i < arr.size(); i++) {",
    "    if (arr[i] == target) {",
    "      return i;",
    "    }",
    "  }",
    "  return -1;",
    "}",
  ],
  python: [
    "def linear_search(arr, target):",
    "    for i in range(len(arr)):",
    "        if arr[i] == target:",
    "            return i",
    "        # end if",
    "    # end for",
    "    return -1",
    "    # end linear_search",
  ],
};

// Line-for-line pseudocode counterpart to LINEAR_SEARCH_SOURCES.
export const LINEAR_SEARCH_PSEUDOCODE = [
  "function linearSearch(array, target)",
  "    for i = 0 to length(array) - 1",
  "        if array[i] == target",
  "            return i",
  "        end if",
  "    end for",
  "    return -1",
  "end function",
];

/**
 * The simplest search: check every index left to right until the target
 * turns up or the array runs out. activeRange narrows to the remaining
 * unchecked suffix [i, n-1] each step, purely cosmetic here (nothing is
 * provably ruled out the way Binary/Jump Search's halving is) but it
 * keeps the "what's left to check" visual language consistent across
 * all three search algorithms.
 */
export function linearSearch(input: number[], target: number): Step[] {
  const arr = [...input];
  const n = arr.length;
  const rec = new StepRecorder();

  rec.record({
    lineOfCode: 2,
    description: `Search for ${target} in an array of n = ${n} elements, left to right.`,
    variables: { n, target },
    array: arr,
  });

  for (let i = 0; i < n; i++) {
    const isMatch = arr[i] === target;
    rec.record({
      lineOfCode: 3,
      description: isMatch
        ? `arr[${i}] = ${arr[i]} matches the target (${target})!`
        : `arr[${i}] = ${arr[i]} != ${target}, keep looking.`,
      variables: { i, target },
      pointers: { i },
      comparing: [i, i],
      comparisonMade: true,
      activeRange: [i, n - 1],
      array: arr,
    });

    if (isMatch) {
      rec.markFound(i);
      rec.record({
        lineOfCode: 4,
        description: `Found ${target} at index ${i}.`,
        variables: { i, target },
        pointers: { i },
        array: arr,
      });
      return rec.getSteps();
    }
  }

  rec.record({
    lineOfCode: 7,
    description:
      n === 0 ? "Empty array - nothing to search." : `${target} isn't in the array.`,
    variables: { target },
    array: arr,
  });

  return rec.getSteps();
}
