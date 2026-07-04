"use client";

import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlayback } from "@/hooks/use-playback";
import { getAlgorithm, runAlgorithm } from "@/lib/algorithms/catalog";
import { CodeTab } from "./code-tab";
import { ComplexityTab } from "./complexity-tab";
import { GraphVisualizationTab } from "./graph-visualization-tab";
import { OverviewTab } from "./overview-tab";
import { PracticeTab } from "./practice-tab";
import { VisualizationTab } from "./visualization-tab";

/**
 * Takes the slug rather than the resolved AlgorithmMeta - the metadata
 * includes a run() function, and functions can't be passed from a
 * Server Component into a Client Component as a prop. The page has
 * already confirmed the slug resolves (via notFound()) before this
 * renders.
 */
export function AlgorithmPageClient({ slug }: { slug: string }) {
  const algorithm = getAlgorithm(slug)!;
  const steps = useMemo(() => runAlgorithm(algorithm), [algorithm]);
  const playback = usePlayback(steps);

  return (
    <Tabs defaultValue="overview" className="gap-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="visualization">Visualization</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="complexity">Complexity</TabsTrigger>
        <TabsTrigger value="practice">Practice</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab algorithm={algorithm} />
      </TabsContent>
      <TabsContent value="visualization">
        {algorithm.kind === "array" ? (
          <VisualizationTab
            playback={playback}
            pseudocode={algorithm.pseudocode}
            steps={steps}
          />
        ) : (
          <GraphVisualizationTab
            graph={algorithm.graph}
            playback={playback}
            pseudocode={algorithm.pseudocode}
            steps={steps}
          />
        )}
      </TabsContent>
      <TabsContent value="code">
        <CodeTab source={algorithm.source} currentLine={playback.currentStep.lineOfCode} />
      </TabsContent>
      <TabsContent value="complexity">
        <ComplexityTab algorithm={algorithm} />
      </TabsContent>
      <TabsContent value="practice">
        <PracticeTab />
      </TabsContent>
    </Tabs>
  );
}
