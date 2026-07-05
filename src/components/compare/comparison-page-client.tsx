"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrayInputControls } from "@/components/algorithm-page/array-input-controls";
import { GraphInputControls } from "@/components/algorithm-page/graph-input-controls";
import { PlaybackControls } from "@/components/visualizer/playback-controls";
import { useComparisonPlayback } from "@/hooks/use-comparison-playback";
import type { AlgorithmMeta } from "@/lib/algorithms/catalog";
import {
  getAlgorithm,
  getAllAlgorithms,
  runAlgorithmWithInput,
} from "@/lib/algorithms/catalog";
import type { Graph } from "@/lib/graph/types";
import { computeMaxPointerStack } from "@/lib/visualizer/layout-stability";
import { AlgorithmSelect } from "./algorithm-select";
import { ComparisonSideInfo, ComparisonSideStats } from "./comparison-side";

const DEFAULT_SLUG_A = "merge-sort";
const DEFAULT_SLUG_B = "quick-sort";

/**
 * Steps come from a plain useMemo (pure, safe to call speculatively).
 * computeTimeMs is measured separately in an effect - performance.now()
 * is an impure read, so it can't live inside the memo itself; the
 * (cheap, sub-millisecond) computation just runs a second time there
 * purely to time it.
 */
function useTimedRun(algorithm: AlgorithmMeta, input: number[] | Graph) {
  const steps = useMemo(
    () => runAlgorithmWithInput(algorithm, input),
    [algorithm, input]
  );
  const [computeTimeMs, setComputeTimeMs] = useState(0);

  useEffect(() => {
    // setState nested inside the timeout callback (not called directly in
    // the effect body) - same pattern the playback hooks use for their
    // "stop at the end" transition, and for the same lint reason.
    const id = window.setTimeout(() => {
      const start = performance.now();
      runAlgorithmWithInput(algorithm, input);
      setComputeTimeMs(performance.now() - start);
    }, 0);
    return () => window.clearTimeout(id);
  }, [algorithm, input]);

  return { steps, computeTimeMs };
}

