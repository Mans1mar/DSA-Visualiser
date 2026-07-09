import { TreeStepRecorder } from "@/lib/tree/tree-step-recorder";
import type { Step, TreeNode } from "@/types/step";
import type { LanguageSources } from "./languages";
import { buildBst } from "./tree-shared";

// Line-for-line across all three languages (and BST_INORDER_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const BST_INORDER_SOURCES: LanguageSources = {
  java: [
    "static void inorder(Node node) {",
    "  if (node == null) {",
    "    return;",
    "  }",
    "  inorder(node.left);",
    "  visit(node);",
    "  inorder(node.right);",
    "}",
  ],
  cpp: [
    "void inorder(Node* node) {",
    "  if (node == nullptr) {",
    "    return;",
    "  }",
    "  inorder(node->left);",
    "  visit(node);",
    "  inorder(node->right);",
    "}",
  ],
  python: [
    "def inorder(node):",
    "    if node is None:",
    "        return",
    "    # end if",
    "    inorder(node.left)",
    "    visit(node)",
    "    inorder(node.right)",
    "    # end inorder",
  ],
};

// Line-for-line pseudocode counterpart to BST_INORDER_SOURCES.
export const BST_INORDER_PSEUDOCODE = [
  "function inorder(node)",
  "    if node is empty",
  "        return",
  "    end if",
  "    inorder(node.left)",
  "    visit(node)",
  "    inorder(node.right)",
  "end function",
];

/**
 * Left subtree, then this node, then right subtree - visits a BST's
 * values in ascending order, since everything in node.left is smaller
 * and everything in node.right is larger. Builds its tree silently from
 * `values` via buildBst, the same "build first" split Search/Delete
 * share - only the traversal itself is visualized.
 */
export function bstInorder(values: number[]): Step[] {
  const root = buildBst(values);
  const rec = new TreeStepRecorder();

  rec.record({
    lineOfCode: 1,
    description: root
      ? "Walk the tree inorder: left subtree, this node, right subtree - visits values in ascending order."
      : "The tree is empty - nothing to traverse.",
    variables: {},
    tree: root,
  });

  let visitCount = 0;

  function walk(node: TreeNode | null) {
    if (node === null) return;
    rec.pushCall({ fnName: "inorder", args: [node.value] });

    walk(node.left);

    rec.markVisited(node.id);
    visitCount += 1;
    rec.record({
      lineOfCode: 6,
      description: `Visit ${node.value} (#${visitCount} in the traversal).`,
      variables: { value: node.value },
      currentNode: node.id,
      tree: root,
    });

    walk(node.right);
    rec.popCall();
  }

  walk(root);

  rec.record({
    lineOfCode: 8,
    description: root ? "Traversal complete." : "Nothing to do.",
    variables: {},
    tree: root,
  });

  return rec.getSteps();
}
