import { layoutTree } from "@/lib/tree/layout";
import type { Step } from "@/types/step";

/**
 * These compute the largest amount of "stuff" a panel will ever need to
 * show across an entire run, so the caller can reserve that much space
 * up front. Without this, a panel's height tracks whatever the *current*
 * step happens to need (e.g. two pointers landing on the same index, or
 * the call stack going one frame deeper) and everything below it jumps
 * around as playback advances. Applies uniformly to any algorithm's
 * Step[] - nothing here is specific to one algorithm, so it keeps
 * working as new ones are added.
 */

/** Max number of pointer names stacked on any single array index, across
 * every step - reserves constant height for ArrayBars' pointer row. */
export function computeMaxPointerStack(steps: Step[], arrayLength: number): number {
  let max = 0;
  for (const step of steps) {
    const counts = new Map<number, number>();
    for (const index of Object.values(step.pointers ?? {})) {
      if (index < 0 || index >= arrayLength) continue;
      counts.set(index, (counts.get(index) ?? 0) + 1);
    }
    for (const count of counts.values()) {
      if (count > max) max = count;
    }
  }
  return max;
}

/** Deepest call stack across every step - reserves constant height for
 * CallStackPanel so recursion growing/shrinking doesn't shift whatever
 * sits below it. */
export function computeMaxCallStackDepth(steps: Step[]): number {
  let max = 0;
  for (const step of steps) {
    const depth = step.dataStructureState?.callStack?.length ?? 0;
    if (depth > max) max = depth;
  }
  return max;
}

/** Longest queue/stack/priorityQueue across every step - reserves
 * constant height for LinearStatePanel. */
export function computeMaxLinearItems(
  steps: Step[],
  field: "queue" | "stack" | "priorityQueue"
): number {
  let max = 0;
  for (const step of steps) {
    const length = step.dataStructureState?.[field]?.length ?? 0;
    if (length > max) max = length;
  }
  return max;
}

/** Largest tree layout extent (in layout units, see lib/tree/layout.ts)
 * across every step - Insert grows a tree and Delete shrinks one, so
 * without this TreeView's canvas would resize every step, and small
 * intermediate trees would get rescaled to fill whatever box that
 * step's viewBox happened to produce instead of sitting appropriately
 * small within a canvas sized for the run's largest tree. */
export function computeMaxTreeExtent(steps: Step[]): { width: number; height: number } {
  let width = 0;
  let height = 0;
  for (const step of steps) {
    const layout = layoutTree(step.dataStructureState?.tree ?? null);
    if (layout.width > width) width = layout.width;
    if (layout.height > height) height = layout.height;
  }
  return { width, height };
}
