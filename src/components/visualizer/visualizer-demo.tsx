"use client";

import { usePlayback } from "@/hooks/use-playback";
import { fakeSortSteps } from "@/lib/visualizer/fake-steps";
import { ArrayBars } from "./array-bars";
import { PlaybackControls } from "./playback-controls";
import { StateLegend } from "./state-legend";

export function VisualizerDemo() {
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
  } = usePlayback(fakeSortSteps);

  return (
    <div className="flex flex-col gap-4">
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
