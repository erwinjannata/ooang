import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toLocDate } from "@/hooks/toLocDate";
import { ReceiveableRow, ReceiveableUpdate } from "@/types/receiveables";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eraser, MoreHorizontal, PenLine } from "lucide-react";

type Props = {
  handleEdit: (selected: ReceiveableUpdate) => void;
  handleDelete: (selected: ReceiveableRow) => Promise<void>;
};

export function getReceiveablesColumn({
  handleEdit,
  handleDelete,
}: Props): ColumnDef<ReceiveableRow>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            className="uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown />
          </Button>
        );
      },
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
      accessorKey: "spend_from",
      header: "Spend From",
      cell: ({ row }) => {
        const receiveable = row.original;

        return (
          <div className="uppercase">{receiveable.saving_spent?.name}</div>
        );
      },
    },
    {
      accessorKey: "save_to",
      header: "Save to",
      cell: ({ row }) => {
        const receiveable = row.original;

        return (
          <div className="uppercase">{receiveable.saving_to?.name || "-"}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="uppercase font-medium">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => <div className="font-medium">Date</div>,
      cell: ({ row }) => <div>{toLocDate(row.getValue("created_at"))}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(expense)}>
                <PenLine />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDelete(expense)}
              >
                <Eraser />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
