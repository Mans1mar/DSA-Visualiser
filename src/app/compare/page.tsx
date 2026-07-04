import { ComparisonPageClient } from "@/components/compare/comparison-page-client";

export default function ComparePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Comparison Mode</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Run two algorithms on the same input side by side and watch how
          their step counts, comparisons, and swaps stack up.
        </p>
      </div>
      <ComparisonPageClient />
    </div>
  );
}
