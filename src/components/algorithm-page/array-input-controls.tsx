"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateRandomArray, parseCustomArray } from "@/lib/algorithms/random-input";

export function ArrayInputControls({
  initialValue,
  onChange,
}: {
  initialValue: number[];
  onChange: (values: number[]) => void;
}) {
  const [text, setText] = useState(() => initialValue.join(", "));
  const [error, setError] = useState<string | null>(null);

  function applyText() {
    const result = parseCustomArray(text);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setError(null);
    onChange(result.values);
  }

  function randomize() {
    const values = generateRandomArray();
    setText(values.join(", "));
    setError(null);
    onChange(values);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") applyText();
          }}
          placeholder="e.g. 5, 3, 8, 1, 9"
          aria-label="Custom array input"
          className="w-44 rounded-lg bg-card px-3 py-1.5 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="button" size="sm" variant="outline" onClick={applyText}>
          Set array
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={randomize}>
          Randomize
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
