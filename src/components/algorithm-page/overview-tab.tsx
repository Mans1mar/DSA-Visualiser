import type { AlgorithmMeta } from "@/lib/algorithms/catalog";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function OverviewTab({ algorithm }: { algorithm: AlgorithmMeta }) {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Section title="What it does">
        <p className="text-sm leading-relaxed">{algorithm.overview.whatItDoes}</p>
      </Section>

      <Section title="When to use it">
        <p className="text-sm leading-relaxed">{algorithm.overview.whenToUse}</p>
      </Section>

      <div className="grid gap-6 sm:grid-cols-2">
        <Section title="Pros">
          <ul className="flex flex-col gap-1.5 text-sm">
            {algorithm.overview.pros.map((pro) => (
              <li key={pro} className="flex gap-2">
                <span className="text-[color:var(--chart-3)]">+</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Cons">
          <ul className="flex flex-col gap-1.5 text-sm">
            {algorithm.overview.cons.map((con) => (
              <li key={con} className="flex gap-2">
                <span className="text-[color:var(--chart-2)]">–</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
