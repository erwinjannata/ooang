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
import { IncomeRow, IncomeUpdate } from "@/types/income";
import { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  Eraser,
  MoreHorizontal,
  PenLine,
  Wallet,
} from "lucide-react";

type Props = {
  handleEdit: (selected: IncomeUpdate) => void;
  handleDelete: (selected: IncomeRow) => Promise<void>;
};

export function getIncomeColumn({
  handleEdit,
  handleDelete,
}: Props): ColumnDef<IncomeRow>[] {
  return [
    {
      accessorKey: "title",
      header: () => null,
      cell: ({ row }) => {
        const income = row.original;

        return (
          <Card className="w-full border-none shadow-md hover:bg-neutral-200 hover:shadow-neutral-100">
            <CardContent>
              <div className="flex flex-row justify-between w-full">
                <div className="flex items-center gap-1 justify-start">
                  <span className="font-medium text-xl">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(parseFloat(income.amount?.toString() || "0"))}
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
                      <DropdownMenuItem onClick={() => handleEdit(income)}>
                        <PenLine />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(income)}
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
              <div className="flex items-end gap-3 justify-between w-full">
                <div className="flex flex-row justify-between w-full">
                  <div className="flex flex-col gap-0.5">
                    <CardTitle className="flex items-center gap-1 text-md">
                      {income.title}
                    </CardTitle>
                    <CardDescription className="capitalize">
                      <span className="flex flex-row items-center gap-2">
                        <Wallet className="w-3 h-3" />
                        {income.saving?.name}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex justify-end items-end">
                    <CardDescription className="flex gap-1 text-md">
                      <span className="flex flex-row gap-2 items-center">
                        <Calendar className="w-3 h-3" />
                        {toLocDate(income.created_at)}
                      </span>
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
