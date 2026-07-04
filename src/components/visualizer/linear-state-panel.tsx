const CHIP_CLASS = "rounded-md bg-card px-2.5 py-1 font-mono text-xs shadow-sm";

type LinearStatePanelProps = {
  label: string;
  items: unknown[];
  /** Longest this list ever gets across the whole run (computed by the
   * caller via computeMaxLinearItems), so the panel reserves that many
   * chip slots up front instead of growing/shrinking step to step. */
  maxItems: number;
};

/** Generic chip-row renderer for queue/stack/priority-queue arrays -
 * whichever one an algorithm populates in dataStructureState. */
export function LinearStatePanel({ label, items, maxItems }: LinearStatePanelProps) {
  if (maxItems === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: maxItems }, (_, i) => {
          const item = items[i];
          return item !== undefined ? (
            <span key={i} className={CHIP_CLASS}>
              {String(item)}
            </span>
          ) : (
            <span key={i} className={`${CHIP_CLASS} invisible`} aria-hidden="true">
              -
            </span>
          );
        })}
      </div>
    </div>
  );
}
