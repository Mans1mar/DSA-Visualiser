import { TreeStepRecorder } from "@/lib/tree/tree-step-recorder";
import type { Step, TreeNode } from "@/types/step";
import type { LanguageSources } from "./languages";

// Line-for-line across all three languages (and AVL_INSERT_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const AVL_INSERT_SOURCES: LanguageSources = {
  java: [
    "static Node insertAll(List<Integer> values) {",
    "  Node tree = null;",
    "  for (int value : values) {",
    "    if (tree == null) {",
    "      tree = new Node(value);",
    "    } else {",
    "      tree = insert(tree, value);",
    "    }",
    "  }",
    "  return tree;",
    "}",
    "",
    "static Node insert(Node node, int value) {",
    "  if (value < node.value) {",
    "    if (node.left == null) {",
    "      node.left = new Node(value);",
    "    } else {",
    "      node.left = insert(node.left, value);",
    "    }",
    "  } else if (value > node.value) {",
    "    if (node.right == null) {",
    "      node.right = new Node(value);",
    "    } else {",
    "      node.right = insert(node.right, value);",
    "    }",
    "  } else { // value == node.value",
    "    return node; // duplicate - no change",
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
    "Node* insertAll(vector<int>& values) {",
    "  Node* tree = nullptr;",
    "  for (int value : values) {",
    "    if (tree == nullptr) {",
    "      tree = new Node(value);",
    "    } else {",
    "      tree = insert(tree, value);",
    "    }",
    "  }",
    "  return tree;",
    "}",
    "",
    "Node* insert(Node* node, int value) {",
    "  if (value < node->value) {",
    "    if (node->left == nullptr) {",
    "      node->left = new Node(value);",
    "    } else {",
    "      node->left = insert(node->left, value);",
    "    }",
    "  } else if (value > node->value) {",
    "    if (node->right == nullptr) {",
    "      node->right = new Node(value);",
    "    } else {",
    "      node->right = insert(node->right, value);",
    "    }",
    "  } else { // value == node->value",
    "    return node; // duplicate - no change",
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
    "def insert_all(values):",
    "    tree = None",
    "    for value in values:",
    "        if tree is None:",
    "            tree = Node(value)",
    "        else:",
    "            tree = insert(tree, value)",
    "        # end if",
    "    # end for",
    "    return tree",
    "    # end insert_all",
    "",
    "def insert(node, value):",
    "    if value < node.value:",
    "        if node.left is None:",
    "            node.left = Node(value)",
    "        else:",
    "            node.left = insert(node.left, value)",
    "        # end if",
    "    elif value > node.value:",
    "        if node.right is None:",
    "            node.right = Node(value)",
    "        else:",
    "            node.right = insert(node.right, value)",
    "        # end if",
    "    else:  # value == node.value",
    "        return node  # duplicate - no change",
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
    "    # end insert",
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

// Line-for-line pseudocode counterpart to AVL_INSERT_SOURCES.
export const AVL_INSERT_PSEUDOCODE = [
  "function insertAll(values)",
  "    tree = empty",
  "    for each value in values",
  "        if tree is empty",
  "            tree = new Node(value)",
  "        else",
  "            tree = insert(tree, value)",
  "        end if",
  "    end for",
  "    return tree",
  "end function",
  "",
  "function insert(node, value)",
  "    if value < node.value",
  "        if node.left is empty",
  "            node.left = new Node(value)",
  "        else",
  "            node.left = insert(node.left, value)",
  "        end if",
  "    else if value > node.value",
  "        if node.right is empty",
  "            node.right = new Node(value)",
  "        else",
  "            node.right = insert(node.right, value)",
  "        end if",
  "    else // value == node.value",
  "        return node   // duplicate - no change",
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

/** Empty subtree = 0, a leaf = 1 - the same convention TreeView's
 * balance-factor badge uses (lib/tree/layout.ts), so the number shown
 * on screen always matches what this algorithm is reasoning about. */
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
 * Inserts values one at a time into an initially empty AVL tree - a
 * self-balancing BST that, after every insert, walks back up from the
 * new leaf to the root checking each ancestor's balance factor
 * (height(left) - height(right)) and rotating whenever it falls outside
 * [-1, 1]. Four cases: left-left and right-right need a single rotation;
 * left-right and right-left need two (rotate the child first, then the
 * node itself). Mutates real Node objects in place, same reasoning as
 * bstInsert - TreeStepRecorder deep-clones on every record() call, so
 * earlier steps' snapshots are never affected by a later mutation.
 */
export function avlInsert(values: number[]): Step[] {
  const rec = new TreeStepRecorder();
  let root: TreeNode | null = null;
  let nextId = 0;
  const makeId = () => `n${nextId++}`;

  rec.record({
    lineOfCode: 2,
    description:
      values.length > 0
        ? `Insert ${values.length} value${values.length === 1 ? "" : "s"} one at a time into an initially empty AVL tree: ${values.join(", ")}. After each insert, ancestors rebalance automatically if needed.`
        : "No values to insert - the tree stays empty.",
    variables: { values },
    tree: root,
  });

  function insert(node: TreeNode, value: number, setter: (replacement: TreeNode) => void) {
    rec.pushCall({ fnName: "insert", args: [value] });

    if (value === node.value) {
      rec.record({
        lineOfCode: 26,
        description: `${value} already exists at this node - no duplicates, nothing changes.`,
        variables: { value, current: node.value },
        currentNode: node.id,
        comparisonResult: "found",
        comparisonMade: true,
        tree: root,
      });
      rec.popCall();
      return;
    }

    if (value < node.value) {
      rec.record({
        lineOfCode: 14,
        description: `${value} < ${node.value} - go left.`,
        variables: { value, current: node.value },
        currentNode: node.id,
        comparisonResult: "left",
        comparisonMade: true,
        tree: root,
      });
      if (node.left === null) {
        const created: TreeNode = { id: makeId(), value, left: null, right: null };
        node.left = created;
        rec.record({
          lineOfCode: 16,
          description: `Nothing to the left of ${node.value} - insert ${value} here.`,
          variables: { value },
          currentNode: created.id,
          tree: root,
        });
      } else {
        insert(node.left, value, (replacement) => {
          node.left = replacement;
        });
      }
    } else {
      rec.record({
        lineOfCode: 20,
        description: `${value} > ${node.value} - go right.`,
        variables: { value, current: node.value },
        currentNode: node.id,
        comparisonResult: "right",
        comparisonMade: true,
        tree: root,
      });
      if (node.right === null) {
        const created: TreeNode = { id: makeId(), value, left: null, right: null };
        node.right = created;
        rec.record({
          lineOfCode: 22,
          description: `Nothing to the right of ${node.value} - insert ${value} here.`,
          variables: { value },
          currentNode: created.id,
          tree: root,
        });
      } else {
        insert(node.right, value, (replacement) => {
          node.right = replacement;
        });
      }
    }

    const balance = balanceFactorOf(node);
    const outOfRange = Math.abs(balance) > 1;
    rec.record({
      lineOfCode: 29,
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
          lineOfCode: 31,
          description: `${left.value} is right-heavy - rotate it left first (left-right case).`,
          variables: {},
          currentNode: left.id,
          rotation: { type: "left", pivotNodeId: left.right!.id },
          tree: root,
        });
        node.left = rotateLeft(left);
        rec.record({
          lineOfCode: 31,
          description: `Rotated left at ${left.value}.`,
          variables: {},
          currentNode: node.left.id,
          tree: root,
        });
      }
      const rotated = rotateRight(node);
      rec.record({
        lineOfCode: 37,
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
          lineOfCode: 34,
          description: `${right.value} is left-heavy - rotate it right first (right-left case).`,
          variables: {},
          currentNode: right.id,
          rotation: { type: "right", pivotNodeId: right.left!.id },
          tree: root,
        });
        node.right = rotateRight(right);
        rec.record({
          lineOfCode: 34,
          description: `Rotated right at ${right.value}.`,
          variables: {},
          currentNode: node.right.id,
          tree: root,
        });
      }
      const rotated = rotateLeft(node);
      rec.record({
        lineOfCode: 40,
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

  for (const value of values) {
    if (root === null) {
      const created: TreeNode = { id: makeId(), value, left: null, right: null };
      root = created;
      rec.record({
        lineOfCode: 5,
        description: `Tree is empty - insert ${value} as the root.`,
        variables: { value },
        currentNode: created.id,
        tree: root,
      });
    } else {
      insert(root, value, (replacement) => {
        root = replacement;
      });
    }
  }

  rec.record({
    lineOfCode: 10,
    description:
      values.length > 0 ? `All ${values.length} values have been inserted.` : "Nothing to do.",
    variables: {},
    tree: root,
  });

  return rec.getSteps();
}
