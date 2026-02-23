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
    <div className="glass-morphism overflow-hidden rounded-3xl">
      <Table>
        <TableHeader className="bg-primary/5">
          <TableRow className="border-border/30 hover:bg-transparent">
            <TableHead className="text-muted-foreground w-30 py-5 pl-6 text-xs font-bold tracking-wider uppercase">
              Symbol
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Side
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Entry
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Exit
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Qty
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              PnL
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              R:R
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Status
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Date
            </TableHead>
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
                <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
