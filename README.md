# DSA Visualiser

A web app I'm building to make learning Data Structures and Algorithms less about staring at code and more about actually watching it happen.

Most DSA resources either show you the final output of an algorithm or dump a wall of code on you and expect you to trace through it in your head. I wanted something in between — a way to step through an algorithm one move at a time and actually see what's happening to the array, the stack, the queue, whatever, at each point.

## What it does

You pick an algorithm, and instead of just running it, you get:

- A step-by-step visualization you can play, pause, and step through manually
- The actual code, with the current line highlighted as it runs
- A plain-English explanation of what's happening at each step
- Time and space complexity, with a quick comparison to similar algorithms
- A comparison mode to run two algorithms side by side on the same input (e.g. Merge Sort vs Quick Sort) and see how their comparisons, swaps, and runtime stack up against each other

Right now the algorithms covered are:

- Merge Sort
- Quick Sort
- BFS
- DFS
- Dijkstra's Algorithm

Tree and Searching algorithms are on the homepage as "coming soon" — didn't want to spread this too thin before the core visualizer was solid.

## Why I built it this way

Every algorithm run produces a list of "steps" (array state, pointers, what's being compared, call stack, etc.), and the visualizer just renders whatever's in that list. This meant I could build the visualizer once and reuse it for sorting and graph algorithms instead of writing a separate UI for each one.

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (built on Radix)

## Running it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Status

Still a work in progress — building it out algorithm by algorithm rather than trying to do everything at once. Practice quizzes and more algorithms are on the list for later.