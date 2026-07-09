import { flattenTree, layoutTree } from "@/lib/tree/layout";
import type { Step } from "@/types/step";

const NODE_RADIUS = 20;
const PADDING = 32;

type TreeViewProps = {
  step: Step;
  /** Largest layout extent across the whole run (computeMaxTreeExtent),
   * in the same units as layoutTree's width/height. Insert grows a tree
   * and Delete shrinks one - without this, the canvas would resize every
   * step, and an early small tree would get rescaled to fill whatever
   * viewBox that one step happened to produce instead of sitting
   * appropriately small within a canvas sized for the run's largest
   * tree. Defaults to 0 (size purely to the current step) for callers
   * that only ever show one static tree, or haven't computed this yet. */
  reservedWidth?: number;
  reservedHeight?: number;
};

export function TreeView({ step, reservedWidth = 0, reservedHeight = 0 }: TreeViewProps) {
  const tree = step.dataStructureState?.tree ?? null;
  const { root, width, height } = layoutTree(tree);

  if (!root) {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
        Empty tree
      </div>
    );
  }

  const { nodes, edges } = flattenTree(root);
  const visited = new Set(step.dataStructureState?.treeVisitedPath ?? []);
  const foundId = step.dataStructureState?.treeFoundId;

  // Reserved space is split evenly left/right so a smaller-than-reserved
  // tree centers within the canvas rather than sitting flush left.
  // Vertically it's not centered - the root always sits near the top, so
  // any extra reserved height should just extend downward, the same way
  // a shorter tree's missing depth would.
  const canvasWidth = Math.max(width, reservedWidth);
  const canvasHeight = Math.max(height, reservedHeight);
  const xOffset = (canvasWidth - width) / 2;
  const viewBoxX = -PADDING - xOffset;
  const viewBoxY = -PADDING;
  const viewBoxWidth = canvasWidth + PADDING * 2;
  const viewBoxHeight = canvasHeight + PADDING * 2;

  return (
    <div className="flex h-56 items-center justify-center rounded-lg bg-muted/50 p-4">
      {/* h-full and w-full together (not just w-full + a max-height cap)
          matter here: with only a width set, the browser derives the
          svg's height from the viewBox's aspect ratio, which for a
          near-square viewBox (a shallow or single-node tree) in a wide
          container produces a height far taller than this h-56 box -
          the content then overflows instead of being clipped/scaled to
          fit. Setting both dimensions explicitly lets the default
          preserveAspectRatio (xMidYMid meet) scale the viewBox to fit
          within the given box on whichever axis is tighter. */}
      <svg viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`} className="h-full w-full">
        {edges.map(({ parent, child }) => (
          <line
            key={`${parent.id}-${child.id}`}
            x1={parent.x}
            y1={parent.y}
            x2={child.x}
            y2={child.y}
            strokeWidth={1.5}
            className="edge-default"
          />
        ))}

        {nodes.map((node) => {
          const isFound = node.id === foundId;
          const isCurrent = node.id === step.currentNode;
          const isVisited = visited.has(node.id);
          const nodeClass = isFound
            ? "node-found"
            : isCurrent
              ? "node-current"
              : isVisited
                ? "node-visited"
                : "node-default";

          return (
            <g key={node.id} className="transition-all duration-300">
              <circle
                cx={node.x}
                cy={node.y}
                r={NODE_RADIUS}
                strokeWidth={2.5}
                className={nodeClass}
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className="fill-foreground text-sm font-semibold select-none"
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
