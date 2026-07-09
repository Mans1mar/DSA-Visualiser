import type { TreeNode } from "@/types/step";
import { bstInsert } from "./bst-insert";

/** Shared starting tree for Search/Delete/Traversals - built from the
 * same insert sequence BST Insert itself demonstrates, so switching
 * between Tree algorithms on the same sample data shows a consistent
 * shape. */
export const TREE_SAMPLE_VALUES = [8, 3, 10, 1, 6, 14, 4, 7, 13];

/** Present in TREE_SAMPLE_VALUES - demonstrates the "found" path by
 * default, the same reasoning as SEARCH_TARGET for array search. */
export const TREE_SEARCH_TARGET = 7;

/** Node 3 in TREE_SAMPLE_VALUES has two children (1 and 6) - the most
 * interesting deletion case (inorder successor splice), so it's the
 * default rather than a leaf or single-child node. */
export const TREE_DELETE_TARGET = 3;

/** Silently builds the starting tree that Search/Delete/Traversals
 * operate on. Reuses bstInsert's own (tested) insertion logic rather
 * than a second implementation, just discards its steps and keeps the
 * final tree - values never has duplicates removed inconsistently
 * between the two, since it's the exact same insert() rules. */
export function buildBst(values: number[]): TreeNode | null {
  const steps = bstInsert(values);
  return steps[steps.length - 1]?.dataStructureState?.tree ?? null;
}
