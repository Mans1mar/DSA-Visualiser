import { TreeStepRecorder } from "@/lib/tree/tree-step-recorder";
import type { Step, TreeNode } from "@/types/step";
import { AVL_DELETE_TARGET, buildAvl } from "./avl-shared";
import type { LanguageSources } from "./languages";

// Line-for-line across all three languages (and AVL_DELETE_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
// C++'s function is named deleteNode rather than delete, which is a
// reserved keyword there.
export const AVL_DELETE_SOURCES: LanguageSources = {
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
    "  int balance = height(node.left) - height(node.right);",
    "  if (balance > 1 && balanceFactor(node.left) < 0) {",
    "    node.left = rotateLeft(node.left); // left-right case",
    "  }",
    "  if (balance < -1 && balanceFactor(node.right) > 0) {",
    "    node.right = rotateRight(node.right); // right-left case",
    "  }",
    "  if (balance > 1) {",
    "    return rotateRight(node);",
    "  }",
    "  if (balance < -1) {",
    "    return rotateLeft(node);",
    "  }",
    "  return node;",
    "}",
    "",
    "static Node rotateRight(Node node) {",
    "  Node pivot = node.left;",
    "  node.left = pivot.right;",
    "  pivot.right = node;",
    "  return pivot;",
    "}",
    "",
    "static Node rotateLeft(Node node) {",
    "  Node pivot = node.right;",
    "  node.right = pivot.left;",
    "  pivot.left = node;",
    "  return pivot;",
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
    "  int balance = height(node->left) - height(node->right);",
    "  if (balance > 1 && balanceFactor(node->left) < 0) {",
    "    node->left = rotateLeft(node->left); // left-right case",
    "  }",
    "  if (balance < -1 && balanceFactor(node->right) > 0) {",
    "    node->right = rotateRight(node->right); // right-left case",
    "  }",
    "  if (balance > 1) {",
    "    return rotateRight(node);",
    "  }",
    "  if (balance < -1) {",
    "    return rotateLeft(node);",
    "  }",
    "  return node;",
    "}",
    "",
    "Node* rotateRight(Node* node) {",
    "  Node* pivot = node->left;",
    "  node->left = pivot->right;",
    "  pivot->right = node;",
    "  return pivot;",
    "}",
    "",
    "Node* rotateLeft(Node* node) {",
    "  Node* pivot = node->right;",
    "  node->right = pivot->left;",
    "  pivot->left = node;",
    "  return pivot;",
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
    "    balance = height(node.left) - height(node.right)",
    "    if balance > 1 and balance_factor(node.left) < 0:",
    "        node.left = rotate_left(node.left)  # left-right case",
    "    # end if",
    "    if balance < -1 and balance_factor(node.right) > 0:",
    "        node.right = rotate_right(node.right)  # right-left case",
    "    # end if",
    "    if balance > 1:",
    "        return rotate_right(node)",
    "    # end if",
    "    if balance < -1:",
    "        return rotate_left(node)",
    "    # end if",
    "    return node",
    "    # end delete",
    "",
    "def rotate_right(node):",
    "    pivot = node.left",
    "    node.left = pivot.right",
    "    pivot.right = node",
    "    return pivot",
    "    # end rotate_right",
    "",
    "def rotate_left(node):",
    "    pivot = node.right",
    "    node.right = pivot.left",
    "    pivot.left = node",
    "    return pivot",
    "    # end rotate_left",
  ],
};

// Line-for-line pseudocode counterpart to AVL_DELETE_SOURCES.
export const AVL_DELETE_PSEUDOCODE = [
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
  "    balance = height(node.left) - height(node.right)",
  "    if balance > 1 and balanceFactor(node.left) < 0",
  "        node.left = rotateLeft(node.left)   // left-right case",
  "    end if",
  "    if balance < -1 and balanceFactor(node.right) > 0",
  "        node.right = rotateRight(node.right)   // right-left case",
  "    end if",
  "    if balance > 1",
  "        return rotateRight(node)",
  "    end if",
  "    if balance < -1",
  "        return rotateLeft(node)",
  "    end if",
  "    return node",
  "end function",
  "",
  "function rotateRight(node)",
  "    pivot = node.left",
  "    node.left = pivot.right",
  "    pivot.right = node",
  "    return pivot",
  "end function",
  "",
  "function rotateLeft(node)",
  "    pivot = node.right",
  "    node.right = pivot.left",
  "    pivot.left = node",
  "    return pivot",
  "end function",
];

function height(node: TreeNode | null): number {
  return node ? 1 + Math.max(height(node.left), height(node.right)) : 0;
}

function balanceFactorOf(node: TreeNode): number {
  return height(node.left) - height(node.right);
}

