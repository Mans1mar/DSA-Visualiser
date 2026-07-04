"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AlgorithmMeta } from "@/lib/algorithms/catalog";

// Only the fields the search dropdown displays/links to - notably not
// run(), which can't cross the Server -> Client Component boundary.
type SearchEntry = Pick<AlgorithmMeta, "slug" | "name" | "category">;

export function SearchBar({ algorithms }: { algorithms: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return algorithms.filter((algorithm) => algorithm.name.toLowerCase().includes(q));
  }, [query, algorithms]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToAlgorithm(slug: string) {
    setQuery("");
    setOpen(false);
    router.push(`/algorithms/${slug}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <input
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && results.length > 0) goToAlgorithm(results[0].slug);
          if (event.key === "Escape") setOpen(false);
        }}
        placeholder="Search algorithms..."
        aria-label="Search algorithms"
        className="w-full rounded-lg bg-card px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {open && query.trim() && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg bg-card shadow-md ring-1 ring-foreground/10">
          {results.length > 0 ? (
            <ul>
              {results.map((algorithm) => (
                <li key={algorithm.slug}>
                  <button
                    type="button"
                    onClick={() => goToAlgorithm(algorithm.slug)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    <span>{algorithm.name}</span>
                    <span className="text-xs text-muted-foreground">{algorithm.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-2 text-sm text-muted-foreground">No algorithms found.</p>
          )}
        </div>
      )}
    </div>
  );
}
