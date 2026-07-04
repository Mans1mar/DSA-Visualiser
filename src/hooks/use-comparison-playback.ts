"use client";

import { useCallback, useEffect, useState } from "react";
import type { Step } from "@/types/step";

const BASE_STEP_DURATION_MS = 800;

/**
 * Drives two Step[] runs from one shared frame counter so both sides
 * play/pause/step together. The two runs rarely have the same length -
 * whichever finishes first just holds on its last step (clamped) while
 * the other keeps going, which is itself a meaningful signal (it needed
 * fewer steps) rather than something to paper over with rescaling.
 */
export function useComparisonPlayback(stepsA: Step[], stepsB: Step[]) {
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Reset playback whenever either run changes identity (user picked a
  // different algorithm) - React's sanctioned "adjust state during
  // render when a prop changes" pattern, so the old frame index is never
  // rendered against the new steps even for a moment (unlike an effect,
  // which would run after that first mismatched paint).
  const [prevStepsA, setPrevStepsA] = useState(stepsA);
  const [prevStepsB, setPrevStepsB] = useState(stepsB);
  if (stepsA !== prevStepsA || stepsB !== prevStepsB) {
    setPrevStepsA(stepsA);
    setPrevStepsB(stepsB);
    setFrame(0);
    setIsPlaying(false);
  }

  const maxFrame = Math.max(stepsA.length, stepsB.length) - 1;
  const isAtStart = frame === 0;
  const isAtEnd = frame >= maxFrame;

  const next = useCallback(() => {
    setFrame((f) => Math.min(f + 1, maxFrame));
  }, [maxFrame]);

  const prev = useCallback(() => {
    setFrame((f) => Math.max(f - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setFrame(0);
  }, []);

  const play = useCallback(() => {
    setFrame((f) => (f >= maxFrame ? 0 : f));
    setIsPlaying(true);
  }, [maxFrame]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  useEffect(() => {
    if (!isPlaying || frame >= maxFrame) return;
    const duration = BASE_STEP_DURATION_MS / speed;
    const id = window.setTimeout(() => {
      setFrame((f) => {
        const nextFrame = Math.min(f + 1, maxFrame);
        if (nextFrame >= maxFrame) setIsPlaying(false);
        return nextFrame;
      });
    }, duration);
    return () => window.clearTimeout(id);
  }, [isPlaying, frame, maxFrame, speed]);

  const indexA = Math.min(frame, stepsA.length - 1);
  const indexB = Math.min(frame, stepsB.length - 1);

  return {
    frame,
    maxFrame,
    isPlaying,
    isAtStart,
    isAtEnd,
    speed,
    setSpeed,
    toggle,
    next,
    prev,
    reset,
    indexA,
    indexB,
    currentStepA: stepsA[indexA],
    currentStepB: stepsB[indexB],
  };
}