function rotateRight(node: TreeNode): TreeNode {
  const pivot = node.left!;
  node.left = pivot.right;
  pivot.right = node;
  return pivot;
}

function rotateLeft(node: TreeNode): TreeNode {
  const pivot = node.right!;
  node.right = pivot.left;
  pivot.left = node;
  return pivot;
}

/**
 * Deletes `target` from the AVL tree built silently from `values`.
 * Locating and removing the node is exactly bstDelete's three cases (no
 * left child - splice in the right, which also covers the leaf case;
 * no right child - splice in the left; two children - copy the inorder
 * successor's value in, then delete that successor). The AVL-specific
 * part: every node whose subtree actually changed (everywhere along the
 * walk down, and back up) gets its balance factor re-checked as the
 * recursion unwinds, and rotated if it fell outside [-1, 1] - unlike
 * insert, a single deletion can require a rotation at more than one
 * ancestor level, which is why this check runs unconditionally on the
 * way back up rather than stopping after the first fix. A node that
 * was itself removed (the leaf/one-child cases) never reaches this
 * check - there's nothing left at that position to rebalance.
 */
export function avlDelete(values: number[], target: number = AVL_DELETE_TARGET): Step[] {
  let root = buildAvl(values);
  const rec = new TreeStepRecorder();

  rec.record({
    lineOfCode: 2,
    description: root ? `Delete ${target} from the AVL tree.` : "The tree is empty - nothing to delete.",
    variables: { target },
    tree: root,
  });

  function deleteNode(
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
      deleteNode(node.left, value, (replacement) => {
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
      deleteNode(node.right, value, (replacement) => {
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
        rec.popCall();
        return;
      }
      if (rightChild === null) {
        setter(leftChild);
        rec.record({
          lineOfCode: 13,
          description: `${value} has no right child - splice in its left child (${leftChild.value}).`,
          variables: { value },
          currentNode: leftChild.id,
          tree: root,
        });
        rec.popCall();
        return;
      }

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

      deleteNode(rightChild, successorValue, (replacement) => {
        node.right = replacement;
      });
      // Falls through to the rebalance check below - node itself still
      // exists (just holding the successor's value now), unlike the
      // leaf/one-child branches above which already returned.
    }

    const balance = balanceFactorOf(node);
    const outOfRange = Math.abs(balance) > 1;
    rec.record({
      lineOfCode: 20,
      description: outOfRange
        ? `Balance factor at ${node.value} is ${balance} - out of the allowed [-1, 1] range, rotation needed.`
        : `Balance factor at ${node.value} is ${balance} - still balanced.`,
      variables: { value: node.value, balance },
      currentNode: node.id,
      tree: root,
    });

    if (balance > 1) {
      const left = node.left!;
      if (balanceFactorOf(left) < 0) {
        rec.record({
          lineOfCode: 22,
          description: `${left.value} is right-heavy - rotate it left first (left-right case).`,
          variables: {},
          currentNode: left.id,
          rotation: { type: "left", pivotNodeId: left.right!.id },
          tree: root,
        });
        node.left = rotateLeft(left);
        rec.record({
          lineOfCode: 22,
          description: `Rotated left at ${left.value}.`,
          variables: {},
          currentNode: node.left.id,
          tree: root,
        });
      }
      const rotated = rotateRight(node);
      rec.record({
        lineOfCode: 28,
        description: `Rotate right at ${node.value} to rebalance.`,
        variables: {},
        currentNode: rotated.id,
        rotation: { type: "right", pivotNodeId: rotated.id },
        tree: root,
      });
      setter(rotated);
    } else if (balance < -1) {
      const right = node.right!;
      if (balanceFactorOf(right) > 0) {
        rec.record({
          lineOfCode: 25,
          description: `${right.value} is left-heavy - rotate it right first (right-left case).`,
          variables: {},
          currentNode: right.id,
          rotation: { type: "right", pivotNodeId: right.left!.id },
          tree: root,
        });
        node.right = rotateRight(right);
        rec.record({
          lineOfCode: 25,
          description: `Rotated right at ${right.value}.`,
          variables: {},
          currentNode: node.right.id,
          tree: root,
        });
      }
      const rotated = rotateLeft(node);
      rec.record({
        lineOfCode: 31,
        description: `Rotate left at ${node.value} to rebalance.`,
        variables: {},
        currentNode: rotated.id,
        rotation: { type: "left", pivotNodeId: rotated.id },
        tree: root,
      });
      setter(rotated);
    }

    rec.popCall();
  }

  if (root !== null) {
    deleteNode(root, target, (replacement) => {
      root = replacement;
    });
  }

  rec.record({
    lineOfCode: 33,
    description: "Done.",
    variables: {},
    tree: root,
  });

  return rec.getSteps();
}
