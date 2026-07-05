import { useMemo } from "react";
import { ArrayBars } from "@/components/visualizer/array-bars";
import { CallStackPanel } from "@/components/visualizer/call-stack-panel";
import { PlaybackControls } from "@/components/visualizer/playback-controls";
import { StateLegend } from "@/components/visualizer/state-legend";
import type { usePlayback } from "@/hooks/use-playback";
import {
  computeMaxCallStackDepth,
  computeMaxPointerStack,
} from "@/lib/visualizer/layout-stability";
import type { Step } from "@/types/step";
import { ArrayInputControls } from "./array-input-controls";
import { CodeTab } from "./code-tab";

type Playback = ReturnType<typeof usePlayback>;

export function VisualizationTab({
  playback,
  pseudocode,
  steps,
  arrayInput,
  onArrayInputChange,
  resetKey,
  legendVariant = "sorting",
}: {
  playback: Playback;
  pseudocode: string[];
  steps: Step[];
  arrayInput: number[];
  onArrayInputChange: (values: number[]) => void;
  resetKey: string;
  legendVariant?: "sorting" | "searching";
}) {
  const {
    currentStep,
    currentIndex,
    totalSteps,
    isPlaying,
    isAtStart,
    isAtEnd,
    speed,
    setSpeed,
    toggle,
    next,
    prev,
    reset,
  } = playback;

  const arrayLength = steps[0]?.dataStructureState?.array?.length ?? 0;
  const maxPointerRows = useMemo(
    () => computeMaxPointerStack(steps, arrayLength),
    [steps, arrayLength]
  );
  const maxCallStackDepth = useMemo(() => computeMaxCallStackDepth(steps), [steps]);

  return (
    // Visual + controls stay adjacent in their own column so play/step/
    // reset never require scrolling away from what's on screen. The
    // pseudocode column carries the explanation and auxiliary panels
    // right underneath it, rather than a separate full-width row.
    // grid-cols-1 (not just lg:grid-cols-2) matters here even though it's
    // the layout's only column below lg - Tailwind's numbered grid-cols
    // utilities set minmax(0, 1fr), which lets a child's own
    // overflow-x-auto (the code panel's long lines) actually engage.
    // Without it the browser's default single-column `auto` track sizes
    // to fit that content unwrapped, and the whole page overflows instead.
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <ArrayBars step={currentStep} maxPointerRows={maxPointerRows} />
        <StateLegend variant={legendVariant} />
        {/* Keyed by algorithm so its text field resets to the new
            algorithm's default array instead of showing a stale value -
            "Randomize"/"Set array" already keep it in sync themselves. */}
        <ArrayInputControls
          key={resetKey}
          initialValue={arrayInput}
          onChange={onArrayInputChange}
        />
        <PlaybackControls
          isPlaying={isPlaying}
          isAtStart={isAtStart}
          isAtEnd={isAtEnd}
          speed={speed}
          onToggle={toggle}
          onNext={next}
          onPrev={prev}
          onReset={reset}
          onSpeedChange={setSpeed}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="max-h-[300px] overflow-y-auto">
          <CodeTab source={pseudocode} currentLine={currentStep.lineOfCode} />
        </div>

        <div className="space-y-1">
          {/* Fixed height (not min-height) reserved for 3 lines - a floor
              alone still lets the "Step" line below shift by however much
              a longer/shorter description wraps differently step to step. */}
          <p className="h-[60px] text-sm leading-5 text-foreground">
            {currentStep.description}
          </p>
          <p className="text-xs text-muted-foreground">
            Step {currentIndex + 1} of {totalSteps} · line {currentStep.lineOfCode}
          </p>
        </div>

        <CallStackPanel
          callStack={currentStep.dataStructureState?.callStack ?? []}
          maxDepth={maxCallStackDepth}
        />
      </div>
    </div>
  );
}
