import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top_left,var(--grad-1)_0%,transparent_80%),radial-gradient(ellipse_at_bottom_right,var(--grad-2)_0%,transparent_80%)] bg-background p-6 selection:bg-primary/30 selection:text-primary overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-accent/10 blur-[100px]" />

      <main className="glass-morphism relative flex w-full max-w-4xl flex-col items-center gap-12 rounded-[40px] p-8 md:p-20 shadow-2xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 animate-bounce-slow">
            <TrendingUp className="h-10 w-10" />
          </div>
          <h1 className="text-6xl font-black tracking-tighter md:text-8xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            Trade<span className="text-primary">.OS</span>
          </h1>
        </div>

        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-4xl max-w-2xl">
            Precision analytics for the modern trader.
          </h2>
          <p className="max-w-xl text-lg font-medium text-muted-foreground leading-relaxed">
            A high-performance trading journal built with focus and institutional clarity. Track your edge, manage your psychology, and scale your alpha.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row w-full justify-center">
          <Button size="lg" className="h-16 px-10 text-xl rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform" asChild>
            <Link href="/dashboard">
              Launch Dashboard
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-16 px-10 text-xl rounded-2xl bg-background/50 backdrop-blur-sm hover:scale-105 transition-transform" asChild>
            <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
              Documentation
            </a>
          </Button>
        </div>

        <div className="w-full border-t border-border/30 pt-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: "Status", value: "Operational" },
              { label: "Version", value: "v2.1.0-Glass" },
              { label: "Latency", value: "0.8ms" },
              { label: "Alpha", value: "Enhanced" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2.5 font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-lg font-bold tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <p className="mt-10 text-2.5 font-bold uppercase tracking-widest opacity-40">
        © 2026 Analytical Systems Corp • All Rights Reserved
      </p>
    </div>
  );
}

