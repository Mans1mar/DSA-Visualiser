import { useMemo } from "react";
import { ArrayBars } from "@/components/visualizer/array-bars";
import { GraphStateLegend } from "@/components/visualizer/graph-state-legend";
import { GraphView } from "@/components/visualizer/graph-view";
import { StateLegend } from "@/components/visualizer/state-legend";
import { TreeStateLegend, treeLegendVariant } from "@/components/visualizer/tree-state-legend";
import { TreeView } from "@/components/visualizer/tree-view";
import type { AlgorithmMeta } from "@/lib/algorithms/catalog";
import type { Graph } from "@/lib/graph/types";
import { computeRunningStats } from "@/lib/visualizer/comparison-stats";
import type { Step } from "@/types/step";
import { StatsPanel } from "./stats-panel";

/**
 * Split from a single ComparisonSide into an info half (name, visual,
 * legend, description) and a stats half so the caller can lay the two
 * halves out independently - on a phone screen it shows both sides'
 * info together, then both sides' stats together, rather than repeating
 * info/stats/info/stats down the page.
 */
type ComparisonSideInfoProps = {
  algorithm: AlgorithmMeta;
  /** The graph actually run (custom/random or the algorithm's own
   * default) - not derived from algorithm.graph, since that's always
   * the catalog default and wouldn't reflect a shared custom graph. */
  graph: Graph | null;
  currentStep: Step;
  currentIndex: number;
  totalSteps: number;
  /** Shared across both sides by the caller (max of each side's own
   * need), not computed per side - otherwise Merge Sort and Quick Sort
   * would each reserve a different amount of pointer-row space and
   * everything below the bars would end up at different heights. */
  maxPointerRows: number;
  /** Tree-only, same sharing reasoning as maxPointerRows - computed by
   * the caller via computeMaxTreeExtent across both sides' steps so an
   * Insert (which grows) and a Traversal (fixed size) reserve the same
   * canvas instead of resizing independently. */
  reservedTreeWidth?: number;
  reservedTreeHeight?: number;
};

export function ComparisonSideInfo({
  algorithm,
  graph,
  currentStep,
  currentIndex,
  totalSteps,
  maxPointerRows,
  reservedTreeWidth,
  reservedTreeHeight,
}: ComparisonSideInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold">{algorithm.name}</h3>

      {algorithm.kind === "array" ? (
        <ArrayBars step={currentStep} maxPointerRows={maxPointerRows} />
      ) : algorithm.kind === "tree" ? (
        <TreeView
          step={currentStep}
          reservedWidth={reservedTreeWidth}
          reservedHeight={reservedTreeHeight}
        />
      ) : (
        <GraphView graph={graph!} step={currentStep} />
      )}
      {algorithm.kind === "array" ? (
        <StateLegend variant={algorithm.category === "Searching" ? "searching" : "sorting"} />
      ) : algorithm.kind === "tree" ? (
        <TreeStateLegend variant={treeLegendVariant(algorithm.slug)} />
      ) : (
        <GraphStateLegend />
      )}

      <div className="space-y-1">
        <p className="h-[60px] text-sm leading-5 text-foreground">
          {currentStep.description}
        </p>
        <p className="text-xs text-muted-foreground">
          Step {currentIndex + 1} of {totalSteps} · line {currentStep.lineOfCode}
        </p>
      </div>
    </div>
  );
}

type ComparisonSideStatsProps = {
  algorithm: AlgorithmMeta;
  steps: Step[];
  currentIndex: number;
  computeTimeMs: number;
};

export function ComparisonSideStats({
  algorithm,
  steps,
  currentIndex,
  computeTimeMs,
}: ComparisonSideStatsProps) {
  const stats = useMemo(
    () => computeRunningStats(steps, currentIndex),
    [steps, currentIndex]
  );

  return <StatsPanel stats={stats} computeTimeMs={computeTimeMs} algorithm={algorithm} />;
}
