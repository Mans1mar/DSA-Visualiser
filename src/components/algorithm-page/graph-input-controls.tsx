"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { graphToText, parseCustomGraph } from "@/lib/graph/custom-graph";
import { generateRandomGraph } from "@/lib/graph/random-graph";
import type { Graph } from "@/lib/graph/types";

export function GraphInputControls({
  initialValue,
  onChange,
}: {
  initialValue: Graph;
  onChange: (graph: Graph) => void;
}) {
  const [text, setText] = useState(() => graphToText(initialValue));
  const [error, setError] = useState<string | null>(null);

  function applyText() {
    const result = parseCustomGraph(text);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setError(null);
    onChange(result.graph);
  }

  function randomize() {
    const graph = generateRandomGraph();
    setText(graphToText(graph));
    setError(null);
    onChange(graph);
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
          placeholder="e.g. A-B:4, B-C:1, A-C:2"
          aria-label="Custom graph input"
          className="w-56 rounded-lg bg-card px-3 py-1.5 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="button" size="sm" variant="outline" onClick={applyText}>
          Set graph
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={randomize}>
          Randomize
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
