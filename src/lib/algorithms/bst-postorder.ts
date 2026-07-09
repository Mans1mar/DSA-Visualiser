import { TreeStepRecorder } from "@/lib/tree/tree-step-recorder";
import type { Step, TreeNode } from "@/types/step";
import type { LanguageSources } from "./languages";
import { buildBst } from "./tree-shared";

// Line-for-line across all three languages (and BST_POSTORDER_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const BST_POSTORDER_SOURCES: LanguageSources = {
  java: [
    "static void postorder(Node node) {",
    "  if (node == null) {",
    "    return;",
    "  }",
    "  postorder(node.left);",
    "  postorder(node.right);",
    "  visit(node);",
    "}",
  ],
  cpp: [
    "void postorder(Node* node) {",
    "  if (node == nullptr) {",
    "    return;",
    "  }",
    "  postorder(node->left);",
    "  postorder(node->right);",
    "  visit(node);",
    "}",
  ],
  python: [
    "def postorder(node):",
    "    if node is None:",
    "        return",
    "    # end if",
    "    postorder(node.left)",
    "    postorder(node.right)",
    "    visit(node)",
    "    # end postorder",
  ],
};

// Line-for-line pseudocode counterpart to BST_POSTORDER_SOURCES.
export const BST_POSTORDER_PSEUDOCODE = [
  "function postorder(node)",
  "    if node is empty",
  "        return",
  "    end if",
  "    postorder(node.left)",
  "    postorder(node.right)",
  "    visit(node)",
  "end function",
];

/**
 * Left subtree, then right subtree, then this node - a node is always
 * visited only after both of its children, which is why it's the
 * natural order for safely deleting/freeing a tree bottom-up. Builds
 * its tree silently from `values` via buildBst, the same "build first"
 * split Search/Delete share - only the traversal itself is visualized.
 */
export function bstPostorder(values: number[]): Step[] {
  const root = buildBst(values);
  const rec = new TreeStepRecorder();

  rec.record({
    lineOfCode: 1,
    description: root
      ? "Walk the tree postorder: left subtree, then right subtree, then this node."
      : "The tree is empty - nothing to traverse.",
    variables: {},
    tree: root,
  });

  let visitCount = 0;

  function walk(node: TreeNode | null) {
    if (node === null) return;
    rec.pushCall({ fnName: "postorder", args: [node.value] });

    walk(node.left);
    walk(node.right);

    rec.markVisited(node.id);
    visitCount += 1;
    rec.record({
      lineOfCode: 7,
      description: `Visit ${node.value} (#${visitCount} in the traversal).`,
      variables: { value: node.value },
      currentNode: node.id,
      tree: root,
    });

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
