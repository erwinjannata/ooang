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
import { ReceiveableRow, ReceiveableUpdate } from "@/types/receiveables";
import { ColumnDef } from "@tanstack/react-table";
import { Eraser, MoreHorizontal, PenLine, SquareCheckBig } from "lucide-react";

type Props = {
  handleSettlement: (selected: ReceiveableUpdate) => void;
  handleEdit: (selected: ReceiveableUpdate) => void;
  handleDelete: (selected: ReceiveableRow) => Promise<void>;
};

export function getReceiveablesColumn({
  handleSettlement,
  handleEdit,
  handleDelete,
}: Props): ColumnDef<ReceiveableRow>[] {
  return [
    {
      accessorKey: "title",
      header: () => null,
      cell: ({ row }) => {
        const receiveable = row.original;
        return (
          <Card className="w-full border-none shadow-md hover:bg-blue-50 hover:shadow-blue-100">
            <CardContent>
              <div className="flex flex-row justify-between w-full">
                <div className="flex items-center gap-1 justify-start">
                  <span className="font-medium text-lg">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(
                      parseFloat(receiveable.amount?.toString() || "0"),
                    )}
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
                        onClick={() => handleSettlement(receiveable)}
                        disabled={receiveable.status === "settled"}
                      >
                        <SquareCheckBig />
                        Settle
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleEdit(receiveable)}
                        disabled={receiveable.status === "settled"}
                      >
                        <PenLine />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(receiveable)}
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
                      {receiveable.title}
                    </CardTitle>
                    <CardDescription className="capitalize">
                      {receiveable.status}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5 justify-end items-end">
                    <CardTitle className="flex gap-1 text-md">
                      {receiveable.saving_spent?.name}
                    </CardTitle>
                    <CardDescription className="capitalize">
                      {toLocDate(receiveable.created_at)}
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
