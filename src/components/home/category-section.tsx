import type { AlgorithmMeta, Category } from "@/lib/algorithms/catalog";
import { AlgorithmCard } from "./algorithm-card";

export function CategorySection({
  category,
  algorithms,
}: {
  category: Category;
  algorithms: AlgorithmMeta[];
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-tight">{category}</h2>
      {algorithms.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {algorithms.map((algorithm) => (
            <AlgorithmCard key={algorithm.slug} algorithm={algorithm} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {category} algorithms are coming soon.
          </p>
        </div>
      )}
    </section>
  );
}
