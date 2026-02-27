import { BrainCircuit } from "lucide-react";

export const dynamic = "force-dynamic";

export default function KnowledgeBasePage() {
  return (
    <div className="bg-background/50 flex h-full flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="glass-morphism shadow-primary/10 mb-8 flex h-24 w-24 animate-pulse items-center justify-center rounded-3xl shadow-2xl">
        <BrainCircuit className="text-primary h-12 w-12 opacity-40" />
      </div>
      <h3 className="from-foreground to-foreground/50 mb-4 bg-linear-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent">
        Your Second Brain
      </h3>
      <p className="text-muted-foreground/80 max-w-md text-lg leading-relaxed">
        Capture trading strategies, document market patterns, and connect the
        dots. Select a note or create a new one to begin.
      </p>
    </div>
  );
}
