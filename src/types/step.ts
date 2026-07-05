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
  /** Discovery-tree edges (BFS/DFS) or best-known shortest-path-tree edges
   * (Dijkstra) as [from, to] pairs. Dijkstra can overwrite an entry as
   * relaxation finds a better predecessor, before that node is finalized. */
  treeEdges?: [string, string][];
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
  /** A logical comparison happened this step, for stats-counting purposes
   * (e.g. Comparison Mode) - set this even on steps where `comparing`
   * can't pinpoint specific array indices to highlight, such as Merge
   * Sort comparing values from its temporary left/right buffers rather
   * than live array positions. */
  comparisonMade?: boolean;
  /** Indices after which to draw a divider, e.g. index 3 splits between
   * index 3 and 4. `depth` is how many splits are currently nested at
   * that boundary - 0 is the outermost/first split still in play,
   * increasing for each split nested inside it - so the renderer can
   * draw shallower splits with a longer line and deeper ones
   * progressively shorter, making recursion depth visible at a glance. */
  dividers?: { index: number; depth: number }[];
  /** Graph node currently being processed (dequeued/popped/recursed into). */
  currentNode?: string;
  /** Graph edge currently being examined/relaxed. */
  currentEdge?: [string, string];
  dataStructureState?: DataStructureState;
};
