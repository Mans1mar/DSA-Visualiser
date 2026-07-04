export type CallStackFrame = {
  fnName: string;
  args: unknown[];
};

export type DataStructureState = {
  array?: number[];
  /** Indices whose final sorted position is locked in and won't change again. */
  sortedIndices?: number[];
  stack?: unknown[];
  queue?: unknown[];
  priorityQueue?: unknown[];
  visitedNodes?: string[];
  callStack?: CallStackFrame[];
};

/**
 * One frame of an algorithm's execution. The visualization renderer only
 * ever reads this shape - it has no knowledge of which algorithm produced
 * it, so every algorithm implementation must instrument itself to emit
 * an ordered array of these.
 */
export type Step = {
  stepIndex: number;
  lineOfCode: number;
  description: string;
  variables: Record<string, unknown>;
  pointers?: Record<string, number>;
  comparing?: [number, number];
  swapping?: [number, number];
  dataStructureState?: DataStructureState;
};
