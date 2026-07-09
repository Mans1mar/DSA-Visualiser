export type CallStackFrame = {
  fnName: string;
  args: unknown[];
};

/**
 * A binary tree node for the Tree category (BST/AVL). Unlike Graph -
 * whose shape is fixed input that algorithms only ever read - a tree's
 * shape itself changes step to step (inserts, deletes, rotations), so
 * the node type lives here as part of the Step model rather than
 * alongside Graph in lib/graph/types.ts. `id` is stable per node across
 * steps (assigned at insert time, not derived from `value`) so the
 * renderer can key/animate a node correctly even if a rotation or
 * delete-with-replacement changes which value sits where.
 */
export type TreeNode = {
  id: string;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

export type DataStructureState = {
  array?: number[];
  /** Indices whose final sorted position is locked in and won't change again. */
  sortedIndices?: number[];
  /** The index where a search algorithm's target was located, once found -
   * stamped onto every step from that point on (there are usually only
   * one or two more), the same accumulate-and-persist pattern as
   * sortedIndices. */
  foundIndex?: number;
  stack?: unknown[];
  queue?: unknown[];
  priorityQueue?: unknown[];
  visitedNodes?: string[];
  /** Discovery-tree edges (BFS/DFS) or best-known shortest-path-tree edges
   * (Dijkstra) as [from, to] pairs. Dijkstra can overwrite an entry as
   * relaxation finds a better predecessor, before that node is finalized. */
  treeEdges?: [string, string][];
  callStack?: CallStackFrame[];
  /** Full tree snapshot at this step - Tree category only, analogous to
   * `array` for array-kind algorithms. Root is null for an empty tree
   * (e.g. before the first Insert). */
  tree?: TreeNode | null;
  /** Node ids visited so far, in visit order - Tree category only.
   * Deliberately separate from `visitedNodes` (graph BFS/DFS, unordered
   * set semantics): traversal algorithms need to show *which number in
   * the sequence* each visit was, e.g. numbering an inorder walk. */
  treeVisitedPath?: string[];
  /** The node id where Tree Search located its target, once found -
   * stamped onto every step from that point on, the same
   * accumulate-and-persist pattern as `foundIndex` for array search. */
  treeFoundId?: string;
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
  /** [lo, hi] inclusive - the remaining candidate range a search
   * algorithm is still considering. Everything outside gets dimmed to
   * show what's already been ruled out. Undefined means nothing is
   * dimmed (the whole array is still in play, or the search has just
   * concluded). */
  activeRange?: [number, number];
  /** Graph node currently being processed (dequeued/popped/recursed into).
   * Reused for Tree category algorithms as the node currently being
   * visited/compared - a BST walk is conceptually the same "current
   * node" idea, just via left/right pointers instead of a queue. */
  currentNode?: string;
  /** Graph edge currently being examined/relaxed. */
  currentEdge?: [string, string];
  /** BST Search/Insert/Delete only: which way a comparison at
   * `currentNode` sent the walk, or that it concluded - drives the
   * step's highlight/description without the renderer re-deriving it
   * from raw values itself. */
  comparisonResult?: "left" | "right" | "found" | "not-found";
  /** AVL only: a rotation happening at this exact step, so the renderer
   * can animate it as a distinct transition instead of jump-cutting
   * between two tree shapes. `pivotNodeId` is the node rotating down
   * into a child position. */
  rotation?: {
    type: "left" | "right" | "left-right" | "right-left";
    pivotNodeId: string;
  };
  dataStructureState?: DataStructureState;
};
