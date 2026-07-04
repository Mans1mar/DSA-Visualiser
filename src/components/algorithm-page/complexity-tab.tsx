import type { AlgorithmMeta } from "@/lib/algorithms/catalog";
import { ComplexityCard } from "./complexity-card";

export function ComplexityTab({ algorithm }: { algorithm: AlgorithmMeta }) {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <section>
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Time complexity
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <ComplexityCard label="Best" value={algorithm.timeComplexity.best} />
          <ComplexityCard label="Average" value={algorithm.timeComplexity.average} />
          <ComplexityCard label="Worst" value={algorithm.timeComplexity.worst} />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Space complexity
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <ComplexityCard label="Auxiliary space" value={algorithm.spaceComplexity} />
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          How it compares
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {algorithm.complexityComparison}
        </p>
      </section>
    </div>
  );
}
