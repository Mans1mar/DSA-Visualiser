import Link from "next/link";
import { CategorySection } from "@/components/home/category-section";
import { SearchBar } from "@/components/home/search-bar";
import {
  CATEGORY_ORDER,
  getAlgorithmsByCategory,
  getAllAlgorithms,
} from "@/lib/algorithms/catalog";

export default function Home() {
  const searchEntries = getAllAlgorithms().map(({ slug, name, category }) => ({
    slug,
    name,
    category,
  }));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-12">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">DSA Visualizer</h1>
            <p className="mt-1 max-w-xl text-muted-foreground">
              Watch algorithms run step by step, instead of just reading code
              or staring at a final answer.
            </p>
          </div>
          <Link
            href="/compare"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            Compare two algorithms →
          </Link>
        </div>
        <SearchBar algorithms={searchEntries} />
      </div>

      <div className="flex flex-col gap-10">
        {CATEGORY_ORDER.map((category) => (
          <CategorySection
            key={category}
            category={category}
            algorithms={getAlgorithmsByCategory(category)}
          />
        ))}
      </div>
    </div>
  );
}
