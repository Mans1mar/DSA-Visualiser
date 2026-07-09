import { TreeStepRecorder } from "@/lib/tree/tree-step-recorder";
import type { Step, TreeNode } from "@/types/step";
import type { LanguageSources } from "./languages";
import { buildBst } from "./tree-shared";

// Line-for-line across all three languages (and BST_PREORDER_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const BST_PREORDER_SOURCES: LanguageSources = {
  java: [
    "static void preorder(Node node) {",
    "  if (node == null) {",
    "    return;",
    "  }",
    "  visit(node);",
    "  preorder(node.left);",
    "  preorder(node.right);",
    "}",
  ],
  cpp: [
    "void preorder(Node* node) {",
    "  if (node == nullptr) {",
    "    return;",
    "  }",
    "  visit(node);",
    "  preorder(node->left);",
    "  preorder(node->right);",
    "}",
  ],
  python: [
    "def preorder(node):",
    "    if node is None:",
    "        return",
    "    # end if",
    "    visit(node)",
    "    preorder(node.left)",
    "    preorder(node.right)",
    "    # end preorder",
  ],
};

// Line-for-line pseudocode counterpart to BST_PREORDER_SOURCES.
export const BST_PREORDER_PSEUDOCODE = [
  "function preorder(node)",
  "    if node is empty",
  "        return",
  "    end if",
  "    visit(node)",
  "    preorder(node.left)",
  "    preorder(node.right)",
  "end function",
];

/**
 * This node, then left subtree, then right subtree - a node is always
 * visited before either of its children, which is why it's the natural
 * order for reconstructing/copying a tree's shape (the parent always
 * appears before it needs one). Builds its tree silently from `values`
 * via buildBst, the same "build first" split Search/Delete share - only
 * the traversal itself is visualized.
 */
export function bstPreorder(values: number[]): Step[] {
  const root = buildBst(values);
  const rec = new TreeStepRecorder();

  rec.record({
    lineOfCode: 1,
    description: root
      ? "Walk the tree preorder: this node, then left subtree, then right subtree."
      : "The tree is empty - nothing to traverse.",
    variables: {},
    tree: root,
  });

  let visitCount = 0;

  function walk(node: TreeNode | null) {
    if (node === null) return;
    rec.pushCall({ fnName: "preorder", args: [node.value] });

    rec.markVisited(node.id);
    visitCount += 1;
    rec.record({
      lineOfCode: 5,
      description: `Visit ${node.value} (#${visitCount} in the traversal).`,
      variables: { value: node.value },
      currentNode: node.id,
      tree: root,
    });

    walk(node.left);
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