export function ComparisonPageClient() {
  const allAlgorithms = useMemo(() => getAllAlgorithms(), []);
  const [slugA, setSlugA] = useState(DEFAULT_SLUG_A);
  const [slugB, setSlugB] = useState(DEFAULT_SLUG_B);

  const algorithmA = getAlgorithm(slugA)!;

  // B is restricted to the same kind as A (array vs graph) - they need to
  // run on the same shape of input to be a meaningful comparison. This is
  // a pure derivation, not state: if slugB stops matching (e.g. right
  // after switching A to a different kind), fall back to the first valid
  // option for *this* render without ever storing that fallback back
  // into slugB - so if A later returns to a kind where the original
  // slugB is valid again, it reappears on its own.
  const optionsB = allAlgorithms.filter(
    (a) => a.kind === algorithmA.kind && a.slug !== slugA
  );
  const effectiveSlugB = optionsB.some((a) => a.slug === slugB)
    ? slugB
    : (optionsB[0]?.slug ?? slugB);
  const algorithmB = getAlgorithm(effectiveSlugB)!;

  // Input is owned here, shared by both sides - the whole point of
  // comparing two algorithms is seeing them run on the *same* data, not
  // each on its own independent random input. Reset whenever A's kind
  // flips (array <-> graph) so a stale array/graph doesn't linger for a
  // kind it no longer applies to.
  const [customArray, setCustomArray] = useState<number[] | null>(null);
  const [customGraph, setCustomGraph] = useState<Graph | null>(null);
  const [prevKind, setPrevKind] = useState(algorithmA.kind);
  if (algorithmA.kind !== prevKind) {
    setPrevKind(algorithmA.kind);
    setCustomArray(null);
    setCustomGraph(null);
  }

  const activeArrayInput =
    algorithmA.kind === "array" ? (customArray ?? algorithmA.sampleInput) : null;
  const activeGraph = algorithmA.kind === "graph" ? (customGraph ?? algorithmA.graph) : null;
  const activeInput = algorithmA.kind === "array" ? activeArrayInput! : activeGraph!;

  const { steps: stepsA, computeTimeMs: computeTimeMsA } = useTimedRun(
    algorithmA,
    activeInput
  );
  const { steps: stepsB, computeTimeMs: computeTimeMsB } = useTimedRun(
    algorithmB,
    activeInput
  );

  const playback = useComparisonPlayback(stepsA, stepsB);

  // Shared by both sides rather than computed per side - otherwise two
  // array algorithms with different worst-case pointer stacking (e.g.
  // Merge Sort's i/j/k vs Quick Sort's lo/hi/pivot) would reserve
  // different pointer-row heights and everything below the bars
  // (legend, description, stats) would land at different Y coordinates
  // between the two columns.
  const maxPointerRows = useMemo(() => {
    const arrayLengthA = stepsA[0]?.dataStructureState?.array?.length ?? 0;
    const arrayLengthB = stepsB[0]?.dataStructureState?.array?.length ?? 0;
    const a =
      algorithmA.kind === "array" ? computeMaxPointerStack(stepsA, arrayLengthA) : 0;
    const b =
      algorithmB.kind === "array" ? computeMaxPointerStack(stepsB, arrayLengthB) : 0;
    return Math.max(a, b);
  }, [algorithmA.kind, algorithmB.kind, stepsA, stepsB]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <AlgorithmSelect
          label="Algorithm A"
          value={slugA}
          onChange={setSlugA}
          options={allAlgorithms.map((a) => ({ slug: a.slug, name: a.name }))}
        />
        <span className="text-sm text-muted-foreground">vs</span>
        <AlgorithmSelect
          label="Algorithm B"
          value={effectiveSlugB}
          onChange={setSlugB}
          options={optionsB.map((a) => ({ slug: a.slug, name: a.name }))}
        />
      </div>

      {/* One shared input control for both sides - conditionally array or
          graph shaped based on the selected kind. Different component
          types in this slot already remount cleanly on kind switches. */}
      {algorithmA.kind === "array" ? (
        <ArrayInputControls initialValue={activeArrayInput!} onChange={setCustomArray} />
      ) : (
        <GraphInputControls initialValue={activeGraph!} onChange={setCustomGraph} />
      )}

      <PlaybackControls
        isPlaying={playback.isPlaying}
        isAtStart={playback.isAtStart}
        isAtEnd={playback.isAtEnd}
        speed={playback.speed}
        onToggle={playback.toggle}
        onNext={playback.next}
        onPrev={playback.prev}
        onReset={playback.reset}
        onSpeedChange={playback.setSpeed}
      />

      {/*
        grid-cols-1 matters even below lg - see visualization-tab.tsx.

        DOM order is info-A, info-B, stats-A, stats-B. On a single-column
        phone layout that's exactly the stacking order: both visuals (plus
        legend/description) together first, then both stats panels
        together after - instead of repeating info/stats/info/stats, which
        forces scrolling back and forth to compare the two. At lg, explicit
        grid placement pins each side back into its own two-row column so
        the side-by-side comparison layout is unchanged there.
      */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-10">
        <div className="lg:col-start-1 lg:row-start-1">
          <ComparisonSideInfo
            algorithm={algorithmA}
            graph={activeGraph}
            currentStep={playback.currentStepA}
            currentIndex={playback.indexA}
            totalSteps={stepsA.length}
            maxPointerRows={maxPointerRows}
          />
        </div>
        <div className="lg:col-start-2 lg:row-start-1">
          <ComparisonSideInfo
            algorithm={algorithmB}
            graph={activeGraph}
            currentStep={playback.currentStepB}
            currentIndex={playback.indexB}
            totalSteps={stepsB.length}
            maxPointerRows={maxPointerRows}
          />
        </div>
        <div className="lg:col-start-1 lg:row-start-2">
          <ComparisonSideStats
            algorithm={algorithmA}
            steps={stepsA}
            currentIndex={playback.indexA}
            computeTimeMs={computeTimeMsA}
          />
        </div>
        <div className="lg:col-start-2 lg:row-start-2">
          <ComparisonSideStats
            algorithm={algorithmB}
            steps={stepsB}
            currentIndex={playback.indexB}
            computeTimeMs={computeTimeMsB}
          />
        </div>
      </div>
    </div>
  );
}
