import type { Step } from "@/types/step";
import type { Graph } from "@/lib/graph/types";
import { getNeighbors } from "@/lib/graph/types";
import { GraphStepRecorder } from "./graph-step-recorder";

export const DFS_SOURCE = [
  "function dfs(graph, node, visited) {",
  "  visited.add(node);",
  "  for (const neighbor of neighbors(node)) {",
  "    if (!visited.has(neighbor)) {",
  "      dfs(graph, neighbor, visited);",
  "    }",
  "  }",
  "}",
];

/**
 * Explores as deep as possible before backtracking, via real recursion -
 * the call stack IS the algorithm's traversal stack, unlike BFS's
 * explicit queue.
 */
export function dfs(graph: Graph, start: string): Step[] {
  const rec = new GraphStepRecorder();
  const visited = new Set<string>();

  function visit(node: string) {
    rec.pushCall({ fnName: "dfs", args: [node] });
    visited.add(node);
    rec.markVisited(node);
    rec.record({
      lineOfCode: 2,
      description: `Visit ${node} - mark it visited.`,
      variables: { node },
      currentNode: node,
    });

    for (const { id: neighbor } of getNeighbors(graph, node)) {
      const alreadyVisited = visited.has(neighbor);
      rec.record({
        lineOfCode: 4,
        description: alreadyVisited
          ? `${neighbor} is already visited - skip it.`
          : `${neighbor} hasn't been visited yet.`,
        variables: { node, neighbor },
        currentNode: node,
        currentEdge: [node, neighbor],
      });

      if (!alreadyVisited) {
        rec.setTreeEdge(node, neighbor);
        rec.record({
          lineOfCode: 5,
          description: `Recurse into ${neighbor}.`,
          variables: { node, neighbor },
          currentNode: node,
          currentEdge: [node, neighbor],
        });
        visit(neighbor);
      }
    }

    rec.popCall();
  }

  visit(start);

  rec.record({
    lineOfCode: 7,
    description: "Call stack is empty - DFS complete. Every reachable node has been visited.",
    variables: {},
  });

  return rec.getSteps();
}
