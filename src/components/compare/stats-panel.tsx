import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlgorithmMeta } from "@/lib/algorithms/catalog";
import type { RunningStats } from "@/lib/visualizer/comparison-stats";

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {/* min-width + tabular-nums keep the row from jittering
          horizontally as the value's digit count grows during playback */}
      <span className="min-w-14 text-right font-mono text-foreground tabular-nums">
        {value}
      </span>
    </div>
  );
}

export function StatsPanel({
  stats,
  computeTimeMs,
  algorithm,
}: {
  stats: RunningStats;
  computeTimeMs: number;
  algorithm: AlgorithmMeta;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Live stats
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <StatRow label="Comparisons" value={String(stats.comparisons)} />
        <StatRow label="Swaps" value={String(stats.swaps)} />
        <StatRow label="Recursive calls" value={String(stats.recursiveCalls)} />
        <StatRow label="Peak aux. items" value={String(stats.peakAuxItems)} />
        <StatRow label="Compute time" value={`${computeTimeMs.toFixed(2)} ms`} />
        <div className="my-1 border-t border-border" />
        <StatRow label="Time (avg)" value={algorithm.timeComplexity.average} />
        <StatRow label="Space" value={algorithm.spaceComplexity} />
      </CardContent>
    </Card>
  );
}
