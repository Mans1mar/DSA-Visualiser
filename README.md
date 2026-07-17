# DSA Visualiser

A web app for learning Data Structures and Algorithms by watching them run, one step at a time, instead of staring at a wall of code or just a final answer.

Most DSA resources either show you the final output of an algorithm or dump code on you and expect you to trace through it in your head. This sits in between: pick an algorithm, and step through exactly what happens to the array, the tree, the call stack, the queue — whatever that algorithm actually touches — one move at a time.

## What it does

Every algorithm page gives you:

- **A step-by-step visualization** you can play, pause, step forward/backward through, reset, and speed up or slow down
- **Real code** in Java, C++, and Python, with the line driving the current step highlighted as you move through it
- **A plain-English description** of what's happening at each step
- **Time and space complexity**, plus a written comparison to related algorithms in the same category
- **Editable input** — type your own array/tree values or graph edges, or randomize them, and re-run the algorithm on the spot
- **Comparison Mode** — run two algorithms from the same category side by side on identical input and watch their comparisons, swaps, recursive calls, and compute time stack up against each other live

### Algorithms covered

**Sorting** — Merge Sort, Quick Sort, Bubble Sort, Selection Sort, Insertion Sort

**Searching** — Linear Search, Binary Search, Jump Search

**Graph** — Breadth-First Search, Depth-First Search, Dijkstra's Algorithm

**Tree** — Binary Search Trees (Insert, Search, Delete, and all four traversals — Inorder, Preorder, Postorder, Level-order) and AVL Trees (self-balancing Insert and Delete, with rotations visualized as their own steps and a live balance-factor badge on every node)

That's 20 algorithms across 4 categories. A Practice tab exists on every algorithm page but isn't built out yet — it's a placeholder for future hands-on exercises.

## Why it's built this way

Every algorithm implementation is instrumented to produce a flat list of "steps" — array state, pointers, what's being compared, the call stack, a tree snapshot, whatever's relevant — and the visualizer components only ever render whatever's in that list. They have zero algorithm-specific logic. That's what let sorting, graph, and tree algorithms all reuse the same playback controls, code panel, and stats machinery instead of each needing a bespoke UI. See `ARCHITECTURE.md` for the full breakdown of how that's put together.

## Tech stack

- **Next.js** (App Router, static export) — deployed to GitHub Pages, no server
- **TypeScript**
- **React 19**
- **Tailwind CSS v4**
- **shadcn/ui** on **Radix UI**

## Running it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To produce the same static build the site deploys from:

```bash
npm run build
```

Output goes to `out/`.

## Status

The core visualizer, all four algorithm categories (Sorting, Searching, Graph, Tree), and Comparison Mode are built and working. The Practice tab is still a placeholder. For the technical design behind all of this, see `ARCHITECTURE.md`.
