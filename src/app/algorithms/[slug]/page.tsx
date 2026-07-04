export default async function AlgorithmPage(
  props: PageProps<"/algorithms/[slug]">
) {
  const { slug } = await props.params;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-32 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">{slug}</h1>
      <p className="max-w-md text-muted-foreground">
        Overview / Visualization / Code / Complexity tabs land in a later
        phase. Routing scaffold only for now.
      </p>
    </div>
  );
}
