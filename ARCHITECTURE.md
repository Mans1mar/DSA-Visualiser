# Architecture

Technical reference for how DSA Visualiser is built. `README.md` covers what it is and how to run it; this covers how it works internally.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), static export (`output: "export"`), Turbopack |
| Language | TypeScript, `strict: true` |
| UI runtime | React 19 |
| Styling | Tailwind CSS v4, custom CSS variables in `src/app/globals.css` |
| Components | shadcn/ui on Radix UI primitives (`components.json`, style `radix-nova`) |
| Icons | lucide-react |
| Hosting | GitHub Pages, static files only — no server, no API routes, no database |
| CI/CD | `.github/workflows/nextjs.yml` — builds with `next build` on push to `main`, deploys `out/` |

The app is a fully static site: `next.config.ts` sets `output: 'export'` and `basePath: '/dsa-visualiser'`. Every route is pre-rendered at build time; `generateStaticParams()` in `src/app/algorithms/[slug]/page.tsx` enumerates every algorithm slug from the catalog so each gets its own static HTML file.

## Project structure

```
src/
  app/
    page.tsx                     # Homepage - category sections of algorithm cards
    algorithms/[slug]/page.tsx    # Single algorithm page (generateStaticParams over the catalog)
    compare/page.tsx              # Comparison Mode
    globals.css                   # Design tokens + all visualizer state-color classes
  types/
    step.ts                       # The Step model - the entire contract between algorithms and UI
  lib/
    algorithms/                   # One file per algorithm: pseudocode, 3-language sources, run()
      catalog.ts                  # Single source of truth: every algorithm's metadata + dispatch
      step-recorder.ts            # Array-algorithm instrumentation helper
      graph-step-recorder.ts      # Graph-algorithm instrumentation helper
      languages.ts                # Language type + labels for the Code tab switcher
      *-shared.ts                 # Sample inputs/targets shared within a family (search, tree, avl)
    graph/                        # Graph data type, sample graph, random/custom graph generation
    tree/
      layout.ts                   # Tree -> screen-coordinate layout engine (+ node heights)
      tree-step-recorder.ts       # Tree-algorithm instrumentation helper (deep-clones per step)
    visualizer/
      layout-stability.ts         # computeMax* helpers - reserve worst-case panel space up front
      comparison-stats.ts         # Derives running comparisons/swaps/etc. from a Step[] prefix
    utils.ts                      # cn() - clsx + tailwind-merge
  components/
    visualizer/                   # Renderers: ArrayBars, GraphView, TreeView, legends, panels
    algorithm-page/                # Tab content + input controls for a single algorithm page
    compare/                      # Comparison Mode's two-column layout + stats
    home/                         # Homepage cards, category sections, search
    ui/                           # shadcn primitives (button, tabs, select, card, slider)
  hooks/
    use-playback.ts               # Single-algorithm play/pause/step/speed state machine
    use-comparison-playback.ts    # Same, but drives two independent step arrays in lockstep
```

## The Step model

Everything in this app funnels through one type, `Step` (`src/types/step.ts`). An algorithm implementation is a pure function `(input, target?) => Step[]` — it runs to completion up front, producing an ordered array of frames. The visualizer is just a `currentIndex` into that array; playback is nothing more than moving the index on a timer.

```ts
type Step = {
  stepIndex: number;
  lineOfCode: number;          // which line of the shown code this step highlights
  description: string;         // plain-English explanation
  variables: Record<string, unknown>;
  pointers?: Record<string, number>;      // named pointers (lo, hi, mid, i, j, ...) on array indices
  comparing?: [number, number];           // array indices currently being compared
  swapping?: [number, number];
  comparisonMade?: boolean;               // for stats-counting even when comparing can't
  dividers?: { index: number; depth: number }[];  // divide-and-conquer split lines, depth-tapered
  activeRange?: [number, number];         // search algorithms' remaining candidate range
  currentNode?: string;                   // graph OR tree node currently being processed
  currentEdge?: [string, string];
  comparisonResult?: "left" | "right" | "found" | "not-found";  // tree walk outcome
  rotation?: { type: "left" | "right" | "left-right" | "right-left"; pivotNodeId: string }; // AVL
  dataStructureState?: DataStructureState;
};
```

`DataStructureState` is the algorithm's full snapshot at that step: `array`, `sortedIndices`, `foundIndex`, `stack`/`queue`/`priorityQueue`, `visitedNodes`, `treeEdges` (graph discovery tree), `callStack`, and the tree-specific fields `tree` (a full `TreeNode` snapshot), `treeVisitedPath`, `treeFoundId`.

