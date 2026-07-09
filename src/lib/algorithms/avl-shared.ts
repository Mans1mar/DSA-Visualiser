import type { TreeNode } from "@/types/step";
import { avlInsert } from "./avl-insert";

/** Crafted (not random) to demonstrate two different rotation cases in
 * one short run: inserting 10, 20, 30 triggers a right-right rotation
 * at 10 (it becomes a straight chain otherwise), and later inserting 1
 * triggers a left-left rotation - without ever needing a left-right or
 * right-left double rotation to still show real rebalancing. */
export const AVL_SAMPLE_VALUES = [10, 20, 30, 25, 5, 1, 15];

/** Present in AVL_SAMPLE_VALUES and has two children after all seven
 * inserts - the same "interesting case" reasoning as TREE_DELETE_TARGET. */
export const AVL_DELETE_TARGET = 5;

/** Silently builds the starting AVL tree that Delete operates on.
 * Reuses avlInsert's own (tested) insert-with-rebalancing logic rather
 * than a second implementation - just discards its steps and keeps the
 * final tree, the same pattern as buildBst for the plain BST family. */
export function buildAvl(values: number[]): TreeNode | null {
  const steps = avlInsert(values);
  return steps[steps.length - 1]?.dataStructureState?.tree ?? null;
}
