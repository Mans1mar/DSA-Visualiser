const NODE_ITEMS = [
  { label: "default", color: "var(--chart-1)" },
  { label: "frontier", color: "var(--chart-4)" },
  { label: "current", color: "var(--chart-2)" },
  { label: "visited", color: "var(--chart-3)" },
] as const;

export function GraphStateLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
      {NODE_ITEMS.map(({ label, color }) => (
        <span key={label} className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full border-2 bg-transparent"
            style={{ borderColor: color }}
          />
          {label}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <span className="h-0.5 w-3" style={{ backgroundColor: "var(--chart-3)" }} />
        tree edge
      </span>
    </div>
  );
}
