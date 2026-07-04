import { useMemo } from "react";
import { ArrayBars } from "@/components/visualizer/array-bars";
import { GraphStateLegend } from "@/components/visualizer/graph-state-legend";
import { GraphView } from "@/components/visualizer/graph-view";
import { StateLegend } from "@/components/visualizer/state-legend";
import type { AlgorithmMeta } from "@/lib/algorithms/catalog";
import { computeRunningStats } from "@/lib/visualizer/comparison-stats";
import type { Step } from "@/types/step";
import { StatsPanel } from "./stats-panel";

type ComparisonSideProps = {
  algorithm: AlgorithmMeta;
  steps: Step[];
  currentStep: Step;
  currentIndex: number;
  totalSteps: number;
  computeTimeMs: number;
  /** Shared across both sides by the caller (max of each side's own
   * need), not computed per side - otherwise Merge Sort and Quick Sort
   * would each reserve a different amount of pointer-row space and
   * everything below the bars would end up at different heights. */
  maxPointerRows: number;
};

export function ComparisonSide({
  algorithm,
  steps,
  currentStep,
  currentIndex,
  totalSteps,
  computeTimeMs,
  maxPointerRows,
}: ComparisonSideProps) {
  const stats = useMemo(
    () => computeRunningStats(steps, currentIndex),
    [steps, currentIndex]
  );

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold">{algorithm.name}</h3>

      {algorithm.kind === "array" ? (
        <ArrayBars step={currentStep} maxPointerRows={maxPointerRows} />
      ) : (
        <GraphView graph={algorithm.graph} step={currentStep} />
      )}
      {algorithm.kind === "array" ? <StateLegend /> : <GraphStateLegend />}

      <div className="space-y-1">
        <p className="h-[60px] text-sm leading-5 text-foreground">
          {currentStep.description}
        </p>
        <p className="text-xs text-muted-foreground">
          Step {currentIndex + 1} of {totalSteps} · line {currentStep.lineOfCode}
        </p>
      </div>

      <StatsPanel stats={stats} computeTimeMs={computeTimeMs} algorithm={algorithm} />
    </div>
  );
}
