type LinearStatePanelProps = {
  label: string;
  items: unknown[];
};

/** Generic chip-row renderer for queue/stack/priority-queue arrays -
 * whichever one an algorithm populates in dataStructureState. */
export function LinearStatePanel({ label, items }: LinearStatePanelProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="rounded-md bg-card px-2.5 py-1 font-mono text-xs shadow-sm"
          >
            {String(item)}
          </span>
        ))}
      </div>
    </div>
  );
}
