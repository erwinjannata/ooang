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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toLocDate } from "@/hooks/toLocDate";
import { receiveableBadge } from "@/lib/constants/receiveableBadge";
import { cn } from "@/lib/utils";
import { DebtsRow, DebtsUpdate } from "@/types/debts";
import { ColumnDef } from "@tanstack/react-table";
import { Eraser, MoreHorizontal, PenLine, SquareCheckBig } from "lucide-react";

type Props = {
  handleSettlement: (selected: DebtsUpdate) => void;
  handleEdit: (selected: DebtsUpdate) => void;
  handleDelete: (selected: DebtsRow) => Promise<void>;
};

export function getDebtsColumn({
  handleSettlement,
  handleEdit,
  handleDelete,
}: Props): ColumnDef<DebtsRow>[] {
  return [
    {
      accessorKey: "title",
      header: () => null,
      cell: ({ row }) => {
        const debt = row.original;
        const { variant, className } =
          receiveableBadge[debt.status as keyof typeof receiveableBadge];

        return (
          <Card className="w-full border-none shadow-md hover:bg-neutral-200 hover:shadow-neutral-100">
            <CardContent>
              <div className="flex flex-row justify-between w-full">
                <div className="flex items-center gap-1 justify-start">
                  <span className="font-medium text-xl">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(parseFloat(debt.amount?.toString() || "0"))}
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
                      <DropdownMenuItem
                        onClick={() => handleSettlement(debt)}
                        disabled={debt.status === "paid"}
                      >
                        <SquareCheckBig />
                        Settle
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(debt)}>
                        <PenLine />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(debt)}
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
                  <div className="flex flex-col gap-2">
                    <CardTitle className="flex items-center gap-1 text-md">
                      <p className="truncate w-40 md:w-full">{debt.title}</p>
                    </CardTitle>
                    <CardDescription className="uppercase">
                      <Badge
                        variant={variant}
                        className={cn("rounded-sm", className)}
                      >
                        {debt.status}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-2 justify-end items-end">
                    <CardTitle className="flex gap-1 text-md">
                      {debt.spentSaving?.name || "-"}
                    </CardTitle>
                    <CardDescription className="capitalize">
                      {toLocDate(debt.created_at)}
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
