import type { Step } from "@/types/step";
import type { Graph } from "@/lib/graph/types";
import { getNeighbors } from "@/lib/graph/types";
import { GraphStepRecorder } from "./graph-step-recorder";

export const BFS_SOURCE = [
  "function bfs(graph, start) {",
  "  const visited = new Set([start]);",
  "  const queue = [start];",
  "  while (queue.length > 0) {",
  "    const node = queue.shift();",
  "    for (const neighbor of neighbors(node)) {",
  "      if (!visited.has(neighbor)) {",
  "        visited.add(neighbor);",
  "        queue.push(neighbor);",
  "      }",
  "    }",
  "  }",
  "}",
];

// Line-for-line pseudocode counterpart to BFS_SOURCE.
export const BFS_PSEUDOCODE = [
  "function bfs(graph, start)",
  "    visited = {start}",
  "    queue = [start]",
  "    while queue is not empty",
  "        node = remove front of queue",
  "        for each neighbor of node",
  "            if neighbor not in visited",
  "                add neighbor to visited",
  "                add neighbor to back of queue",
  "            end if",
  "        end for",
  "    end while",
  "end function",
];

/**
 * Explores level by level via an explicit queue. A node is marked
 * visited the moment it's *discovered* (enqueued), not when it's later
 * dequeued and processed - the standard BFS convention that guarantees
 * each node is enqueued at most once.
 */
export function bfs(graph: Graph, start: string): Step[] {
  const rec = new GraphStepRecorder();
  const visited = new Set<string>([start]);
  const queue: string[] = [start];

  rec.markVisited(start);
  rec.record({
    lineOfCode: 2,
    description: `Start at ${start}: mark it visited and enqueue it.`,
    variables: { start },
    queue: [...queue],
  });

  while (queue.length > 0) {
    const node = queue.shift()!;
    rec.record({
      lineOfCode: 5,
      description: `Dequeue ${node} - the next node to process.`,
      variables: { node },
      currentNode: node,
      queue: [...queue],
    });

    for (const { id: neighbor } of getNeighbors(graph, node)) {
      const alreadyVisited = visited.has(neighbor);
      rec.record({
        lineOfCode: 7,
        description: alreadyVisited
          ? `${neighbor} is already visited - skip it.`
          : `${neighbor} hasn't been visited yet.`,
        variables: { node, neighbor },
        currentNode: node,
        currentEdge: [node, neighbor],
        queue: [...queue],
      });

      if (!alreadyVisited) {
        visited.add(neighbor);
        rec.markVisited(neighbor);
        rec.setTreeEdge(node, neighbor);
        queue.push(neighbor);
        rec.record({
          lineOfCode: 9,
          description: `Mark ${neighbor} visited and enqueue it.`,
          variables: { node, neighbor },
          currentNode: node,
          currentEdge: [node, neighbor],
          queue: [...queue],
        });
      }
    }
  }

  rec.record({
    lineOfCode: 12,
    description: "Queue is empty - BFS complete. Every reachable node has been visited.",
    variables: {},
    queue: [],
  });

  return rec.getSteps();
}
