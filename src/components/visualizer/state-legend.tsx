const ITEMS = [
  { label: "default", color: "var(--chart-1)" },
  { label: "comparing", color: "var(--chart-4)" },
  { label: "swapping", color: "var(--chart-2)" },
] as const;

export function StateLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
      {ITEMS.map(({ label, color }) => (
        <span key={label} className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          {label}
        </span>
      ))}
    </div>
  );
}
