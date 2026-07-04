import { useMemo } from "react";
import { CallStackPanel } from "@/components/visualizer/call-stack-panel";
import { GraphStateLegend } from "@/components/visualizer/graph-state-legend";
import { GraphView } from "@/components/visualizer/graph-view";
import { LinearStatePanel } from "@/components/visualizer/linear-state-panel";
import { PlaybackControls } from "@/components/visualizer/playback-controls";
import type { usePlayback } from "@/hooks/use-playback";
import type { Graph } from "@/lib/graph/types";
import {
  computeMaxCallStackDepth,
  computeMaxLinearItems,
} from "@/lib/visualizer/layout-stability";
import type { Step } from "@/types/step";
import { CodeTab } from "./code-tab";

type Playback = ReturnType<typeof usePlayback>;

export function GraphVisualizationTab({
  graph,
  playback,
  pseudocode,
  steps,
}: {
  graph: Graph;
  playback: Playback;
  pseudocode: string[];
  steps: Step[];
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

  const maxCallStackDepth = useMemo(() => computeMaxCallStackDepth(steps), [steps]);
  const maxQueueItems = useMemo(() => computeMaxLinearItems(steps, "queue"), [steps]);
  const maxPQItems = useMemo(
    () => computeMaxLinearItems(steps, "priorityQueue"),
    [steps]
  );

  return (
    // Visual + controls stay adjacent in their own column so play/step/
    // reset never require scrolling away from what's on screen. The
    // pseudocode column carries the explanation and auxiliary panels
    // right underneath it, rather than a separate full-width row.
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <GraphView graph={graph} step={currentStep} />
        <GraphStateLegend />
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

        {/* Only whichever of these an algorithm actually populates renders -
            BFS shows Queue, Dijkstra shows Priority queue, DFS shows the
            call stack via its recursion. */}
        <LinearStatePanel
          label="Queue"
          items={currentStep.dataStructureState?.queue ?? []}
          maxItems={maxQueueItems}
        />
        <LinearStatePanel
          label="Priority queue"
          items={currentStep.dataStructureState?.priorityQueue ?? []}
          maxItems={maxPQItems}
        />
        <CallStackPanel
          callStack={currentStep.dataStructureState?.callStack ?? []}
          maxDepth={maxCallStackDepth}
        />
      </div>
    </div>
  );
}
