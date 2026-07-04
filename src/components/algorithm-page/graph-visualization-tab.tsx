import { CallStackPanel } from "@/components/visualizer/call-stack-panel";
import { GraphStateLegend } from "@/components/visualizer/graph-state-legend";
import { GraphView } from "@/components/visualizer/graph-view";
import { LinearStatePanel } from "@/components/visualizer/linear-state-panel";
import { PlaybackControls } from "@/components/visualizer/playback-controls";
import type { usePlayback } from "@/hooks/use-playback";
import type { Graph } from "@/lib/graph/types";
import { CodeTab } from "./code-tab";

type Playback = ReturnType<typeof usePlayback>;

export function GraphVisualizationTab({
  graph,
  playback,
  source,
}: {
  graph: Graph;
  playback: Playback;
  source: string[];
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

  return (
    <div className="flex flex-col gap-6">
      {/* Visual + controls stay adjacent so play/step/reset never require
          scrolling away from what's on screen; the code panel sits beside
          them instead of behind a separate tab. */}
      <div className="grid gap-6 lg:grid-cols-2">
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
        <div className="max-h-[440px] overflow-y-auto">
          <CodeTab source={source} currentLine={currentStep.lineOfCode} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <p className="text-sm text-foreground">{currentStep.description}</p>
          <p className="text-xs text-muted-foreground">
            Step {currentIndex + 1} of {totalSteps} · line {currentStep.lineOfCode}
          </p>
        </div>

        {/* Only whichever of these an algorithm actually populates renders -
            BFS shows Queue, Dijkstra shows Priority queue, DFS shows the
            call stack via its recursion. */}
        <LinearStatePanel label="Queue" items={currentStep.dataStructureState?.queue ?? []} />
        <LinearStatePanel
          label="Priority queue"
          items={currentStep.dataStructureState?.priorityQueue ?? []}
        />
        <CallStackPanel callStack={currentStep.dataStructureState?.callStack ?? []} />
      </div>
    </div>
  );
}
