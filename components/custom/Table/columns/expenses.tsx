import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toLocDate } from "@/hooks/toLocDate";
import { ExpensesRow, ExpensesUpdate } from "@/types/expenses";
import { ColumnDef } from "@tanstack/react-table";
import { Eraser, MoreHorizontal, PenLine } from "lucide-react";

type Props = {
  handleEdit: (selected: ExpensesUpdate) => void;
  handleDelete: (selected: ExpensesRow) => Promise<void>;
};

export function getExpensesColumn({
  handleEdit,
  handleDelete,
}: Props): ColumnDef<ExpensesRow>[] {
  return [
    {
      accessorKey: "title",
      header: () => null,
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <Card className="w-full border-none shadow-md hover:bg-blue-50 hover:shadow-blue-100">
            <CardContent>
              <div className="flex flex-row justify-between w-full">
                <div className="flex items-center gap-1 justify-start">
                  <span className="font-medium text-lg">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(parseFloat(expense.amount?.toString() || "0"))}
                  </span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="link"
                        className="h-8 w-8 p-0 hover:bg-white"
                      >
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
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
              <div className="flex items-center gap-3 justify-between w-full">
                <div className="flex flex-row justify-between w-full">
                  <div className="flex flex-col gap-0.5">
                    <CardTitle className="flex items-center gap-1 text-md">
                      {expense.title}
                    </CardTitle>
                    <CardDescription className="capitalize">
                      {expense.category}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5 justify-end items-end">
                    <CardTitle className="flex gap-1 text-md">
                      {expense.saving?.name}
                    </CardTitle>
                    <CardDescription className="capitalize">
                      {toLocDate(expense.created_at)}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        );
      },
    },
  ];
}
