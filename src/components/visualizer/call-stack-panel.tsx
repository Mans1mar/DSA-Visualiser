import type { CallStackFrame } from "@/types/step";

const FRAME_CLASS = "w-fit rounded-md bg-card px-3 py-1.5 font-mono text-xs shadow-sm";

type CallStackPanelProps = {
  callStack: CallStackFrame[];
  /** Deepest the stack ever gets across the whole run (computed by the
   * caller via computeMaxCallStackDepth), so the panel reserves that
   * much height up front instead of growing/shrinking with recursion. */
  maxDepth: number;
};

export function CallStackPanel({ callStack, maxDepth }: CallStackPanelProps) {
  if (maxDepth === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Call stack
      </h3>
      {/* col-reverse + padding placeholders *after* the real frames means
          the reserved (empty) slots sit at the top and real frames stay
          pinned to the bottom, growing upward as recursion deepens -
          panel height never changes. */}
      <div className="flex flex-col-reverse gap-1">
        {Array.from({ length: maxDepth }, (_, i) => {
          const frame = callStack[i];
          return frame ? (
            <div key={i} className={FRAME_CLASS}>
              {frame.fnName}({frame.args.map((arg) => JSON.stringify(arg)).join(", ")})
            </div>
          ) : (
            <div key={i} className={`${FRAME_CLASS} invisible`} aria-hidden="true">
              -
            </div>
          );
        })}
      </div>
    </div>
  );
}
