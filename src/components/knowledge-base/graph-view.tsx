"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="text-muted-foreground flex h-full w-full animate-pulse items-center justify-center">
      Loading Graph Data...
    </div>
  ),
});

const GraphView = ({
  selectedId,
  onNodeClick,
}: {
  selectedId: string | null;
  onNodeClick?: (id: string) => void;
}) => {
  const [data, setData] = useState({ nodes: [], links: [] });
  const { theme } = useTheme();

  const textColor =
    theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";
  const nodeColor = theme === "dark" ? "#818cf8" : "#6366f1";
  const highlightColor = theme === "dark" ? "#c084fc" : "#a855f7";
  const tradeNodeColor = theme === "dark" ? "#34d399" : "#10b981";

  useEffect(() => {
    fetch("/api/kb/graph")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const handleNodeClick = useCallback(
    (node: any) => {
      if (onNodeClick) {
        onNodeClick(node.id);
      }
    },
    [onNodeClick],
  );

  return (
    <div className="bg-background/50 h-full w-full overflow-hidden rounded-xl border shadow-sm">
      <ForceGraph2D
        graphData={data}
        nodeLabel="title"
        nodeColor={(node: any) => {
          if (node.id === selectedId) return highlightColor;
          if (node.type === "trade") return tradeNodeColor;
          return nodeColor;
        }}
        linkColor={() =>
          theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"
        }
        nodeRelSize={6}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        onNodeClick={handleNodeClick}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.title || node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.2,
          ); // some padding

          ctx.fillStyle =
            theme === "dark"
              ? "rgba(0, 0, 0, 0.8)"
              : "rgba(255, 255, 255, 0.8)";
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            bckgDimensions[0],
            bckgDimensions[1],
          );

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = textColor;

          if (node.id === selectedId) {
            ctx.fillStyle = highlightColor;
            ctx.font = `bold ${fontSize}px Sans-Serif`;
          }

          ctx.fillText(label, node.x, node.y);

          // Draw the circle marker back over the text
          ctx.beginPath();
          ctx.arc(node.x, node.y - fontSize, 4, 0, 2 * Math.PI, false);
          ctx.fillStyle =
            node.id === selectedId
              ? highlightColor
              : node.type === "trade"
                ? tradeNodeColor
                : nodeColor;
          ctx.fill();
        }}
        d3VelocityDecay={0.4}
      />
      <div className="bg-background/90 absolute top-4 left-4 flex flex-col gap-2 rounded-lg border p-3 text-xs shadow-sm backdrop-blur">
        <div className="mb-1 font-semibold">Graph Legend</div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-indigo-500"></div> Notes
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500"></div> Trades
        </div>
        <div className="text-muted-foreground mt-1 flex items-center gap-2 border-t pt-2">
          <div className="h-3 w-3 rounded-full border border-current bg-purple-500"></div>{" "}
          Active
        </div>
      </div>
    </div>
  );
};

export default GraphView;
