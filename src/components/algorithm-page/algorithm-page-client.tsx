"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlayback } from "@/hooks/use-playback";
import { getAlgorithm, runAlgorithm } from "@/lib/algorithms/catalog";
import type { Language } from "@/lib/algorithms/languages";
import { CodeLanguageSwitcher } from "./code-language-switcher";
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
  // Lifted up (rather than local to CodeLanguageSwitcher) so the choice
  // survives navigating away to another tab and back - Radix unmounts
  // inactive TabsContent, which would otherwise reset it to the default
  // every time, same reason `playback` itself lives up here.
  const [language, setLanguage] = useState<Language>("java");

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
        <CodeLanguageSwitcher
          sources={algorithm.sources}
          currentLine={playback.currentStep.lineOfCode}
          language={language}
          onLanguageChange={setLanguage}
        />
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
