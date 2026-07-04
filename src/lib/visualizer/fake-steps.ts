import type { Step } from "@/types/step";

/**
 * Hand-authored, algorithm-agnostic steps used only to exercise the
 * generic renderer and playback controls before any real algorithm is
 * wired in. Not a real sorting algorithm - just one bubble-style pass
 * over a fixed array, so every Step field gets exercised at least once.
 * Deleted once Merge Sort / Quick Sort emit real steps (Phase 3).
 */
export const fakeSortSteps: Step[] = [
  {
    stepIndex: 0,
    lineOfCode: 1,
    description: "Start with an unsorted array.",
    variables: { n: 5 },
    dataStructureState: { array: [5, 2, 4, 1, 3] },
  },
  {
    stepIndex: 1,
    lineOfCode: 2,
    description: "j = 0: compare arr[0] and arr[1].",
    variables: { n: 5 },
    pointers: { j: 0 },
    comparing: [0, 1],
    dataStructureState: { array: [5, 2, 4, 1, 3] },
  },
  {
    stepIndex: 2,
    lineOfCode: 3,
    description: "5 > 2, so they're out of order - swap them.",
    variables: { n: 5 },
    pointers: { j: 0 },
    swapping: [0, 1],
    dataStructureState: { array: [5, 2, 4, 1, 3] },
  },
  {
    stepIndex: 3,
    lineOfCode: 4,
    description: "Swapped. Array is now [2, 5, 4, 1, 3].",
    variables: { n: 5 },
    pointers: { j: 0 },
    dataStructureState: { array: [2, 5, 4, 1, 3] },
  },
  {
    stepIndex: 4,
    lineOfCode: 2,
    description: "j = 1: compare arr[1] and arr[2].",
    variables: { n: 5 },
    pointers: { j: 1 },
    comparing: [1, 2],
    dataStructureState: { array: [2, 5, 4, 1, 3] },
  },
  {
    stepIndex: 5,
    lineOfCode: 3,
    description: "5 > 4, so swap them.",
    variables: { n: 5 },
    pointers: { j: 1 },
    swapping: [1, 2],
    dataStructureState: { array: [2, 5, 4, 1, 3] },
  },
  {
    stepIndex: 6,
    lineOfCode: 4,
    description: "Swapped. Array is now [2, 4, 5, 1, 3].",
    variables: { n: 5 },
    pointers: { j: 1 },
    dataStructureState: { array: [2, 4, 5, 1, 3] },
  },
  {
    stepIndex: 7,
    lineOfCode: 2,
    description: "j = 2: compare arr[2] and arr[3].",
    variables: { n: 5 },
    pointers: { j: 2 },
    comparing: [2, 3],
    dataStructureState: { array: [2, 4, 5, 1, 3] },
  },
  {
    stepIndex: 8,
    lineOfCode: 3,
    description: "5 > 1, so swap them.",
    variables: { n: 5 },
    pointers: { j: 2 },
    swapping: [2, 3],
    dataStructureState: { array: [2, 4, 5, 1, 3] },
  },
  {
    stepIndex: 9,
    lineOfCode: 4,
    description: "Swapped. Array is now [2, 4, 1, 5, 3].",
    variables: { n: 5 },
    pointers: { j: 2 },
    dataStructureState: { array: [2, 4, 1, 5, 3] },
  },
  {
    stepIndex: 10,
    lineOfCode: 2,
    description: "j = 3: compare arr[3] and arr[4].",
    variables: { n: 5 },
    pointers: { j: 3 },
    comparing: [3, 4],
    dataStructureState: { array: [2, 4, 1, 5, 3] },
  },
  {
    stepIndex: 11,
    lineOfCode: 3,
    description: "5 > 3, so swap them.",
    variables: { n: 5 },
    pointers: { j: 3 },
    swapping: [3, 4],
    dataStructureState: { array: [2, 4, 1, 5, 3] },
  },
  {
    stepIndex: 12,
    lineOfCode: 4,
    description: "Swapped. Array is now [2, 4, 1, 3, 5].",
    variables: { n: 5 },
    pointers: { j: 3 },
    dataStructureState: { array: [2, 4, 1, 3, 5] },
  },
  {
    stepIndex: 13,
    lineOfCode: 5,
    description: "Pass complete - the largest value has bubbled to the end.",
    variables: { n: 5 },
    dataStructureState: { array: [2, 4, 1, 3, 5] },
  },
];
