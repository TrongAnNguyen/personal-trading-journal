import {
  LayoutDashboard,
  Plus,
  Settings,
  Tags,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-background flex">
      {/* Sidebar */}
      <aside className="bg-card fixed top-0 bottom-0 left-0 hidden w-64 border-r md:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <TrendingUp className="text-primary h-6 w-6" />
            <span className="text-lg font-semibold">TradeJournal</span>
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
                <Link href="/dashboard/accounts">
                  <Wallet className="h-4 w-4" />
                  Accounts
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href="/dashboard/tags">
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
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:pl-64">
        <div className="container max-w-6xl py-6">{children}</div>
      </main>
    </div>
  );
}
