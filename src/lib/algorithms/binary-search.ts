import type { Step } from "@/types/step";
import type { LanguageSources } from "./languages";
import { SEARCH_TARGET } from "./search-shared";
import { StepRecorder } from "./step-recorder";

// Line-for-line across all three languages (and BINARY_SEARCH_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const BINARY_SEARCH_SOURCES: LanguageSources = {
  java: [
    "static int binarySearch(int[] arr, int target) {",
    "  int lo = 0;",
    "  int hi = arr.length - 1;",
    "  while (lo <= hi) {",
    "    int mid = (lo + hi) / 2;",
    "    if (arr[mid] == target) {",
    "      return mid;",
    "    } else if (arr[mid] < target) {",
    "      lo = mid + 1;",
    "    } else {",
    "      hi = mid - 1;",
    "    }",
    "  }",
    "  return -1;",
    "}",
  ],
  cpp: [
    "int binarySearch(vector<int>& arr, int target) {",
    "  int lo = 0;",
    "  int hi = arr.size() - 1;",
    "  while (lo <= hi) {",
    "    int mid = (lo + hi) / 2;",
    "    if (arr[mid] == target) {",
    "      return mid;",
    "    } else if (arr[mid] < target) {",
    "      lo = mid + 1;",
    "    } else {",
    "      hi = mid - 1;",
    "    }",
    "  }",
    "  return -1;",
    "}",
  ],
  python: [
    "def binary_search(arr, target):",
    "    lo = 0",
    "    hi = len(arr) - 1",
    "    while lo <= hi:",
    "        mid = (lo + hi) // 2",
    "        if arr[mid] == target:",
    "            return mid",
    "        elif arr[mid] < target:",
    "            lo = mid + 1",
    "        else:",
    "            hi = mid - 1",
    "        # end if",
    "    # end while",
    "    return -1",
    "    # end binary_search",
  ],
};

// Line-for-line pseudocode counterpart to BINARY_SEARCH_SOURCES.
export const BINARY_SEARCH_PSEUDOCODE = [
  "function binarySearch(array, target)",
  "    lo = 0",
  "    hi = length(array) - 1",
  "    while lo <= hi",
  "        mid = middle index of lo..hi",
  "        if array[mid] == target",
  "            return mid",
  "        else if array[mid] < target",
  "            lo = mid + 1",
  "        else",
  "            hi = mid - 1",
  "        end if",
  "    end while",
  "    return -1",
  "end function",
];

/**
 * Requires a sorted array - always sorted here first regardless of what
 * comes in, so a custom/randomized array (which the generic array input
 * controls allow for any array-kind algorithm) can never violate that
 * precondition. activeRange tracks [lo, hi], halving each iteration - the
 * whole rest of the array outside it is provably ruled out and dims
 * accordingly.
 */
export function binarySearch(input: number[], target: number = SEARCH_TARGET): Step[] {
  const arr = [...input].sort((a, b) => a - b);
  const n = arr.length;
  const rec = new StepRecorder();

  let lo = 0;
  let hi = n - 1;

  rec.record({
    lineOfCode: 2,
    description: `Search for ${target} in a sorted array of n = ${n} elements.`,
    variables: { n, target, lo, hi },
    pointers: n > 0 ? { lo, hi } : undefined,
    activeRange: n > 0 ? [lo, hi] : undefined,
    array: arr,
  });

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    rec.record({
      lineOfCode: 5,
      description: `Check the middle of [${lo}, ${hi}]: mid = ${mid}.`,
      variables: { lo, hi, mid, target },
      pointers: { lo, mid, hi },
      activeRange: [lo, hi],
      array: arr,
    });

    if (arr[mid] === target) {
      rec.markFound(mid);
      rec.record({
        lineOfCode: 6,
        description: `arr[${mid}] = ${arr[mid]} matches the target!`,
        variables: { lo, hi, mid, target },
        pointers: { lo, mid, hi },
        comparing: [mid, mid],
        comparisonMade: true,
        array: arr,
      });
      return rec.getSteps();
    }

    if (arr[mid] < target) {
      rec.record({
        lineOfCode: 8,
        description: `arr[${mid}] = ${arr[mid]} < ${target}, so the target must be to the right - narrow to [${mid + 1}, ${hi}].`,
        variables: { lo, hi, mid, target },
        pointers: { lo, mid, hi },
        comparing: [mid, mid],
        comparisonMade: true,
        activeRange: [mid + 1, hi],
        array: arr,
      });
      lo = mid + 1;
    } else {
      rec.record({
        lineOfCode: 10,
        description: `arr[${mid}] = ${arr[mid]} > ${target}, so the target must be to the left - narrow to [${lo}, ${mid - 1}].`,
        variables: { lo, hi, mid, target },
        pointers: { lo, mid, hi },
        comparing: [mid, mid],
        comparisonMade: true,
        activeRange: [lo, mid - 1],
        array: arr,
      });
      hi = mid - 1;
    }
  }

  rec.record({
    lineOfCode: 14,
    description: n === 0 ? "Empty array - nothing to search." : `${target} isn't in the array.`,
    variables: { target },
    array: arr,
  });

  return rec.getSteps();
}
