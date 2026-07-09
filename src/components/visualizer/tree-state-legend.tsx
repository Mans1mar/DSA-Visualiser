const BASE_ITEMS = [
  { label: "default", color: "var(--chart-1)" },
  { label: "current", color: "var(--chart-2)" },
] as const;

/** Legend variant for a Tree algorithm, keyed by slug since all seven
 * share category "Tree" but only Search accumulates a "found" node and
 * only the four traversals accumulate a "visited" path - used by both
 * the single algorithm page and Comparison Mode. */
export function treeLegendVariant(slug: string): "default" | "search" | "traversal" {
  if (slug === "bst-search") return "search";
  if (["bst-inorder", "bst-preorder", "bst-postorder", "bst-levelorder"].includes(slug)) {
    return "traversal";
  }
  return "default";
}

/**
 * Tree node states. Unlike StateLegend/GraphStateLegend, "visited" and
 * "found" never both apply to the same algorithm here - Traversals mark
 * every node visited (in order) but never single one out as "found";
 * Search marks exactly one node found but never accumulates a visited
 * set. Insert and Delete use neither (just default/current), so the
 * variant only ever adds at most one extra entry.
 */
export function TreeStateLegend({
  variant = "default",
}: {
  variant?: "default" | "search" | "traversal";
}) {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
      {BASE_ITEMS.map(({ label, color }) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border-2 bg-transparent" style={{ borderColor: color }} />
          {label}
        </span>
      ))}
      {variant === "search" && (
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full border-2 bg-transparent"
            style={{ borderColor: "var(--chart-3)" }}
          />
          found
        </span>
      )}
      {variant === "traversal" && (
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full border-2 bg-transparent"
            style={{ borderColor: "var(--chart-3)" }}
          />
          visited
        </span>
      )}
    </div>
  );
}
