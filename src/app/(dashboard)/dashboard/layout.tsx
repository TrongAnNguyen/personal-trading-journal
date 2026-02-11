import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  Wallet,
  Tags,
  Plus,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-card md:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">TradeJournal</span>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/dashboard/trades">
                  <TrendingUp className="h-4 w-4" />
                  Trades
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/accounts">
                  <Wallet className="h-4 w-4" />
                  Accounts
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/tags">
                  <Tags className="h-4 w-4" />
                  Tags
                </Link>
              </Button>
            </div>

            <Separator className="my-4" />

            <Button className="w-full gap-2" asChild>
              <Link href="/dashboard/trades/new">
                <Plus className="h-4 w-4" />
                New Trade
              </Link>
            </Button>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              asChild
            >
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container max-w-6xl py-6">{children}</div>
      </main>
    </div>
  );
}
