import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-32 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">DSA Visualizer</h1>
      <p className="max-w-md text-muted-foreground">
        Homepage with algorithm categories lands in a later phase. Routing
        scaffold only for now.
      </p>
      <Link
        href="/visualizer-demo"
        className="mt-4 text-sm font-medium text-primary underline underline-offset-4"
      >
        View visualization engine demo →
      </Link>
    </div>
  );
}
