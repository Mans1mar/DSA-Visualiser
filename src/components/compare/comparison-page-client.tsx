"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrayInputControls } from "@/components/algorithm-page/array-input-controls";
import { GraphInputControls } from "@/components/algorithm-page/graph-input-controls";
import { TargetInputControls } from "@/components/algorithm-page/target-input-controls";
import { PlaybackControls } from "@/components/visualizer/playback-controls";
import { useComparisonPlayback } from "@/hooks/use-comparison-playback";
import type { AlgorithmMeta } from "@/lib/algorithms/catalog";
import {
  getAlgorithm,
  getAllAlgorithms,
  runAlgorithmWithInput,
} from "@/lib/algorithms/catalog";
import type { Graph } from "@/lib/graph/types";
import { computeMaxPointerStack, computeMaxTreeExtent } from "@/lib/visualizer/layout-stability";
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
function useTimedRun(algorithm: AlgorithmMeta, input: number[] | Graph, target?: number) {
  const steps = useMemo(
    () => runAlgorithmWithInput(algorithm, input, target),
    [algorithm, input, target]
  );
  const [computeTimeMs, setComputeTimeMs] = useState(0);

  useEffect(() => {
    // setState nested inside the timeout callback (not called directly in
    // the effect body) - same pattern the playback hooks use for their
    // "stop at the end" transition, and for the same lint reason.
    const id = window.setTimeout(() => {
      const start = performance.now();
      runAlgorithmWithInput(algorithm, input, target);
      setComputeTimeMs(performance.now() - start);
    }, 0);
    return () => window.clearTimeout(id);
  }, [algorithm, input, target]);

  return { steps, computeTimeMs };
}

export function ComparisonPageClient() {
  const allAlgorithms = useMemo(() => getAllAlgorithms(), []);
  const [slugA, setSlugA] = useState(DEFAULT_SLUG_A);
  const [slugB, setSlugB] = useState(DEFAULT_SLUG_B);

  const algorithmA = getAlgorithm(slugA)!;

  // B is restricted to the same kind AND category as A - kind so they run
  // on the same shape of input, category because comparing across them
  // doesn't line up conceptually (Sorting has no target, Searching has no
  // "array is sorted" completion state). This is a pure derivation, not
  // state: if slugB stops matching (e.g. right after switching A to a
  // different kind/category), fall back to the first valid option for
  // *this* render without ever storing that fallback back into slugB -
  // so if A later returns to a kind/category where the original slugB is
  // valid again, it reappears on its own.
  const optionsB = allAlgorithms.filter(
    (a) => a.kind === algorithmA.kind && a.category === algorithmA.category && a.slug !== slugA
  );
  const effectiveSlugB = optionsB.some((a) => a.slug === slugB)
    ? slugB
    : (optionsB[0]?.slug ?? slugB);
  const algorithmB = getAlgorithm(effectiveSlugB)!;

  // Input is owned here, shared by both sides - the whole point of
  // comparing two algorithms is seeing them run on the *same* data (and,
  // for search algorithms, hunting for the *same* target) rather than
  // each on its own independent random input. Reset whenever A's kind
  // flips (array <-> graph) so a stale array/graph/target doesn't linger
  // for a kind it no longer applies to.
  const [customArray, setCustomArray] = useState<number[] | null>(null);
  const [customGraph, setCustomGraph] = useState<Graph | null>(null);
  const [customTarget, setCustomTarget] = useState<number | null>(null);
  const [prevKind, setPrevKind] = useState(algorithmA.kind);
  if (algorithmA.kind !== prevKind) {
    setPrevKind(algorithmA.kind);
    setCustomArray(null);
    setCustomGraph(null);
    setCustomTarget(null);
  }

  const activeArrayInput =
    algorithmA.kind === "array" ? (customArray ?? algorithmA.sampleInput) : null;
  const activeGraph = algorithmA.kind === "graph" ? (customGraph ?? algorithmA.graph) : null;
  // Tree's "values" (the insert sequence that builds the starting tree)
  // is the same number[] shape as an array algorithm's input, so it
  // reuses the same customArray state slot rather than a parallel one -
  // an algorithm is never both kinds at once, so there's no collision.
  const activeValues = algorithmA.kind === "tree" ? (customArray ?? algorithmA.sampleValues) : null;
  const activeInput =
    algorithmA.kind === "array"
      ? activeArrayInput!
      : algorithmA.kind === "tree"
        ? activeValues!
        : activeGraph!;
  // Checked on BOTH sides, not just A: within "Tree", Insert/Traversals
  // have no defaultTarget but Search/Delete do, so a pairing like AVL
  // Insert (A) vs AVL Delete (B) still needs the target control shown -
  // deriving this from A alone would silently hide it whenever A
  // happens to be the side that doesn't use one.
  const targetCapableA =
    algorithmA.kind === "array" || algorithmA.kind === "tree" ? algorithmA.defaultTarget : undefined;
  const targetCapableB =
    algorithmB.kind === "array" || algorithmB.kind === "tree" ? algorithmB.defaultTarget : undefined;
  const activeTarget =
    targetCapableA !== undefined || targetCapableB !== undefined
      ? (customTarget ?? targetCapableA ?? targetCapableB)
      : undefined;

  const { steps: stepsA, computeTimeMs: computeTimeMsA } = useTimedRun(
    algorithmA,
    activeInput,
    activeTarget
  );
  const { steps: stepsB, computeTimeMs: computeTimeMsB } = useTimedRun(
    algorithmB,
    activeInput,
    activeTarget
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

  // Same sharing reasoning as maxPointerRows, for Tree's canvas size -
  // both sides always run on the same tree shape here (shared input),
  // but reserving across both steps arrays keeps it consistent with how
  // every other shared-layout value in this file is computed.
  const reservedTree = useMemo(() => {
    if (algorithmA.kind !== "tree") return { width: 0, height: 0 };
    return computeMaxTreeExtent([...stepsA, ...stepsB]);
  }, [algorithmA.kind, stepsA, stepsB]);

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

      {/* One shared input control for both sides - conditionally array,
          tree, or graph shaped based on the selected kind. Different
          component types in this slot already remount cleanly on kind
          switches. Keyed by category too: Sorting and Searching are both
          "array" kind but ship different default sample data, so without
          a key here the text field would keep echoing a stale category's
          array after switching (the actual run already uses the right
          one - customArray/activeArrayInput were never wrong - only the
          displayed text was stale). Within the same category (e.g.
          Merge Sort -> Quick Sort) no remount happens, so a custom array
          the user typed still carries over. Tree reuses ArrayInputControls
          too - "values" (the insert sequence) is the same number[] shape,
          it just means something different downstream. */}
      {algorithmA.kind === "graph" ? (
        <GraphInputControls initialValue={activeGraph!} onChange={setCustomGraph} />
      ) : (
        <ArrayInputControls
          key={algorithmA.category}
          initialValue={activeArrayInput ?? activeValues!}
          onChange={setCustomArray}
        />
      )}
      {activeTarget !== undefined && (
        <TargetInputControls
          key={`${algorithmA.category}-target`}
          initialValue={activeTarget}
          arrayValues={activeArrayInput ?? activeValues ?? []}
          onChange={setCustomTarget}
        />
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
            reservedTreeWidth={reservedTree.width}
            reservedTreeHeight={reservedTree.height}
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
            reservedTreeWidth={reservedTree.width}
            reservedTreeHeight={reservedTree.height}
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
