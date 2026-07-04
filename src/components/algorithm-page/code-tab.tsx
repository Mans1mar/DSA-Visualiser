"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type CodeTabProps = {
  source: string[];
  currentLine: number;
};

export function CodeTab({ source, currentLine }: CodeTabProps) {
  const activeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [currentLine]);

  return (
    <div className="max-w-2xl overflow-x-auto rounded-lg bg-muted/50 p-4">
      <pre className="font-mono text-sm">
        {source.map((line, i) => {
          const lineNumber = i + 1;
          const active = lineNumber === currentLine;
          return (
            <div
              key={lineNumber}
              ref={active ? activeLineRef : undefined}
              className={cn(
                "flex gap-4 rounded px-2 py-0.5",
                active && "code-line-active"
              )}
            >
              <span className="w-5 shrink-0 text-right text-muted-foreground/50 select-none">
                {lineNumber}
              </span>
              <span className="whitespace-pre">{line || " "}</span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
