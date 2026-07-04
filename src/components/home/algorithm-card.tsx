import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AlgorithmMeta } from "@/lib/algorithms/catalog";

const DIFFICULTY_CLASS: Record<AlgorithmMeta["difficulty"], string> = {
  Easy: "badge-easy",
  Medium: "badge-medium",
  Hard: "badge-hard",
};

export function AlgorithmCard({ algorithm }: { algorithm: AlgorithmMeta }) {
  return (
    <Link href={`/algorithms/${algorithm.slug}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{algorithm.name}</CardTitle>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                DIFFICULTY_CLASS[algorithm.difficulty]
              )}
            >
              {algorithm.difficulty}
            </span>
          </div>
          <CardDescription>{algorithm.shortDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4 text-xs text-muted-foreground">
          <span>
            Time:{" "}
            <span className="font-mono text-foreground">
              {algorithm.timeComplexity.average}
            </span>
          </span>
          <span>
            Space:{" "}
            <span className="font-mono text-foreground">{algorithm.spaceComplexity}</span>
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
