import { TreeStepRecorder } from "@/lib/tree/tree-step-recorder";
import type { Step, TreeNode } from "@/types/step";
import type { LanguageSources } from "./languages";
import { buildBst, TREE_SEARCH_TARGET } from "./tree-shared";

// Line-for-line across all three languages (and BST_SEARCH_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const BST_SEARCH_SOURCES: LanguageSources = {
  java: [
    "static Node search(Node root, int target) {",
    "  Node node = root;",
    "  while (node != null) {",
    "    if (target == node.value) {",
    "      return node;",
    "    } else if (target < node.value) {",
    "      node = node.left;",
    "    } else {",
    "      node = node.right;",
    "    }",
    "  }",
    "  return null;",
    "}",
  ],
  cpp: [
    "Node* search(Node* root, int target) {",
    "  Node* node = root;",
    "  while (node != nullptr) {",
    "    if (target == node->value) {",
    "      return node;",
    "    } else if (target < node->value) {",
    "      node = node->left;",
    "    } else {",
    "      node = node->right;",
    "    }",
    "  }",
    "  return nullptr;",
    "}",
  ],
  python: [
    "def search(root, target):",
    "    node = root",
    "    while node is not None:",
    "        if target == node.value:",
    "            return node",
    "        elif target < node.value:",
    "            node = node.left",
    "        else:",
    "            node = node.right",
    "        # end if",
    "    # end while",
    "    return None",
    "    # end search",
  ],
};

// Line-for-line pseudocode counterpart to BST_SEARCH_SOURCES.
export const BST_SEARCH_PSEUDOCODE = [
  "function search(root, target)",
  "    node = root",
  "    while node is not empty",
  "        if target == node.value",
  "            return node   // found",
  "        else if target < node.value",
  "            node = node.left",
  "        else",
  "            node = node.right",
  "        end if",
  "    end while",
  "    return not found",
  "end function",
];

/**
 * Walks down from the root, going left or right depending on how the
 * target compares to the current node, until it matches (found) or the
 * walk runs off the tree (not found). Builds its starting tree silently
 * from `values` via buildBst - only the search walk itself is
 * visualized, the same "build first" split as Search/Delete/Traversals
 * all share.
 */
export function bstSearch(values: number[], target: number = TREE_SEARCH_TARGET): Step[] {
  const root = buildBst(values);
  const rec = new TreeStepRecorder();

  rec.record({
    lineOfCode: 2,
    description: root
      ? `Search for ${target}, starting at the root (${root.value}).`
      : "The tree is empty - nothing to search.",
    variables: { target },
    tree: root,
  });

  let node: TreeNode | null = root;
  while (node !== null) {
    if (target === node.value) {
      rec.markFound(node.id);
      rec.record({
        lineOfCode: 4,
        description: `${target} matches this node - found it!`,
        variables: { target, current: node.value },
        currentNode: node.id,
        comparisonResult: "found",
        comparisonMade: true,
        tree: root,
      });
      return rec.getSteps();
    }

    if (target < node.value) {
      rec.record({
        lineOfCode: 6,
        description: `${target} < ${node.value} - go left.`,
        variables: { target, current: node.value },
        currentNode: node.id,
        comparisonResult: "left",
        comparisonMade: true,
        tree: root,
      });
      node = node.left;
    } else {
      rec.record({
        lineOfCode: 8,
        description: `${target} > ${node.value} - go right.`,
        variables: { target, current: node.value },
        currentNode: node.id,
        comparisonResult: "right",
        comparisonMade: true,
        tree: root,
      });
      node = node.right;
    }
  }

  rec.record({
    lineOfCode: 12,
    description: root ? `${target} isn't in the tree.` : "Empty tree - nothing to search.",
    variables: { target },
    comparisonResult: "not-found",
    tree: root,
  });

  return rec.getSteps();
}
