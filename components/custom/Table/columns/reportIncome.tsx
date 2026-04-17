import { toLocDate } from "@/hooks/toLocDate";
import { IncomeRow } from "@/types/income";
import { ColumnDef } from "@tanstack/react-table";

export function getIncomeReportColumn(): ColumnDef<IncomeRow>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
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
      header: "Save to",
      cell: ({ row }) => {
        const income = row.original;

        return <div className="uppercase">{income.saving?.name}</div>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => {
        const income = row.original;

        return <span>{toLocDate(income.created_at)}</span>;
      },
    },
  ];
}
