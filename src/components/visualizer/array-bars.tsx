import { cn } from "@/lib/utils";
import type { Step } from "@/types/step";

type ArrayBarsProps = {
  step: Step;
};

function isInPair(pair: [number, number] | undefined, index: number) {
  return pair !== undefined && (pair[0] === index || pair[1] === index);
}

export function ArrayBars({ step }: ArrayBarsProps) {
  const array = step.dataStructureState?.array ?? [];
  const max = Math.max(1, ...array);

  return (
    <div className="flex h-56 items-end gap-2 rounded-lg bg-muted/50 p-4">
      {array.map((value, index) => {
        const comparing = isInPair(step.comparing, index);
        const swapping = isInPair(step.swapping, index);

        return (
          <div
            key={index}
            className={cn(
              "flex flex-1 flex-col items-center justify-end rounded-t-md border-t-2 transition-all duration-300",
              swapping ? "bar-swapping" : comparing ? "bar-comparing" : "bar-default"
            )}
            style={{ height: `${(value / max) * 100}%` }}
          >
            <span className="mb-1 text-xs text-muted-foreground">{value}</span>
          </div>
        );
      })}
    </div>
  );
}
