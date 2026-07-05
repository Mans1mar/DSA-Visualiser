import type { CallStackFrame, Step } from "@/types/step";

type StepInput = Omit<Step, "stepIndex" | "dataStructureState" | "dividers"> & {
  array: number[];
  /** Plain indices, no depth - only for a divider being introduced this
   * exact step, before it's been pushed onto the persistent stack (e.g.
   * the instant a pivot lands, one step before quickSort's caller pushes
   * it). record() assigns it the depth it's about to occupy. Anything
   * already "in play" belongs on the pushDividers()/popDividers() stack
   * instead, not here. */
  dividers?: number[];
};

/**
 * Shared bookkeeping for hand-instrumented algorithms: tracks the call
 * stack and the set of indices whose sorted position is already final,
 * and stamps both onto every recorded Step automatically so algorithm
 * code only has to describe what's happening at each line.
 */
export class StepRecorder {
  private steps: Step[] = [];
  private callStack: CallStackFrame[] = [];
  private sortedIndices = new Set<number>();
  private dividerFrames: number[][] = [];
  private foundIndex: number | undefined;

  pushCall(frame: CallStackFrame) {
    this.callStack.push(frame);
  }

  popCall() {
    this.callStack.pop();
  }

  markSorted(index: number) {
    this.sortedIndices.add(index);
  }

  markAllSorted(length: number) {
    for (let i = 0; i < length; i++) this.sortedIndices.add(i);
  }

  /** Search algorithms call this once the target is located - like
   * markSorted, it persists onto every subsequent record() automatically
   * (there are usually only one or two more before the run ends). */
  markFound(index: number) {
    this.foundIndex = index;
  }

  /**
   * Divide-and-conquer algorithms call this once they've committed to a
   * split point, and popDividers() once both halves (and any merge/
   * finalize step) have finished with it. Every record() in between -
   * including ones made by deeper recursive calls - automatically shows
   * this boundary, so the dotted line marking a split stays on screen
   * for as long as that split is actually "in play" instead of only the
   * instant it's chosen. Nested splits stack: a step recorded three
   * levels deep shows all three ancestors' boundaries at once, which is
   * exactly the currently-active range at each level of recursion.
   */
  pushDividers(indices: number[]) {
    this.dividerFrames.push(indices);
  }

  popDividers() {
    this.dividerFrames.pop();
  }

  record({ array, dividers, ...rest }: StepInput) {
    const active: { index: number; depth: number }[] = [];
    const seen = new Set<number>();
    const addDivider = (index: number, depth: number) => {
      if (seen.has(index)) return;
      seen.add(index);
      active.push({ index, depth });
    };

    this.dividerFrames.forEach((frame, depth) => {
      for (const index of frame) addDivider(index, depth);
    });
    // Not yet pushed, so not reflected in dividerFrames.length above -
    // this is the depth it will occupy once its caller pushes it.
    for (const index of dividers ?? []) addDivider(index, this.dividerFrames.length);

    this.steps.push({
      stepIndex: this.steps.length,
      ...rest,
      dividers: active.length > 0 ? active : undefined,
      dataStructureState: {
        array: [...array],
        callStack: this.callStack.map((frame) => ({ ...frame })),
        sortedIndices: [...this.sortedIndices].sort((a, b) => a - b),
        foundIndex: this.foundIndex,
      },
    });
  }

  getSteps(): Step[] {
    return this.steps;
  }
}
