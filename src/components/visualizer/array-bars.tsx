import { cn } from "@/lib/utils";
import type { Step } from "@/types/step";

type ArrayBarsProps = {
  step: Step;
  /** Reserves height for this many stacked pointer tags on every index,
   * even when the current step needs fewer (or none) - computed once by
   * the caller from the whole run via computeMaxPointerStack, so the
   * pointer row's height never changes step to step. */
  maxPointerRows: number;
};

type Cell =
  | { kind: "bar"; index: number }
  | { kind: "divider"; index: number; depth: number };

// Depth 0 (the outermost, longest-running split) draws at full height;
// each level nested inside it draws a bit shorter, down to a floor so
// even deep recursion (Quick Sort's worst case can nest many levels
// deeper than Merge Sort ever does) stays visible instead of shrinking
// away to nothing.
const DIVIDER_BASE_HEIGHT = 100;
const DIVIDER_HEIGHT_STEP = 15;
const DIVIDER_MIN_HEIGHT = 40;

function dividerHeightPercent(depth: number): number {
  return Math.max(DIVIDER_MIN_HEIGHT, DIVIDER_BASE_HEIGHT - depth * DIVIDER_HEIGHT_STEP);
}

function isInPair(pair: [number, number] | undefined, index: number) {
  return pair !== undefined && (pair[0] === index || pair[1] === index);
}

/** Interleaves divider slots between bars so both the bars row and the
 * pointer-label row below it can share one cell layout and stay aligned. */
function buildCells(length: number, dividers: Map<number, number>): Cell[] {
  const cells: Cell[] = [];
  for (let index = 0; index < length; index++) {
    cells.push({ kind: "bar", index });
    const depth = dividers.get(index);
    if (depth !== undefined && index < length - 1) {
      cells.push({ kind: "divider", index, depth });
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

export function ArrayBars({ step, maxPointerRows }: ArrayBarsProps) {
  const array = step.dataStructureState?.array ?? [];
  const sortedIndices = step.dataStructureState?.sortedIndices;
  const foundIndex = step.dataStructureState?.foundIndex;
  const activeRange = step.activeRange;
  const max = Math.max(1, ...array);
  const dividerDepths = new Map((step.dividers ?? []).map((d) => [d.index, d.depth]));
  const cells = buildCells(array.length, dividerDepths);
  const pointed = pointersByIndex(step.pointers, array.length);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-56 items-end gap-2 rounded-lg bg-muted/50 p-4">
        {cells.map((cell) => {
          if (cell.kind === "divider") {
            // No self-stretch: the row's default items-end alignment
            // anchors the line to the same baseline the bars grow from,
            // so a shorter (deeper-nested) line's gap opens up at the
            // top rather than the bottom.
            return (
              <div
                key={`divider-${cell.index}`}
                className="w-0 border-l-2 border-dashed border-muted-foreground/40"
                style={{ height: `${dividerHeightPercent(cell.depth)}%` }}
              />
            );
          }

          const { index } = cell;
          const value = array[index];
          const comparing = isInPair(step.comparing, index);
          const swapping = isInPair(step.swapping, index);
          const sorted = sortedIndices?.includes(index) ?? false;
          const found = foundIndex === index;
          const dimmed =
            activeRange !== undefined && (index < activeRange[0] || index > activeRange[1]);

          // swapping reflects what's happening *right now* and takes
          // priority over everything. found/sorted are persistent,
          // already-final states that take priority over comparing -
          // Binary/Jump Search's own final step sets both `comparing`
          // (highlighting the index just checked) and `found` (the
          // target lives there) at once, and the answer should read as
          // settled, not still mid-comparison. dimmed is the weakest
          // signal, since a ruled-out range never overlaps found/sorted
          // anyway but still shouldn't outrank an active comparison.
          const barClass = swapping
            ? "bar-swapping"
            : found
              ? "bar-found"
              : sorted
                ? "bar-sorted"
                : comparing
                  ? "bar-comparing"
                  : dimmed
                    ? "bar-dimmed"
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

      {maxPointerRows > 0 && (
        <div className="flex gap-2 px-4">
          {cells.map((cell) =>
            cell.kind === "divider" ? (
              <div key={`divider-label-${cell.index}`} className="w-0" aria-hidden />
            ) : (
              <div
                key={`label-${cell.index}`}
                className="flex flex-1 flex-col items-center gap-1"
              >
                {Array.from({ length: maxPointerRows }, (_, slot) => {
                  const name = (pointed.get(cell.index) ?? [])[slot];
                  return name ? (
                    <span key={slot} className="pointer-tag">
                      {name}
                    </span>
                  ) : (
                    <span key={slot} className="pointer-tag invisible" aria-hidden="true">
                      -
                    </span>
                  );
                })}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
