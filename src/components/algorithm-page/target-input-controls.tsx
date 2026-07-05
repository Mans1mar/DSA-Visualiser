"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const MIN_VALUE = 1;
const MAX_VALUE = 200;
const RANDOM_MAX = 99;
/** How often Randomize picks a value that's actually in the array
 * (guaranteed found) versus a genuinely random one (usually absent) -
 * mostly demonstrates the found path, the more instructive case, while
 * still exercising not-found regularly rather than never. */
const PRESENT_VALUE_CHANCE = 0.7;

export function TargetInputControls({
  initialValue,
  arrayValues,
  onChange,
}: {
  initialValue: number;
  arrayValues: number[];
  onChange: (target: number) => void;
}) {
  const [text, setText] = useState(() => String(initialValue));
  const [error, setError] = useState<string | null>(null);

  function applyText() {
    const trimmed = text.trim();
    const parsed = Number(trimmed);
    if (trimmed === "" || !Number.isFinite(parsed) || !Number.isInteger(parsed)) {
      setError(`"${text}" isn't a whole number.`);
      return;
    }
    if (parsed < MIN_VALUE || parsed > MAX_VALUE) {
      setError(`Target must be between ${MIN_VALUE} and ${MAX_VALUE}.`);
      return;
    }
    setError(null);
    onChange(parsed);
  }

  function randomize() {
    const pickPresentValue = arrayValues.length > 0 && Math.random() < PRESENT_VALUE_CHANCE;
    const value = pickPresentValue
      ? arrayValues[Math.floor(Math.random() * arrayValues.length)]
      : MIN_VALUE + Math.floor(Math.random() * RANDOM_MAX);
    setText(String(value));
    setError(null);
    onChange(value);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Target:</span>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") applyText();
          }}
          placeholder="e.g. 24"
          aria-label="Target value input"
          className="w-20 rounded-lg bg-card px-3 py-1.5 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="button" size="sm" variant="outline" onClick={applyText}>
          Set target
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={randomize}>
          Randomize
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
