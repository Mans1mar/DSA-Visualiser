import { TreeStepRecorder } from "@/lib/tree/tree-step-recorder";
import type { Step, TreeNode } from "@/types/step";
import type { LanguageSources } from "./languages";
import { buildBst, TREE_DELETE_TARGET } from "./tree-shared";

// Line-for-line across all three languages (and BST_DELETE_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
// C++'s function is named deleteNode rather than delete, which is a
// reserved keyword there.
export const BST_DELETE_SOURCES: LanguageSources = {
  java: [
    "static Node delete(Node node, int value) {",
    "  if (node == null) {",
    "    return null; // not found - nothing to delete",
    "  }",
    "  if (value < node.value) {",
    "    node.left = delete(node.left, value);",
    "  } else if (value > node.value) {",
    "    node.right = delete(node.right, value);",
    "  } else { // value == node.value",
    "    if (node.left == null) {",
    "      return node.right;",
    "    } else if (node.right == null) {",
    "      return node.left;",
    "    } else {",
    "      Node successor = leftmost(node.right);",
    "      node.value = successor.value;",
    "      node.right = delete(node.right, successor.value);",
    "    }",
    "  }",
    "  return node;",
    "}",
  ],
  cpp: [
    "Node* deleteNode(Node* node, int value) {",
    "  if (node == nullptr) {",
    "    return nullptr; // not found - nothing to delete",
    "  }",
    "  if (value < node->value) {",
    "    node->left = deleteNode(node->left, value);",
    "  } else if (value > node->value) {",
    "    node->right = deleteNode(node->right, value);",
    "  } else { // value == node->value",
    "    if (node->left == nullptr) {",
    "      return node->right;",
    "    } else if (node->right == nullptr) {",
    "      return node->left;",
    "    } else {",
    "      Node* successor = leftmost(node->right);",
    "      node->value = successor->value;",
    "      node->right = deleteNode(node->right, successor->value);",
    "    }",
    "  }",
    "  return node;",
    "}",
  ],
  python: [
    "def delete(node, value):",
    "    if node is None:",
    "        return None  # not found - nothing to delete",
    "    # end if",
    "    if value < node.value:",
    "        node.left = delete(node.left, value)",
    "    elif value > node.value:",
    "        node.right = delete(node.right, value)",
    "    else:  # value == node.value",
    "        if node.left is None:",
    "            return node.right",
    "        elif node.right is None:",
    "            return node.left",
    "        else:",
    "            successor = leftmost(node.right)",
    "            node.value = successor.value",
    "            node.right = delete(node.right, successor.value)",
    "        # end if",
    "    # end if",
    "    return node",
    "    # end delete",
  ],
};

// Line-for-line pseudocode counterpart to BST_DELETE_SOURCES.
export const BST_DELETE_PSEUDOCODE = [
  "function delete(node, value)",
  "    if node is empty",
  "        return node   // not found - nothing to delete",
  "    end if",
  "    if value < node.value",
  "        node.left = delete(node.left, value)",
  "    else if value > node.value",
  "        node.right = delete(node.right, value)",
  "    else // value == node.value",
  "        if node.left is empty",
  "            return node.right",
  "        else if node.right is empty",
  "            return node.left",
  "        else",
  "            successor = leftmost node of node.right",
  "            node.value = successor.value",
  "            node.right = delete(node.right, successor.value)",
  "        end if",
  "    end if",
  "    return node",
  "end function",
];

/**
 * Deletes `target` from the BST built silently from `values`. Three
 * cases once the node is located: no left child (splice in the right
 * child - this also covers the leaf case, where that "right child" is
 * just null), no right child (splice in the left child), or two
 * children (copy the inorder successor's value in, then delete that
 * successor from the right subtree - which by construction never has a
 * left child, so that recursive delete always lands in the first case).
 *
 * Mutation happens through an explicit `setter` callback rather than
 * the usual "caller reassigns the return value" - `node.left = delete(...)`
 * only takes effect once the whole recursive call returns, which is too
 * late to record a step showing the tree with that link already
 * changed. Routing every mutation through a setter invoked immediately
 * before the record() that depends on it keeps every snapshot accurate,
 * whether the changed pointer belongs to a parent node or is the root
 * itself (root has no parent object to mutate through - the setter
 * generalizes that case too).
 */
