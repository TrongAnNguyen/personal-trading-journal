import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background selection:bg-primary/30 selection:text-primary relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top_left,var(--grad-1)_0%,transparent_80%),radial-gradient(ellipse_at_bottom_right,var(--grad-2)_0%,transparent_80%)] p-6">
      {/* Decorative blurred circles */}
      <div className="bg-primary/10 absolute top-1/4 -left-20 h-96 w-96 rounded-full blur-[100px]" />
      <div className="bg-accent/10 absolute -right-20 bottom-1/4 h-96 w-96 rounded-full blur-[100px]" />

      <main className="glass-morphism relative flex w-full max-w-4xl flex-col items-center gap-12 rounded-[40px] p-8 shadow-2xl md:p-20">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="bg-primary text-primary-foreground shadow-primary/30 animate-bounce-slow flex h-20 w-20 items-center justify-center rounded-3xl shadow-2xl">
            <TrendingUp className="h-10 w-10" />
          </div>
          <h1 className="from-foreground to-foreground/70 bg-linear-to-b bg-clip-text text-6xl font-black tracking-tighter text-transparent md:text-8xl">
            Trade<span className="text-primary">.OS</span>
          </h1>
        </div>

        <div className="space-y-6 text-center">
          <h2 className="max-w-2xl text-2xl font-bold tracking-tight md:text-4xl">
            Precision analytics for the modern trader.
          </h2>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed font-medium">
            A high-performance trading journal built with focus and
            institutional clarity. Track your edge, manage your psychology, and
            scale your alpha.
          </p>
        </div>

        <div className="flex w-full flex-col justify-center gap-6 sm:flex-row">
          <Button
            size="lg"
            className="shadow-primary/20 h-16 rounded-2xl px-10 text-xl shadow-xl transition-transform hover:scale-105"
            asChild
          >
            <Link href="/dashboard">
              Launch Dashboard
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-background/50 h-16 rounded-2xl px-10 text-xl backdrop-blur-sm transition-transform hover:scale-105"
            asChild
          >
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </Button>
        </div>

        <div className="border-border/30 w-full border-t pt-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: "Status", value: "Operational" },
              { label: "Version", value: "v2.1.0-Glass" },
              { label: "Latency", value: "0.8ms" },
              { label: "Alpha", value: "Enhanced" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2.5 text-muted-foreground mb-1 font-bold tracking-widest uppercase">
                  {stat.label}
                </p>
                <p className="text-lg font-bold tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <p className="text-2.5 mt-10 font-bold tracking-widest uppercase opacity-40">
        © 2026 Analytical Systems Corp • All Rights Reserved
      </p>
    </div>
  );
}
