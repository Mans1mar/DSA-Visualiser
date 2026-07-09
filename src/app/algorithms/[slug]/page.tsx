import { notFound } from "next/navigation";
import { AlgorithmHeader } from "@/components/algorithm-page/algorithm-header";
import { AlgorithmPageClient } from "@/components/algorithm-page/algorithm-page-client";
import { getAlgorithm, getAllAlgorithms } from "@/lib/algorithms/catalog";

/** Required for `output: "export"` (static GitHub Pages build) - every
 * dynamic route must be enumerable at build time. Pulls from the same
 * catalog the homepage cards use, so a new algorithm only ever needs
 * adding in one place. */
export function generateStaticParams() {
  return getAllAlgorithms().map((algorithm) => ({ slug: algorithm.slug }));
}

export default async function AlgorithmPage(
  props: PageProps<"/algorithms/[slug]">
) {
  const { slug } = await props.params;
  const algorithm = getAlgorithm(slug);

  if (!algorithm) notFound();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 py-12 pr-6 pl-8">
      <AlgorithmHeader algorithm={algorithm} />
      <AlgorithmPageClient slug={slug} />
    </div>
  );
}
