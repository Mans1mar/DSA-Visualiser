import { VisualizerDemo } from "@/components/visualizer/visualizer-demo";

export default function VisualizerDemoPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Visualization engine demo
        </h1>
        <p className="text-sm text-muted-foreground">
          Hardcoded steps driving the generic renderer and playback
          controls, ahead of any real algorithm. Temporary route - it goes
          away once the real algorithm page (Phase 4) exists.
        </p>
      </div>
      <VisualizerDemo />
    </div>
  );
}
