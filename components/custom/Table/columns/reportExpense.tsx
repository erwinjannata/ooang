import { Badge } from "@/components/ui/badge";
import { toLocDate } from "@/hooks/toLocDate";
import { expenseBadge } from "@/lib/constants/expenseBadge";
import { cn } from "@/lib/utils";
import { ExpensesRow } from "@/types/expenses";
import { ColumnDef } from "@tanstack/react-table";

export function getExpensesReportColumn(): ColumnDef<ExpensesRow>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const expense = row.original;
        const { variant, className } =
          expenseBadge[expense.category as keyof typeof expenseBadge];

        return (
          <Badge
            variant={variant}
            className={cn("rounded-sm uppercase", className)}
          >
            {expense.category}
          </Badge>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      id: "savingName",
      header: "Spent From",
      cell: ({ row }) => {
        const expense = row.original;

        return <div className="uppercase">{expense.saving?.name}</div>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => {
        const expense = row.original;

        return <span>{toLocDate(expense.created_at)}</span>;
      },
    },
  ];
}
