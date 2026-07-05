/** Shared default input for all three search algorithms - sorted so
 * Binary Search and Jump Search (which both require sorted input) work
 * correctly out of the box, and shared with Linear Search too so all
 * three run head-to-head on identical data in Comparison Mode. */
export const SEARCH_SAMPLE_INPUT = [3, 7, 12, 18, 24, 31, 42, 56];

/** Fixed rather than user-editable for now - present in the default
 * sample input above (index 4). A custom or randomized array may not
 * contain it, which correctly plays out the "not found" path rather
 * than being treated as an error. */
export const SEARCH_TARGET = 24;
