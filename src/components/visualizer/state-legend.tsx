const SORTING_FILL_ITEMS = [
  { label: "default", color: "var(--chart-1)" },
  { label: "comparing", color: "var(--chart-4)" },
  { label: "swapping", color: "var(--chart-2)" },
  { label: "sorted", color: "var(--chart-3)" },
] as const;

// Search algorithms never swap array elements, and "sorted" doesn't
// apply to them - they narrow toward a single found index instead.
const SEARCHING_FILL_ITEMS = [
  { label: "default", color: "var(--chart-1)" },
  { label: "comparing", color: "var(--chart-4)" },
  { label: "found", color: "var(--chart-3)" },
] as const;

export function StateLegend({
  variant = "sorting",
}: {
  variant?: "sorting" | "searching";
}) {
  const fillItems = variant === "searching" ? SEARCHING_FILL_ITEMS : SORTING_FILL_ITEMS;

  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
      {fillItems.map(({ label, color }) => (
        <span key={label} className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          {label}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <span
          className="size-2.5 rounded-full bg-transparent"
          style={{ boxShadow: "inset 0 0 0 2px var(--chart-5)" }}
        />
        pointer (lo, i, pivot, ...)
      </span>
      {variant === "sorting" ? (
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-0 border-l-2 border-dashed border-muted-foreground/40" />
          split
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <span className="bar-dimmed size-2.5 rounded-full border" />
          eliminated
        </span>
      )}
    </div>
  );
}
