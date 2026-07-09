import { TreeStepRecorder } from "@/lib/tree/tree-step-recorder";
import type { Step, TreeNode } from "@/types/step";
import type { LanguageSources } from "./languages";
import { buildBst } from "./tree-shared";

// Line-for-line across all three languages (and BST_LEVELORDER_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const BST_LEVELORDER_SOURCES: LanguageSources = {
  java: [
    "static void levelOrder(Node root) {",
    "  if (root == null) {",
    "    return;",
    "  }",
    "  Queue<Node> queue = new LinkedList<>(List.of(root));",
    "  while (!queue.isEmpty()) {",
    "    Node node = queue.poll();",
    "    visit(node);",
    "    if (node.left != null) queue.offer(node.left);",
    "    if (node.right != null) queue.offer(node.right);",
    "  }",
    "}",
  ],
  cpp: [
    "void levelOrder(Node* root) {",
    "  if (root == nullptr) {",
    "    return;",
    "  }",
    "  queue<Node*> q; q.push(root);",
    "  while (!q.empty()) {",
    "    Node* node = q.front(); q.pop();",
    "    visit(node);",
    "    if (node->left != nullptr) q.push(node->left);",
    "    if (node->right != nullptr) q.push(node->right);",
    "  }",
    "}",
  ],
  python: [
    "def level_order(root):",
    "    if root is None:",
    "        return",
    "    # end if",
    "    queue = deque([root])",
    "    while queue:",
    "        node = queue.popleft()",
    "        visit(node)",
    "        if node.left is not None: queue.append(node.left)",
    "        if node.right is not None: queue.append(node.right)",
    "    # end while",
    "    # end level_order",
  ],
};

// Line-for-line pseudocode counterpart to BST_LEVELORDER_SOURCES.
export const BST_LEVELORDER_PSEUDOCODE = [
  "function levelOrder(root)",
  "    if root is empty",
  "        return",
  "    end if",
  "    queue = [root]",
  "    while queue is not empty",
  "        node = dequeue queue",
  "        visit(node)",
  "        if node.left is not empty: enqueue node.left",
  "        if node.right is not empty: enqueue node.right",
  "    end while",
  "end function",
];

/**
 * Visits the root, then every node one level deeper, then the next
 * level, and so on - breadth-first via an explicit queue rather than
 * recursion, the same shape as the Graph category's BFS. Builds its
 * tree silently from `values` via buildBst, the same "build first"
 * split Search/Delete share - only the traversal itself is visualized.
 */
export function bstLevelOrder(values: number[]): Step[] {
  const root = buildBst(values);
  const rec = new TreeStepRecorder();

  rec.record({
    lineOfCode: 1,
    description: root
      ? "Walk the tree level by level using a queue - the root, then each depth in turn, left to right."
      : "The tree is empty - nothing to traverse.",
    variables: {},
    tree: root,
  });

  if (root === null) {
    rec.record({
      lineOfCode: 12,
      description: "Nothing to do.",
      variables: {},
      tree: root,
    });
    return rec.getSteps();
  }

  const queue: TreeNode[] = [root];
  rec.record({
    lineOfCode: 5,
    description: `Start with just the root (${root.value}) in the queue.`,
    variables: {},
    queue: queue.map((n) => n.value),
    tree: root,
  });

  let visitCount = 0;
  while (queue.length > 0) {
    const node = queue.shift()!;
    rec.markVisited(node.id);
    visitCount += 1;
    rec.record({
      lineOfCode: 8,
      description: `Dequeue ${node.value} and visit it (#${visitCount} in the traversal).`,
      variables: { value: node.value },
      currentNode: node.id,
      queue: queue.map((n) => n.value),
      tree: root,
    });

    if (node.left !== null) {
      queue.push(node.left);
      rec.record({
        lineOfCode: 9,
        description: `${node.value} has a left child (${node.left.value}) - enqueue it.`,
        variables: { value: node.value },
        currentNode: node.id,
        queue: queue.map((n) => n.value),
        tree: root,
      });
    }
    if (node.right !== null) {
      queue.push(node.right);
      rec.record({
        lineOfCode: 10,
        description: `${node.value} has a right child (${node.right.value}) - enqueue it.`,
        variables: { value: node.value },
        currentNode: node.id,
        queue: queue.map((n) => n.value),
        tree: root,
      });
    }
  }

  rec.record({
    lineOfCode: 12,
    description: "Queue is empty - traversal complete.",
    variables: {},
    tree: root,
  });

  return rec.getSteps();
}
