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
import { cn } from "@/lib/utils";
import type { Step } from "@/types/step";
import { ArrayInputControls } from "./array-input-controls";
import { CodeTab } from "./code-tab";
import { TargetInputControls } from "./target-input-controls";

type Playback = ReturnType<typeof usePlayback>;

export function VisualizationTab({
  playback,
  pseudocode,
  steps,
  arrayInput,
  onArrayInputChange,
  resetKey,
  legendVariant = "sorting",
  target,
  onTargetChange,
}: {
  playback: Playback;
  pseudocode: string[];
  steps: Step[];
  arrayInput: number[];
  onArrayInputChange: (values: number[]) => void;
  resetKey: string;
  legendVariant?: "sorting" | "searching";
  /** Only search algorithms have a target - undefined for Sorting, which
   * hides the target input control entirely. */
  target?: number;
  onTargetChange?: (target: number) => void;
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
  // Merge/Quick Sort recurse and populate a call stack; every other
  // array algorithm here (the simple sorts, Linear/Binary/Jump Search)
  // never does, so there's nothing to show in a 3rd column - collapse
  // back to 2 columns and let pseudocode take the freed width instead
  // of reserving empty space.
  const hasAuxPanel = maxCallStackDepth > 0;

  return (
    // Visual + controls stay adjacent in their own column so play/step/
    // reset never require scrolling away from what's on screen. Pseudocode
    // and the call stack are separate columns (not stacked) so the stack
    // is visible on screen at the same time as the code driving it,
    // without scrolling. grid-cols-1 (not just lg:grid-cols-N) matters
    // here even though it's the layout's only column below lg -
    // Tailwind's numbered grid-cols utilities set minmax(0, 1fr), which
    // lets a child's own overflow-x-auto (the code panel's long lines)
    // actually engage. Without it the browser's default single-column
    // `auto` track sizes to fit that content unwrapped, and the whole
    // page overflows instead.
    <div
      className={cn(
        "grid grid-cols-1 items-start gap-6",
        // Explicit fr tracks (not grid-cols-N + col-span) so the call
        // stack can take a smaller share (0.85fr) than visualization and
        // pseudocode's even 2fr/2fr split - col-span-based ratios can
        // only express whole-number proportions.
        hasAuxPanel ? "lg:grid-cols-[2fr_2fr_0.85fr]" : "lg:grid-cols-[2fr_1fr]"
      )}
    >
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
        {target !== undefined && onTargetChange && (
          <TargetInputControls
            key={`${resetKey}-target`}
            initialValue={target}
            arrayValues={arrayInput}
            onChange={onTargetChange}
          />
        )}
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
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Pseudo-Code
          </h3>
          <div className="max-h-[300px] overflow-y-auto">
            <CodeTab source={pseudocode} currentLine={currentStep.lineOfCode} />
          </div>
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
      </div>

      {hasAuxPanel && (
        <div className="flex flex-col gap-4">
          <CallStackPanel
            callStack={currentStep.dataStructureState?.callStack ?? []}
            maxDepth={maxCallStackDepth}
          />
        </div>
      )}
    </div>
  );
}
