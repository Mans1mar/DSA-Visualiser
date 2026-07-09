import { useMemo } from "react";
import { CallStackPanel } from "@/components/visualizer/call-stack-panel";
import { LinearStatePanel } from "@/components/visualizer/linear-state-panel";
import { PlaybackControls } from "@/components/visualizer/playback-controls";
import { TreeStateLegend } from "@/components/visualizer/tree-state-legend";
import { TreeView } from "@/components/visualizer/tree-view";
import type { usePlayback } from "@/hooks/use-playback";
import {
  computeMaxCallStackDepth,
  computeMaxLinearItems,
  computeMaxTreeExtent,
} from "@/lib/visualizer/layout-stability";
import { cn } from "@/lib/utils";
import type { Step } from "@/types/step";
import { ArrayInputControls } from "./array-input-controls";
import { CodeTab } from "./code-tab";
import { TargetInputControls } from "./target-input-controls";

type Playback = ReturnType<typeof usePlayback>;

export function TreeVisualizationTab({
  playback,
  pseudocode,
  steps,
  values,
  onValuesChange,
  resetKey,
  legendVariant = "default",
  target,
  onTargetChange,
}: {
  playback: Playback;
  pseudocode: string[];
  steps: Step[];
  /** The insert sequence that builds the starting tree - editable the
   * same way an array algorithm's input is, via ArrayInputControls. */
  values: number[];
  onValuesChange: (values: number[]) => void;
  resetKey: string;
  legendVariant?: "default" | "search" | "traversal";
  /** Only Search and Delete have a target - undefined for Insert and
   * the four traversals, which hides the target input control entirely. */
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

  const { width: reservedWidth, height: reservedHeight } = useMemo(
    () => computeMaxTreeExtent(steps),
    [steps]
  );
  const maxCallStackDepth = useMemo(() => computeMaxCallStackDepth(steps), [steps]);
  const maxQueueItems = useMemo(() => computeMaxLinearItems(steps, "queue"), [steps]);
  // Level-order populates a queue, Insert/Search/Delete/the three
  // recursive traversals populate a call stack - every Tree algorithm
  // uses one or the other, but the check stays generic rather than
  // assuming both always apply.
  const hasAuxPanel = maxCallStackDepth > 0 || maxQueueItems > 0;

  return (
    // Same layout shape as VisualizationTab/GraphVisualizationTab -
    // pseudocode and the queue/stack panel are separate columns (not
    // stacked) so the stack is visible on screen at the same time as
    // the code driving it, without scrolling. See visualization-tab.tsx
    // for why grid-cols-1 matters even below lg.
    <div
      className={cn(
        "grid grid-cols-1 items-start gap-6",
        // Explicit fr tracks (not grid-cols-N + col-span) so the aux
        // panel column can take a smaller share (0.85fr) than
        // visualization and pseudocode's even 2fr/2fr split -
        // col-span-based ratios can only express whole-number proportions.
        hasAuxPanel ? "lg:grid-cols-[2fr_2fr_0.85fr]" : "lg:grid-cols-[2fr_1fr]"
      )}
    >
      <div className="flex flex-col gap-4">
        <TreeView step={currentStep} reservedWidth={reservedWidth} reservedHeight={reservedHeight} />
        <TreeStateLegend variant={legendVariant} />
        {/* Keyed by algorithm so its text field resets to the new
            algorithm's default insert sequence instead of showing a
            stale value. */}
        <ArrayInputControls key={resetKey} initialValue={values} onChange={onValuesChange} />
        {target !== undefined && onTargetChange && (
          <TargetInputControls
            key={`${resetKey}-target`}
            initialValue={target}
            arrayValues={values}
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
          {/* Only whichever of these an algorithm actually populates
              renders - Level-order shows Queue, Insert/Search/Delete/the
              recursive traversals show the call stack. */}
          <LinearStatePanel
            label="Queue"
            items={currentStep.dataStructureState?.queue ?? []}
            maxItems={maxQueueItems}
          />
          <CallStackPanel
            callStack={currentStep.dataStructureState?.callStack ?? []}
            maxDepth={maxCallStackDepth}
          />
        </div>
      )}
    </div>
  );
}
