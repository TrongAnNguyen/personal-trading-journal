"use client";

import { getGraph } from "@/lib/actions/knowledge-base";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="text-muted-foreground bg-background/50 flex h-full w-full animate-pulse items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
        <span className="text-sm font-medium tracking-widest uppercase">
          Initializing Neural Network...
        </span>
      </div>
    </div>
  ),
});

interface GraphViewProps {
  selectedId: string | null;
  onClose?: () => void;
}

const GraphView = ({ selectedId, onClose }: GraphViewProps) => {
  const router = useRouter();
  const [data, setData] = useState({ nodes: [], links: [] });
  const { theme } = useTheme();

  const textColor =
    theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";
  const nodeColor = theme === "dark" ? "#6366f1" : "#4f46e5";
  const highlightColor = "#a855f7";
  const tradeNodeColor = "#10b981";

  useEffect(() => {
    getGraph()
      .then((d) => setData(d as any))
      .catch(console.error);
  }, []);

  const handleNodeClick = useCallback(
    (node: any) => {
      router.push(`/dashboard/knowledge-base/\${node.id}`);
      if (onClose) onClose();
    },
    [router, onClose],
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ForceGraph2D
        graphData={data}
        nodeLabel="title"
        nodeColor={(node: any) => {
          if (node.id === selectedId) return highlightColor;
          if (node.type === "trade") return tradeNodeColor;
          return nodeColor;
        }}
        linkColor={() =>
          theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
        }
        nodeRelSize={6}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        onNodeClick={handleNodeClick}
        cooldownTicks={100}
        d3VelocityDecay={0.3}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.title || node.id;
          const fontSize = 11 / globalScale;
          ctx.font = `\${node.id === selectedId ? 'bold' : 'normal'} \${fontSize}px Geist, Inter, sans-serif`;

          const textWidth = ctx.measureText(label).width;
          const padding = 4 / globalScale;
          const bckgDimensions = [
            textWidth + padding * 2,
            fontSize + padding * 2,
          ];

          // Node shadow/glow
          if (node.id === selectedId) {
            ctx.shadowColor = highlightColor;
            ctx.shadowBlur = 15;
          }

          // Rounded background
          ctx.fillStyle =
            theme === "dark"
              ? "rgba(10, 10, 10, 0.85)"
              : "rgba(250, 250, 250, 0.85)";
          const r = 4 / globalScale;
          const x = node.x - bckgDimensions[0] / 2;
          const y = node.y - bckgDimensions[1] / 2;
          const w = bckgDimensions[0];
          const h = bckgDimensions[1];

          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          ctx.lineTo(x + r, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
          ctx.fill();

          ctx.shadowBlur = 0; // reset shadow

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = node.id === selectedId ? highlightColor : textColor;
          ctx.fillText(label, node.x, node.y);

          // Dot indicator
          ctx.beginPath();
          ctx.arc(node.x, node.y - fontSize - 2, 3, 0, 2 * Math.PI, false);
          ctx.fillStyle =
            node.id === selectedId
              ? highlightColor
              : node.type === "trade"
                ? tradeNodeColor
                : nodeColor;
          ctx.fill();
        }}
      />

      {/* Legend & Controls */}
      <div className="pointer-events-none absolute top-6 left-6 flex flex-col gap-4">
        <div className="glass-morphism pointer-events-auto flex flex-col gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md">
          <div className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
            Neural Map Legend
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              <span className="text-xs font-medium">Knowledge Nodes</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-xs font-medium">Trade Executions</span>
            </div>
            <div className="border-border/50 mt-2 flex items-center gap-3 border-t pt-2">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
              <span className="text-xs font-bold text-purple-500">
                Active Node
              </span>
            </div>
          </div>
        </div>
      </div>

      {onClose && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-6 right-6 h-10 w-10 rounded-full border shadow-xl backdrop-blur-md transition-transform hover:scale-110"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default GraphView;
