"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlayback } from "@/hooks/use-playback";
import { getAlgorithm, runAlgorithmWithInput } from "@/lib/algorithms/catalog";
import type { Language } from "@/lib/algorithms/languages";
import type { Graph } from "@/lib/graph/types";
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
  const [language, setLanguage] = useState<Language>("java");

  // User-editable input, separate per kind. null means "use the
  // algorithm's own default" - randomizing or entering a custom array
  // (or randomizing the graph) fills these in instead.
  const [customInput, setCustomInput] = useState<number[] | null>(null);
  const [customGraph, setCustomGraph] = useState<Graph | null>(null);

  // Reset editable input whenever the algorithm itself changes (a new
  // slug) - render-time "reset state when a prop changes" pattern, so a
  // custom array/graph never carries over to a different algorithm.
  const [prevAlgorithm, setPrevAlgorithm] = useState(algorithm);
  if (algorithm !== prevAlgorithm) {
    setPrevAlgorithm(algorithm);
    setCustomInput(null);
    setCustomGraph(null);
  }

  const activeArrayInput =
    algorithm.kind === "array" ? (customInput ?? algorithm.sampleInput) : null;
  const activeGraph = algorithm.kind === "graph" ? (customGraph ?? algorithm.graph) : null;

  const steps = useMemo(() => {
    return runAlgorithmWithInput(algorithm, algorithm.kind === "array" ? activeArrayInput! : activeGraph!);
  }, [algorithm, activeArrayInput, activeGraph]);

  const playback = usePlayback(steps);

  return (
    <Tabs defaultValue="overview" className="gap-6">
      {/* max-w-full + overflow-x-auto: on a narrow viewport the tab bar
          scrolls within itself instead of forcing the whole page wider. */}
      <TabsList className="max-w-full overflow-x-auto">
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
            arrayInput={activeArrayInput!}
            onArrayInputChange={setCustomInput}
            resetKey={slug}
          />
        ) : (
          <GraphVisualizationTab
            graph={activeGraph!}
            playback={playback}
            pseudocode={algorithm.pseudocode}
            steps={steps}
            onGraphChange={setCustomGraph}
            resetKey={slug}
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
