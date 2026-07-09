import { TreeStepRecorder } from "@/lib/tree/tree-step-recorder";
import type { Step, TreeNode } from "@/types/step";
import type { LanguageSources } from "./languages";

// Line-for-line across all three languages (and BST_INSERT_PSEUDOCODE
// below) - every lineOfCode the algorithm emits refers to the same line
// number in all of them, so switching languages never breaks highlighting.
export const BST_INSERT_SOURCES: LanguageSources = {
  java: [
    "static Node insertAll(List<Integer> values) {",
    "  Node tree = null;",
    "  for (int value : values) {",
    "    if (tree == null) {",
    "      tree = new Node(value);",
    "    } else {",
    "      insert(tree, value);",
    "    }",
    "  }",
    "  return tree;",
    "}",
    "",
    "static void insert(Node node, int value) {",
    "  if (value == node.value) {",
    "    return; // duplicate - no change",
    "  } else if (value < node.value) {",
    "    if (node.left == null) {",
    "      node.left = new Node(value);",
    "    } else {",
    "      insert(node.left, value);",
    "    }",
    "  } else if (value > node.value) {",
    "    if (node.right == null) {",
    "      node.right = new Node(value);",
    "    } else {",
    "      insert(node.right, value);",
    "    }",
    "  }",
    "}",
  ],
  cpp: [
    "Node* insertAll(vector<int>& values) {",
    "  Node* tree = nullptr;",
    "  for (int value : values) {",
    "    if (tree == nullptr) {",
    "      tree = new Node(value);",
    "    } else {",
    "      insert(tree, value);",
    "    }",
    "  }",
    "  return tree;",
    "}",
    "",
    "void insert(Node* node, int value) {",
    "  if (value == node->value) {",
    "    return; // duplicate - no change",
    "  } else if (value < node->value) {",
    "    if (node->left == nullptr) {",
    "      node->left = new Node(value);",
    "    } else {",
    "      insert(node->left, value);",
    "    }",
    "  } else if (value > node->value) {",
    "    if (node->right == nullptr) {",
    "      node->right = new Node(value);",
    "    } else {",
    "      insert(node->right, value);",
    "    }",
    "  }",
    "}",
  ],
  python: [
    "def insert_all(values):",
    "    tree = None",
    "    for value in values:",
    "        if tree is None:",
    "            tree = Node(value)",
    "        else:",
    "            insert(tree, value)",
    "        # end if",
    "    # end for",
    "    return tree",
    "    # end insert_all",
    "",
    "def insert(node, value):",
    "    if value == node.value:",
    "        return  # duplicate - no change",
    "    elif value < node.value:",
    "        if node.left is None:",
    "            node.left = Node(value)",
    "        else:",
    "            insert(node.left, value)",
    "        # end if",
    "    elif value > node.value:",
    "        if node.right is None:",
    "            node.right = Node(value)",
    "        else:",
    "            insert(node.right, value)",
    "        # end if",
    "    # end if",
    "    # end insert",
  ],
};

// Line-for-line pseudocode counterpart to BST_INSERT_SOURCES.
export const BST_INSERT_PSEUDOCODE = [
  "function insertAll(values)",
  "    tree = empty",
  "    for each value in values",
  "        if tree is empty",
  "            tree = new Node(value)",
  "        else",
  "            insert(tree, value)",
  "        end if",
  "    end for",
  "    return tree",
  "end function",
  "",
  "function insert(node, value)",
  "    if value == node.value",
  "        return   // duplicate - no change",
  "    else if value < node.value",
  "        if node.left is empty",
  "            node.left = new Node(value)",
  "        else",
  "            insert(node.left, value)",
  "        end if",
  "    else if value > node.value",
  "        if node.right is empty",
  "            node.right = new Node(value)",
  "        else",
  "            insert(node.right, value)",
  "        end if",
  "    end if",
  "end function",
];

/**
 * Inserts values one at a time into an initially empty BST, recording
 * each node comparison along the walk down. Mutates real Node objects
 * in place (`node.left = new Node(value)`) rather than the immutable
 * path-copying a persistent tree would use - the natural, textbook way
 * to write this - because TreeStepRecorder deep-clones the tree at
 * every record() call, so earlier steps' snapshots are never affected
 * by a later mutation regardless of how the live tree is built.
 * Duplicate values are silently ignored, same as a textbook BST.
 */
export function bstInsert(values: number[]): Step[] {
  let nextId = 0;
  const makeId = () => `n${nextId++}`;
  const rec = new TreeStepRecorder();
  let root: TreeNode | null = null;

  rec.record({
    lineOfCode: 2,
    description:
      values.length > 0
        ? `Insert ${values.length} value${values.length === 1 ? "" : "s"} one at a time into an initially empty tree: ${values.join(", ")}.`
        : "No values to insert - the tree stays empty.",
    variables: { values },
    tree: root,
  });

  function insert(node: TreeNode, value: number) {
    rec.pushCall({ fnName: "insert", args: [value] });

    if (value === node.value) {
      rec.record({
        lineOfCode: 14,
        description: `${value} already exists at this node - a BST has no duplicates, nothing changes.`,
        variables: { value, current: node.value },
        currentNode: node.id,
        comparisonResult: "found",
        comparisonMade: true,
        tree: root,
      });
    } else if (value < node.value) {
      rec.record({
        lineOfCode: 16,
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
          lineOfCode: 18,
          description: `Nothing to the left of ${node.value} - insert ${value} here.`,
          variables: { value },
          currentNode: created.id,
          tree: root,
        });
      } else {
        insert(node.left, value);
      }
    } else {
      rec.record({
        lineOfCode: 22,
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
          lineOfCode: 24,
          description: `Nothing to the right of ${node.value} - insert ${value} here.`,
          variables: { value },
          currentNode: created.id,
          tree: root,
        });
      } else {
        insert(node.right, value);
      }
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
      insert(root, value);
    }
  }

  rec.record({
    lineOfCode: 11,
    description:
      values.length > 0 ? `All ${values.length} values have been inserted.` : "Nothing to do.",
    variables: {},
    tree: root,
  });

  return rec.getSteps();
}
