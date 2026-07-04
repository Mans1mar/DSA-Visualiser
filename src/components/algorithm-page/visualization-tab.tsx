import { ArrayBars } from "@/components/visualizer/array-bars";
import { PlaybackControls } from "@/components/visualizer/playback-controls";
import { StateLegend } from "@/components/visualizer/state-legend";
import type { usePlayback } from "@/hooks/use-playback";

type Playback = ReturnType<typeof usePlayback>;

export function VisualizationTab({ playback }: { playback: Playback }) {
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
    <div className="flex max-w-2xl flex-col gap-4">
      <ArrayBars step={currentStep} />
      <StateLegend />

      <div className="space-y-1">
        <p className="text-sm text-foreground">{currentStep.description}</p>
        <p className="text-xs text-muted-foreground">
          Step {currentIndex + 1} of {totalSteps} · line {currentStep.lineOfCode}
        </p>
      </div>

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
  );
}