export function bstDelete(values: number[], target: number = TREE_DELETE_TARGET): Step[] {
  let root = buildBst(values);
  const rec = new TreeStepRecorder();

  rec.record({
    lineOfCode: 2,
    description: root ? `Delete ${target} from the tree.` : "The tree is empty - nothing to delete.",
    variables: { target },
    tree: root,
  });

  function deleteValue(
    node: TreeNode | null,
    value: number,
    setter: (replacement: TreeNode | null) => void
  ) {
    rec.pushCall({ fnName: "delete", args: [value] });

    if (node === null) {
      rec.record({
        lineOfCode: 2,
        description: `Reached an empty spot - ${value} isn't in the tree.`,
        variables: { value },
        tree: root,
      });
      rec.popCall();
      return;
    }

    if (value < node.value) {
      rec.record({
        lineOfCode: 5,
        description: `${value} < ${node.value} - go left.`,
        variables: { value, current: node.value },
        currentNode: node.id,
        comparisonResult: "left",
        comparisonMade: true,
        tree: root,
      });
      deleteValue(node.left, value, (replacement) => {
        node.left = replacement;
      });
    } else if (value > node.value) {
      rec.record({
        lineOfCode: 7,
        description: `${value} > ${node.value} - go right.`,
        variables: { value, current: node.value },
        currentNode: node.id,
        comparisonResult: "right",
        comparisonMade: true,
        tree: root,
      });
      deleteValue(node.right, value, (replacement) => {
        node.right = replacement;
      });
    } else {
      rec.record({
        lineOfCode: 9,
        description: `${value} matches this node - this is the one to delete.`,
        variables: { value },
        currentNode: node.id,
        comparisonResult: "found",
        comparisonMade: true,
        tree: root,
      });

      const leftChild = node.left;
      const rightChild = node.right;

      if (leftChild === null) {
        setter(rightChild);
        rec.record({
          lineOfCode: 11,
          description: rightChild
            ? `${value} has no left child - splice in its right child (${rightChild.value}).`
            : `${value} has no children - remove it.`,
          variables: { value },
          currentNode: rightChild?.id,
          tree: root,
        });
      } else if (rightChild === null) {
        setter(leftChild);
        rec.record({
          lineOfCode: 13,
          description: `${value} has no right child - splice in its left child (${leftChild.value}).`,
          variables: { value },
          currentNode: leftChild.id,
          tree: root,
        });
      } else {
        let successor = rightChild;
        rec.record({
          lineOfCode: 15,
          description: `${value} has two children - find its inorder successor: start at the right child (${successor.value}) and go left as far as possible.`,
          variables: { value },
          currentNode: successor.id,
          tree: root,
        });
        while (successor.left !== null) {
          successor = successor.left;
          rec.record({
            lineOfCode: 15,
            description: `Keep going left: ${successor.value}.`,
            variables: { value },
            currentNode: successor.id,
            tree: root,
          });
        }

        const successorValue = successor.value;
        node.value = successorValue;
        rec.record({
          lineOfCode: 16,
          description: `Copy the successor's value (${successorValue}) into this node.`,
          variables: { value: successorValue },
          currentNode: node.id,
          tree: root,
        });

        deleteValue(rightChild, successorValue, (replacement) => {
          node.right = replacement;
        });
      }
    }

    rec.popCall();
  }

  if (root !== null) {
    deleteValue(root, target, (replacement) => {
      root = replacement;
    });
  }

  rec.record({
    lineOfCode: 20,
    description: "Done.",
    variables: {},
    tree: root,
  });

  return rec.getSteps();
}
