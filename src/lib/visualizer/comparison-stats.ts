import type { Step } from "@/types/step";

export type RunningStats = {
  comparisons: number;
  swaps: number;
  recursiveCalls: number;
  /** Peak simultaneous items across call stack + queue + stack +
   * priority queue seen so far - a proxy for auxiliary memory use,
   * since we can't measure real bytes for hand-written JS this small. */
  peakAuxItems: number;
};

/** Scans steps[0..uptoIndex] and tallies what happened along the way -
 * generic over any algorithm's Step[], nothing here is sort- or
 * graph-specific. */
export function computeRunningStats(steps: Step[], uptoIndex: number): RunningStats {
  let comparisons = 0;
  let swaps = 0;
  let recursiveCalls = 0;
  let peakAuxItems = 0;
  let prevCallDepth = 0;

  const end = Math.min(uptoIndex, steps.length - 1);
  for (let i = 0; i <= end; i++) {
    const step = steps[i];
    if (step.comparisonMade) comparisons++;
    if (step.swapping) swaps++;

    const callDepth = step.dataStructureState?.callStack?.length ?? 0;
    if (callDepth > prevCallDepth) recursiveCalls += callDepth - prevCallDepth;
    prevCallDepth = callDepth;

    const auxItems =
      callDepth +
      (step.dataStructureState?.queue?.length ?? 0) +
      (step.dataStructureState?.stack?.length ?? 0) +
      (step.dataStructureState?.priorityQueue?.length ?? 0);
    if (auxItems > peakAuxItems) peakAuxItems = auxItems;
  }

  return { comparisons, swaps, recursiveCalls, peakAuxItems };
}
