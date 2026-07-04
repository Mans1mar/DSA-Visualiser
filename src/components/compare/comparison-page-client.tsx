"use client";

import { useEffect, useMemo, useState } from "react";
import { PlaybackControls } from "@/components/visualizer/playback-controls";
import { useComparisonPlayback } from "@/hooks/use-comparison-playback";
import type { AlgorithmMeta } from "@/lib/algorithms/catalog";
import { getAlgorithm, getAllAlgorithms, runAlgorithm } from "@/lib/algorithms/catalog";
import { computeMaxPointerStack } from "@/lib/visualizer/layout-stability";
import { AlgorithmSelect } from "./algorithm-select";
import { ComparisonSide } from "./comparison-side";

const DEFAULT_SLUG_A = "merge-sort";
const DEFAULT_SLUG_B = "quick-sort";

/**
 * Steps come from a plain useMemo (pure, safe to call speculatively).
 * computeTimeMs is measured separately in an effect - performance.now()
 * is an impure read, so it can't live inside the memo itself; the
 * (cheap, sub-millisecond) computation just runs a second time there
 * purely to time it.
 */
function useTimedRun(algorithm: AlgorithmMeta) {
  const steps = useMemo(() => runAlgorithm(algorithm), [algorithm]);
  const [computeTimeMs, setComputeTimeMs] = useState(0);

  useEffect(() => {
    // setState nested inside the timeout callback (not called directly in
    // the effect body) - same pattern the playback hooks use for their
    // "stop at the end" transition, and for the same lint reason.
    const id = window.setTimeout(() => {
      const start = performance.now();
      runAlgorithm(algorithm);
      setComputeTimeMs(performance.now() - start);
    }, 0);
    return () => window.clearTimeout(id);
  }, [algorithm]);

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

  const { steps: stepsA, computeTimeMs: computeTimeMsA } = useTimedRun(algorithmA);
  const { steps: stepsB, computeTimeMs: computeTimeMsB } = useTimedRun(algorithmB);

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

      {/* grid-cols-1 matters even below lg - see visualization-tab.tsx */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ComparisonSide
          algorithm={algorithmA}
          steps={stepsA}
          currentStep={playback.currentStepA}
          currentIndex={playback.indexA}
          totalSteps={stepsA.length}
          computeTimeMs={computeTimeMsA}
          maxPointerRows={maxPointerRows}
        />
        <ComparisonSide
          algorithm={algorithmB}
          steps={stepsB}
          currentStep={playback.currentStepB}
          currentIndex={playback.indexB}
          totalSteps={stepsB.length}
          computeTimeMs={computeTimeMsB}
          maxPointerRows={maxPointerRows}
        />
      </div>
    </div>
  );
}
