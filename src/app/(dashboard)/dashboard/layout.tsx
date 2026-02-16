"use client";

import {
  LayoutDashboard,
  Plus,
  Settings,
  Tags,
  TrendingUp,
  Wallet,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/trades", icon: TrendingUp, label: "Trades" },
    { href: "/dashboard/accounts", icon: Wallet, label: "Accounts" },
    { href: "/dashboard/tags", icon: Tags, label: "Tags" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top_left,var(--grad-1)_0%,transparent_70%),radial-gradient(ellipse_at_bottom_right,var(--grad-2)_0%,transparent_70%)] bg-background text-foreground transition-colors duration-500">
      {/* Sidebar Navigation */}
      <aside className="glass-morphism fixed left-4 top-4 bottom-4 z-50 hidden w-64 flex-col rounded-3xl p-6 lg:flex">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Trade.OS</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 pt-6">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-2xl px-4 py-6 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </Button>

          <Button className="w-full gap-2 rounded-2xl py-6 shadow-lg shadow-primary/20" asChild>
            <Link href="/dashboard/trades/new">
              <Plus className="h-5 w-5" />
              New Trade
            </Link>
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="glass-morphism fixed top-4 left-4 right-4 z-40 flex h-16 items-center justify-between rounded-2xl px-6 lg:hidden">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="font-bold">Trade.OS</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-xl"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 pt-24 pb-32 lg:pl-80 lg:pt-8 lg:pb-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>

      {/* Mobile Navigation (Floating Bottom) */}
      <nav className="glass-morphism fixed bottom-6 left-6 right-6 z-50 flex h-16 items-center justify-around rounded-2xl px-2 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/dashboard/trades/new"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25"
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">New Trade</span>
        </Link>
      </nav>
    </div>
  );
}

