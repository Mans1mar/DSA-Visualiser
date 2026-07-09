import type { TreeNode } from "@/types/step";

export type PositionedTreeNode = {
  id: string;
  value: number;
  x: number;
  y: number;
  /** Height of the subtree rooted here - empty is 0, a leaf is 1 - same
   * convention AVL's own balance-factor math uses, so a badge computed
   * from this (left.subtreeHeight - right.subtreeHeight) always matches
   * the number the algorithm itself is reasoning about. Computed for
   * every tree (not just AVL's), since it's a byproduct of the layout
   * walk that already visits every node - callers just choose whether
   * to display it. */
  subtreeHeight: number;
  left: PositionedTreeNode | null;
  right: PositionedTreeNode | null;
};

export type TreeLayout = {
  root: PositionedTreeNode | null;
  /** Extent of node centers along each axis - 0 for a single node, not
   * the full drawable size. Callers add their own padding/node radius. */
  width: number;
  height: number;
};

const H_SPACING = 56;
const V_SPACING = 72;

/**
 * Positions nodes by inorder index (x) and depth (y). A BST's inorder
 * walk visits values strictly left-to-right, so consecutive inorder
 * positions can never belong to overlapping subtrees - this guarantees
 * zero overlap for any BST/AVL shape without a more general tree layout
 * algorithm (e.g. Reingold-Tilford), and keeps a node's left-right
 * position visually meaningful (smaller values sit to the left).
 */
export function layoutTree(root: TreeNode | null): TreeLayout {
  let counter = 0;
  let maxDepth = 0;

  function assign(node: TreeNode | null, depth: number): PositionedTreeNode | null {
    if (!node) return null;
    maxDepth = Math.max(maxDepth, depth);
    const left = assign(node.left, depth + 1);
    const x = counter * H_SPACING;
    counter += 1;
    const right = assign(node.right, depth + 1);
    const subtreeHeight = 1 + Math.max(left?.subtreeHeight ?? 0, right?.subtreeHeight ?? 0);
    return { id: node.id, value: node.value, x, y: depth * V_SPACING, subtreeHeight, left, right };
  }

  const positioned = assign(root, 0);
  return {
    root: positioned,
    width: counter > 0 ? (counter - 1) * H_SPACING : 0,
    height: positioned ? maxDepth * V_SPACING : 0,
  };
}

export type TreeEdge = { parent: PositionedTreeNode; child: PositionedTreeNode };

/** Flattens the positioned tree into a flat node list + parent-child
 * edge list - easier for the SVG renderer to map over than re-walking
 * the recursive structure itself. */
export function flattenTree(root: PositionedTreeNode | null): {
  nodes: PositionedTreeNode[];
  edges: TreeEdge[];
} {
  const nodes: PositionedTreeNode[] = [];
  const edges: TreeEdge[] = [];

  function walk(node: PositionedTreeNode | null) {
    if (!node) return;
    nodes.push(node);
    if (node.left) {
      edges.push({ parent: node, child: node.left });
      walk(node.left);
    }
    if (node.right) {
      edges.push({ parent: node, child: node.right });
      walk(node.right);
    }
  }

  walk(root);
  return { nodes, edges };
}
