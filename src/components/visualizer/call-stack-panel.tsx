import type { CallStackFrame } from "@/types/step";

export function CallStackPanel({ callStack }: { callStack: CallStackFrame[] }) {
  if (callStack.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Call stack
      </h3>
      <div className="flex flex-col-reverse gap-1">
        {callStack.map((frame, i) => (
          <div
            key={i}
            className="w-fit rounded-md bg-card px-3 py-1.5 font-mono text-xs shadow-sm"
          >
            {frame.fnName}({frame.args.map((arg) => JSON.stringify(arg)).join(", ")})
          </div>
        ))}
      </div>
    </div>
  );
}
