import type { CallStackFrame, Step } from "@/types/step";

type StepInput = Omit<Step, "stepIndex" | "dataStructureState"> & {
  array: number[];
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

  record({ array, ...rest }: StepInput) {
    this.steps.push({
      stepIndex: this.steps.length,
      ...rest,
      dataStructureState: {
        array: [...array],
        callStack: this.callStack.map((frame) => ({ ...frame })),
        sortedIndices: [...this.sortedIndices].sort((a, b) => a - b),
      },
    });
  }

  getSteps(): Step[] {
    return this.steps;
  }
}
