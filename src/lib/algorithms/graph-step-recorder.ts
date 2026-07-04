import type { CallStackFrame, Step } from "@/types/step";

type GraphStepInput = Omit<Step, "stepIndex" | "dataStructureState"> & {
  queue?: unknown[];
  stack?: unknown[];
  priorityQueue?: unknown[];
};

/**
 * Shared bookkeeping for hand-instrumented graph algorithms: tracks the
 * call stack (for recursive DFS), the visited set, and a predecessor map
 * that derives treeEdges. Predecessor is a map, not an append-only list,
 * because Dijkstra can overwrite a node's best-known predecessor via
 * relaxation before that node is finalized - BFS/DFS just never happen
 * to overwrite theirs.
 */
export class GraphStepRecorder {
  private steps: Step[] = [];
  private callStack: CallStackFrame[] = [];
  private visited = new Set<string>();
  private predecessor = new Map<string, string>();

  pushCall(frame: CallStackFrame) {
    this.callStack.push(frame);
  }

  popCall() {
    this.callStack.pop();
  }

  markVisited(node: string) {
    this.visited.add(node);
  }

  setTreeEdge(from: string, to: string) {
    this.predecessor.set(to, from);
  }

  record({ queue, stack, priorityQueue, ...rest }: GraphStepInput) {
    this.steps.push({
      stepIndex: this.steps.length,
      ...rest,
      dataStructureState: {
        visitedNodes: [...this.visited],
        callStack: this.callStack.map((frame) => ({ ...frame })),
        treeEdges: [...this.predecessor.entries()].map(([to, from]) => [from, to]),
        queue: queue ? [...queue] : undefined,
        stack: stack ? [...stack] : undefined,
        priorityQueue: priorityQueue ? [...priorityQueue] : undefined,
      },
    });
  }

  getSteps(): Step[] {
    return this.steps;
  }
}
