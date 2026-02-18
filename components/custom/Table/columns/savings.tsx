import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toLocDate } from "@/hooks/toLocDate";
import { SavingsRow, SavingsUpdate } from "@/types/savings";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

type Props = {
  handleEdit: (selected: SavingsUpdate) => void;
  handleDelete: (selected: SavingsRow) => Promise<void>;
};

export function getSavingsColumns({
  handleEdit,
  handleDelete,
}: Props): ColumnDef<SavingsRow>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "balance",
      header: ({ column }) => {
        return (
          <Button
            className="uppercase"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Balance
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const savingBalance = parseFloat(row.getValue("balance"));
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(savingBalance);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "created_at",
      header: () => <div className="font-medium">Created at</div>,
      cell: ({ row }) => <div>{toLocDate(row.getValue("created_at"))}</div>,
    },
    {
      accessorKey: "updated_at",
      header: () => <div className="font-medium">Last Updated</div>,
      cell: ({ row }) => <div>{toLocDate(row.getValue("updated_at"))}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const saving = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="capitalize">
                {saving.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEdit(saving)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDelete(saving)}
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
