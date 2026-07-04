"use client";

import { useCallback, useEffect, useState } from "react";
import type { Step } from "@/types/step";

const BASE_STEP_DURATION_MS = 800;

export function usePlayback(steps: Step[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Reset playback whenever the steps identity changes (random/custom
  // input regenerated the run) - the "adjust state during render when a
  // prop changes" pattern, same as useComparisonPlayback, so a stale
  // index from the old run is never rendered against the new one.
  const [prevSteps, setPrevSteps] = useState(steps);
  if (steps !== prevSteps) {
    setPrevSteps(steps);
    setCurrentIndex(0);
    setIsPlaying(false);
  }

  const lastIndex = steps.length - 1;
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= lastIndex;

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, lastIndex));
  }, [lastIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
  }, []);

  const play = useCallback(() => {
    setCurrentIndex((i) => (i >= lastIndex ? 0 : i));
    setIsPlaying(true);
  }, [lastIndex]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  useEffect(() => {
    if (!isPlaying || currentIndex >= lastIndex) return;
    const duration = BASE_STEP_DURATION_MS / speed;
    const id = window.setTimeout(() => {
      setCurrentIndex((i) => {
        const nextIndex = Math.min(i + 1, lastIndex);
        if (nextIndex >= lastIndex) setIsPlaying(false);
        return nextIndex;
      });
    }, duration);
    return () => window.clearTimeout(id);
  }, [isPlaying, currentIndex, lastIndex, speed]);

  return {
    currentIndex,
    currentStep: steps[currentIndex],
    totalSteps: steps.length,
    isPlaying,
    isAtStart,
    isAtEnd,
    speed,
    setSpeed,
    play,
    pause,
    toggle,
    next,
    prev,
    reset,
  };
}
