import type { CallStackFrame, Step, TreeNode } from "@/types/step";

type TreeStepInput = Omit<Step, "stepIndex" | "dataStructureState"> & {
  tree: TreeNode | null;
  /** Level-order only - node values in queue order, dequeue end first. */
  queue?: unknown[];
};

function cloneTree(node: TreeNode | null): TreeNode | null {
  if (node === null) return null;
  return { id: node.id, value: node.value, left: cloneTree(node.left), right: cloneTree(node.right) };
}

/**
 * Shared bookkeeping for hand-instrumented Tree algorithms: tracks the
 * call stack (Insert/Search/Delete all recurse), the ordered visited
 * path (Traversals), and the located node (Search) - and deep-clones
 * the tree snapshot on every record() call.
 *
 * The deep clone matters more here than the array recorder's shallow
 * `[...array]` copy: these algorithms are naturally written by mutating
 * real Node objects in place (`node.left = new Node(value)`), so
 * without a clone, every earlier step's `tree` would keep pointing at
 * the same mutating object graph and end up rendering the *final* tree
 * once the algorithm finishes, instead of that step's true
 * point-in-time snapshot.
 */
export class TreeStepRecorder {
  private steps: Step[] = [];
  private callStack: CallStackFrame[] = [];
  private visitedPath: string[] = [];
  private foundId: string | undefined;

  pushCall(frame: CallStackFrame) {
    this.callStack.push(frame);
  }

  popCall() {
    this.callStack.pop();
  }

  /** Traversals call this as each node is visited, in visit order. */
  markVisited(nodeId: string) {
    this.visitedPath.push(nodeId);
  }

  /** Search calls this once the target node is located - persists onto
   * every subsequent record(), the same accumulate-and-persist pattern
   * as the array recorder's markFound. */
  markFound(nodeId: string) {
    this.foundId = nodeId;
  }

  record({ tree, queue, ...rest }: TreeStepInput) {
    this.steps.push({
      stepIndex: this.steps.length,
      ...rest,
      dataStructureState: {
        tree: cloneTree(tree),
        treeVisitedPath: [...this.visitedPath],
        treeFoundId: this.foundId,
        callStack: this.callStack.map((frame) => ({ ...frame })),
        queue: queue ? [...queue] : undefined,
      },
    });
  }

  getSteps(): Step[] {
    return this.steps;
  }
}
