import { cn } from "@/lib/utils";
import type { Step } from "@/types/step";

type ArrayBarsProps = {
  step: Step;
};

type Cell = { kind: "bar"; index: number } | { kind: "divider"; index: number };

function isInPair(pair: [number, number] | undefined, index: number) {
  return pair !== undefined && (pair[0] === index || pair[1] === index);
}

/** Interleaves divider slots between bars so both the bars row and the
 * pointer-label row below it can share one cell layout and stay aligned. */
function buildCells(length: number, dividers: number[] | undefined): Cell[] {
  const cells: Cell[] = [];
  for (let index = 0; index < length; index++) {
    cells.push({ kind: "bar", index });
    if (dividers?.includes(index) && index < length - 1) {
      cells.push({ kind: "divider", index });
    }
  }
  return cells;
}

function pointersByIndex(pointers: Record<string, number> | undefined, length: number) {
  const map = new Map<number, string[]>();
  if (!pointers) return map;
  for (const [name, index] of Object.entries(pointers)) {
    if (index < 0 || index >= length) continue;
    map.set(index, [...(map.get(index) ?? []), name]);
  }
  return map;
}

export function ArrayBars({ step }: ArrayBarsProps) {
  const array = step.dataStructureState?.array ?? [];
  const sortedIndices = step.dataStructureState?.sortedIndices;
  const max = Math.max(1, ...array);
  const cells = buildCells(array.length, step.dividers);
  const pointed = pointersByIndex(step.pointers, array.length);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-56 items-end gap-2 rounded-lg bg-muted/50 p-4">
        {cells.map((cell) => {
          if (cell.kind === "divider") {
            return (
              <div
                key={`divider-${cell.index}`}
                className="w-0 self-stretch border-l-2 border-dashed border-muted-foreground/40"
              />
            );
          }

          const { index } = cell;
          const value = array[index];
          const comparing = isInPair(step.comparing, index);
          const swapping = isInPair(step.swapping, index);
          const sorted = sortedIndices?.includes(index) ?? false;

          // swapping/comparing reflect what's happening *right now* and
          // take priority over sorted, a persistent, already-final state.
          const barClass = swapping
            ? "bar-swapping"
            : comparing
              ? "bar-comparing"
              : sorted
                ? "bar-sorted"
                : "bar-default";

          return (
            <div
              key={`bar-${index}`}
              className={cn(
                "flex flex-1 flex-col items-center justify-end rounded-t-md border-t-2 transition-all duration-300",
                barClass,
                pointed.has(index) && "bar-pointed"
              )}
              style={{ height: `${(value / max) * 100}%` }}
            >
              <span className="mb-1 text-xs text-muted-foreground">{value}</span>
            </div>
          );
        })}
      </div>

      {pointed.size > 0 && (
        <div className="flex gap-2 px-4">
          {cells.map((cell) =>
            cell.kind === "divider" ? (
              <div key={`divider-label-${cell.index}`} className="w-0" aria-hidden />
            ) : (
              <div
                key={`label-${cell.index}`}
                className="flex flex-1 flex-col items-center gap-1"
              >
                {(pointed.get(cell.index) ?? []).map((name) => (
                  <span key={name} className="pointer-tag">
                    {name}
                  </span>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
