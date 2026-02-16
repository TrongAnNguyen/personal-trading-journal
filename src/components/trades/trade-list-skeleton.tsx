import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TradeListSkeleton() {
  return (
    <div className="glass-morphism rounded-3xl overflow-hidden">
      <Table>
        <TableHeader className="bg-primary/5">
          <TableRow className="hover:bg-transparent border-border/30">
            <TableHead className="w-30 font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 pl-6">Symbol</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Side</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Entry</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Exit</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Qty</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">PnL</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">R:R</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Date</TableHead>
            <TableHead className="w-20 pr-6"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="border-border/20">
              <TableCell className="py-4 pl-6">
                <Skeleton className="h-5 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-12 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-10" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-24" />
              </TableCell>
              <TableCell className="pr-6">
                <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
