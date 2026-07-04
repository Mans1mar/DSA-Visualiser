const FILL_ITEMS = [
  { label: "default", color: "var(--chart-1)" },
  { label: "comparing", color: "var(--chart-4)" },
  { label: "swapping", color: "var(--chart-2)" },
  { label: "sorted", color: "var(--chart-3)" },
] as const;

export function StateLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
      {FILL_ITEMS.map(({ label, color }) => (
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
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-0 border-l-2 border-dashed border-muted-foreground/40" />
        split
      </span>
    </div>
  );
}
