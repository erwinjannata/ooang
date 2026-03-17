import { Badge } from "@/components/ui/badge";
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
import { expenseBadge } from "@/lib/constants/expenseBadge";
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
        const { variant, className } =
          expenseBadge[expense.category as keyof typeof expenseBadge];

        return (
          <Card className="w-full border-none shadow-md hover:bg-neutral-200 hover:shadow-neutral-100">
            <CardContent>
              <div className="flex flex-row justify-between w-full">
                <div className="flex items-center gap-1 justify-start">
                  <span className="font-medium text-xl">
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
                  <div className="flex flex-col gap-2.5">
                    <CardDescription className="uppercase">
                      <Badge variant={variant} className={className}>
                        {expense.category}
                      </Badge>
                    </CardDescription>
                    <CardTitle className="flex items-center gap-1 text-md">
                      <p className="truncate w-40 md:w-full">{expense.title}</p>
                    </CardTitle>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-2.5 justify-end items-end">
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
