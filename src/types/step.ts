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
  /** Indices after which to draw a divider, e.g. [3] splits between index 3 and 4. */
  dividers?: number[];
  /** Graph node currently being processed (dequeued/popped/recursed into). */
  currentNode?: string;
  /** Graph edge currently being examined/relaxed. */
  currentEdge?: [string, string];
  dataStructureState?: DataStructureState;
};
