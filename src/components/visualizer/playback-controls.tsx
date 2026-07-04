import { Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const MIN_SPEED = 0.25;
const MAX_SPEED = 3;
const SPEED_STEP = 0.25;

type PlaybackControlsProps = {
  isPlaying: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  speed: number;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
};

export function PlaybackControls({
  isPlaying,
  isAtStart,
  isAtEnd,
  speed,
  onToggle,
  onNext,
  onPrev,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-card p-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          aria-label="Reset"
        >
          <RotateCcw />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrev}
          disabled={isAtStart}
          aria-label="Previous step"
        >
          <StepBack />
        </Button>
        <Button size="icon" onClick={onToggle} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={isAtEnd}
          aria-label="Next step"
        >
          <StepForward />
        </Button>
      </div>
      <div className="flex min-w-48 flex-1 items-center gap-3">
        <span className="text-xs whitespace-nowrap text-muted-foreground">
          Speed
        </span>
        <Slider
          value={[speed]}
          min={MIN_SPEED}
          max={MAX_SPEED}
          step={SPEED_STEP}
          onValueChange={([value]) => onSpeedChange(value)}
        />
        <span className="w-9 text-right text-xs text-muted-foreground">
          {speed.toFixed(2).replace(/\.?0+$/, "")}x
        </span>
      </div>
    </div>
  );
}