Renderer components read **only** these fields. None of them know which algorithm produced a step — `ArrayBars` doesn't know if it's rendering Bubble Sort or Binary Search, `TreeView` doesn't know if it's rendering a BST or an AVL tree. This is what let every new algorithm category (Graph, then Tree) get added without touching the rendering layer's core logic, only extending the `Step` type with a few new optional fields each time.

### `TreeNode`

Also defined in `step.ts` (not alongside `Graph` in `lib/graph/`), because a tree's *shape* changes step to step — Insert grows it, Delete shrinks it, AVL rotates it — whereas a `Graph`'s shape is fixed input the algorithm only ever reads. `TreeNode` is `{ id, value, left, right }`; `id` is assigned once at insert time and stays stable across steps even if a rotation or a two-child delete changes which value sits where, which is what lets React key tree nodes correctly across re-layouts.

## Instrumentation: the `*StepRecorder` classes

Hand-writing `Step` objects inline in every algorithm would be repetitive and error-prone, so each algorithm family has a small recorder class that owns the bookkeeping and exposes a `record(...)` call:

- **`StepRecorder`** (array algorithms) — tracks the call stack, `sortedIndices`, `foundIndex`, and divide-and-conquer divider depth. Shallow-copies the array on every `record()` so a later in-place mutation can never retroactively change an already-recorded step's snapshot.
- **`GraphStepRecorder`** — tracks the call stack, visited set, and a predecessor map it derives `treeEdges` from.
- **`TreeStepRecorder`** — tracks the call stack, ordered visited path, found node id, and optionally a queue (for Level-order). **Deep**-clones the tree on every `record()` call, which matters more here than the array recorder's shallow copy: tree algorithms are naturally written by mutating real `Node` objects in place (`node.left = new Node(value)`), so without a deep clone every earlier step's `tree` would keep pointing at the same mutating object graph and end up showing the *final* tree everywhere instead of each step's true point-in-time snapshot.

A recurring problem across Insert/Delete on both BST and AVL: the idiomatic recursive pattern (`node.left = insert(node.left, value)`) only updates the parent's pointer once the whole recursive call returns — too late to record a step showing the tree with that change already visible. Every insert/delete/rotation implementation solves this the same way: an explicit `setter` callback is threaded through the recursion and invoked *immediately before* the `record()` call that depends on it, so a step's tree snapshot is always mutated-then-recorded, never the other way around. This also generalizes to the root itself (which has no parent object to mutate through — its "setter" just reassigns the outer `root` variable).

## The catalog

`src/lib/algorithms/catalog.ts` is the single source of truth. Every algorithm is one entry in `ALGORITHM_CATALOG: Record<string, AlgorithmMeta>`, where:

```ts
type AlgorithmMeta = ArrayAlgorithmMeta | GraphAlgorithmMeta | TreeAlgorithmMeta;
```

Each variant carries a `kind` (`"array" | "graph" | "tree"`), the algorithm's category/difficulty/complexity/prose content, its 3-language `sources` and `pseudocode` (kept line-for-line identical so one `lineOfCode` highlights the correct line regardless of which language is shown), sample input, and a `run()` function with a kind-specific signature:

- array: `(input: number[], target?: number) => Step[]`
- graph: `(graph: Graph, start: string) => Step[]`
- tree: `(values: number[], target?: number) => Step[]` — `values` is the insert sequence that builds the starting tree

`runAlgorithmWithInput(algorithm, input, target?)` is the one place that dispatches on `kind`; every caller (the single algorithm page, Comparison Mode) goes through it instead of re-deriving the kind-specific call shape itself. `getAlgorithmsByCategory` sorts within a category by difficulty (Easy → Medium → Hard, stable on ties by catalog insertion order). `CATEGORY_ORDER` controls homepage section order.

Adding a new algorithm to an existing kind means: write the algorithm file (pseudocode + sources + `run()`), add one catalog entry, done — `generateStaticParams()`, the homepage, and Comparison Mode's pairing logic all pick it up automatically with no further wiring.

## Tree-specific pieces

### Layout engine (`lib/tree/layout.ts`)

Trees need actual x/y coordinates to render as SVG, unlike `Graph` (whose sample data ships with fixed coordinates) or arrays (positioned by a CSS flex row). `layoutTree()` walks a `TreeNode` and assigns:

- **x** by inorder index — a BST's inorder walk visits values strictly left-to-right, so consecutive inorder positions can never belong to overlapping subtrees. This guarantees zero overlap for any BST/AVL shape without a general-purpose tree layout algorithm (e.g. Reingold–Tilford), as a free consequence of the BST invariant itself.
- **y** by depth.
- **`subtreeHeight`** on every node (empty = 0, leaf = 1) as a byproduct of the same walk — this is what powers the AVL balance-factor badge (`left.subtreeHeight - right.subtreeHeight`), computed once here rather than separately inside every AVL algorithm.

