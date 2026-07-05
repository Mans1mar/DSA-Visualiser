import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AlgorithmMeta } from "@/lib/algorithms/catalog";

const DIFFICULTY_CLASS: Record<AlgorithmMeta["difficulty"], string> = {
  Easy: "badge-easy",
  Medium: "badge-medium",
  Hard: "badge-hard",
};

export function AlgorithmHeader({ algorithm }: { algorithm: AlgorithmMeta }) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/"
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All algorithms
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {algorithm.category}
        </p>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-semibold",
            DIFFICULTY_CLASS[algorithm.difficulty]
          )}
        >
          {algorithm.difficulty}
        </span>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">{algorithm.name}</h1>
      <p className="max-w-2xl text-muted-foreground">{algorithm.shortDescription}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
        <span>
          Time (average):{" "}
          <span className="font-mono text-foreground">
            {algorithm.timeComplexity.average}
          </span>
        </span>
        <span>
          Space:{" "}
          <span className="font-mono text-foreground">{algorithm.spaceComplexity}</span>
        </span>
      </div>
    </div>
  );
}
