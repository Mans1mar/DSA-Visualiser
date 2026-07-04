"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePlayback } from "@/hooks/use-playback";
import { mergeSort } from "@/lib/algorithms/merge-sort";
import { quickSort } from "@/lib/algorithms/quick-sort";
import { ArrayBars } from "./array-bars";
import { PlaybackControls } from "./playback-controls";
import { StateLegend } from "./state-legend";

const SAMPLE_INPUT = [8, 3, 5, 4, 7, 6, 1, 2];

const ALGORITHMS = {
  "merge-sort": { label: "Merge Sort", run: mergeSort },
  "quick-sort": { label: "Quick Sort", run: quickSort },
} as const;

type AlgorithmKey = keyof typeof ALGORITHMS;

export function VisualizerDemo() {
  const [algorithmKey, setAlgorithmKey] = useState<AlgorithmKey>("merge-sort");
  const steps = useMemo(
    () => ALGORITHMS[algorithmKey].run(SAMPLE_INPUT),
    [algorithmKey]
  );

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
  } = usePlayback(steps);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {(Object.keys(ALGORITHMS) as AlgorithmKey[]).map((key) => (
          <Button
            key={key}
            variant={key === algorithmKey ? "default" : "outline"}
            size="sm"
            onClick={() => {
              reset();
              setAlgorithmKey(key);
            }}
          >
            {ALGORITHMS[key].label}
          </Button>
        ))}
      </div>

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