`TreeView` (`components/visualizer/tree-view.tsx`) consumes this layout and renders nodes/edges as SVG, coloring nodes by priority (`found` > `current` > `visited` > `default`) and optionally drawing the balance-factor badge (`showBalanceFactor` prop, on only for `avl-*` pages).

### Reserved canvas space

Per a standing layout-stability rule applied throughout the app (see `lib/visualizer/layout-stability.ts`), a panel's size should reflect the *worst case across the whole run*, not whatever the current step happens to need — otherwise the layout jumps around as playback advances. `computeMaxTreeExtent(steps)` runs `layoutTree` over every step once and returns the largest width/height seen; `TreeView` takes that as `reservedWidth`/`reservedHeight` and centers a smaller current tree within that fixed canvas rather than rescaling per step. The same pattern (`computeMaxPointerStack`, `computeMaxCallStackDepth`, `computeMaxLinearItems`) reserves space for the array pointer row, the call stack panel, and queue/stack chip rows.

### AVL rotations

AVL Insert and Delete both do the standard BST operation first, then walk back up re-checking every ancestor's balance factor, rotating (single or double) whenever it falls outside `[-1, 1]`. Rotation is visualized as two-plus discrete steps rather than a single jump-cut: one step reveals the out-of-range balance factor (`step.currentNode` on the unbalanced node), then one step per actual rotation performed (a double rotation — left-right or right-left — shows the intermediate state after the first rotation before the second). `step.rotation` is populated on these steps for data-model completeness; the visible animation itself comes for free from `TreeView`'s per-node `transition-all` class animating each node's new x/y position after the snapshot changes, not from any dedicated rotation-specific rendering code.

Insert only ever needs one rotation to fully restore balance (a known AVL property); Delete can require rotations at multiple ancestor levels for a single deletion, which is why the rebalance check runs unconditionally on every stack frame as the recursion unwinds rather than stopping after the first fix.

## Rendering layer

Each `kind` has its own visualization tab component (`VisualizationTab`, `GraphVisualizationTab`, `TreeVisualizationTab`), selected in `AlgorithmPageClient` by `algorithm.kind`. They share a layout shape: a responsive grid (single column below `lg`) with the visualization + input controls + playback controls in one region, pseudocode in another, and an auxiliary panel (call stack and/or queue) in a third — the auxiliary column collapses entirely when an algorithm populates neither (e.g. Linear Search, Bubble Sort), letting pseudocode reclaim that width instead of leaving a gap. Column proportions are set via explicit CSS grid fractional tracks (`grid-cols-[2fr_2fr_0.85fr]`) rather than `grid-cols-N` + `col-span`, since the ratio isn't a whole number.

Shared, algorithm-agnostic panels used across all three tabs: `PlaybackControls`, `CodeTab` (syntax-highlight-free code display with active-line scroll-into-view), `CallStackPanel`, `LinearStatePanel` (generic queue/stack/priority-queue chip row), and per-kind legends (`StateLegend`, `GraphStateLegend`, `TreeStateLegend`) that switch their displayed states by a `variant` prop rather than needing a distinct component per algorithm.

## Comparison Mode

`src/app/compare/page.tsx` → `ComparisonPageClient`. Two algorithms (A and B) are selected independently, but B's options are filtered to algorithms sharing A's `kind` **and** `category` — different categories don't share enough structure (e.g. Sorting has no search target, Searching has no "sorted" completion state) for a side-by-side comparison to mean anything. Input (array/graph/tree values, and a target if either side uses one) is owned once by the page and fed to both sides identically, since the entire point is running two algorithms on the *same* data. `useComparisonPlayback` drives both step arrays on one shared timeline, clamping each side's index independently so a shorter run simply stops while the longer one keeps playing. Live stats (`lib/visualizer/comparison-stats.ts`) derive comparisons/swaps/recursive-calls/peak-aux-items by scanning each side's steps up to the current index — nothing is separately tracked at runtime.

## Styling

Tailwind v4 with design tokens defined as CSS custom properties in `globals.css` (`--chart-1` through `--chart-5`, `--destructive`, badge/pastel colors for difficulty levels). Visualizer state colors follow one consistent language across categories: `chart-1` = untouched/default, `chart-4` = under consideration/comparing, `chart-2` = actively processing/current/swapping, `chart-3` = settled/sorted/found/visited. Reusing `chart-3` for multiple "settled" semantics (sorted, found, visited) is intentional — those states never co-occur on the same page, so the shared color never causes ambiguity.
