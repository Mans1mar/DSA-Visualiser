import { VisualizerDemo } from "@/components/visualizer/visualizer-demo";

export default function VisualizerDemoPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Visualization engine demo
        </h1>
        <p className="text-sm text-muted-foreground">
          Real, hand-instrumented Merge Sort and Quick Sort running on the
          same generic renderer and playback controls. Temporary route - it
          goes away once the real algorithm page (Phase 4) exists.
        </p>
      </div>
      <VisualizerDemo />
    </div>
  );
}
