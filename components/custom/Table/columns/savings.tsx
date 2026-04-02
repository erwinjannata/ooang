import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SavingsRow, SavingsUpdate } from "@/types/savings";
import { ColumnDef } from "@tanstack/react-table";
import { Captions, CaptionsOff, MoreHorizontal, PenLine } from "lucide-react";

type Props = {
  handleEdit: (selected: SavingsUpdate) => void;
  handleDisable: (selected: SavingsRow) => Promise<void>;
};

export function getSavingsColumns({
  handleEdit,
  handleDisable,
}: Props): ColumnDef<SavingsRow>[] {
  return [
    {
      accessorKey: "name",
      header: () => null,
      cell: ({ row }) => {
        const saving = row.original;
        return (
          <Card className="w-full border-none shadow-md hover:bg-neutral-200 hover:shadow-neutral-100">
            <CardContent>
              <div className="flex flex-row gap-2 justify-between">
                <span className="font-medium text-xl">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(parseFloat(saving.balance?.toString() || "0"))}
                </span>
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
                    <DropdownMenuLabel className="capitalize">
                      {saving.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(saving)}>
                      <PenLine />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant={saving.is_active ? "destructive" : "default"}
                      onClick={() => handleDisable(saving)}
                    >
                      {saving.is_active ? <CaptionsOff /> : <Captions />}
                      {saving.is_active ? "Disable" : "Enable"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-row gap-2 justify-between w-full">
                <CardDescription className="text-md">
                  {saving.name}
                </CardDescription>
                <CardDescription className="flex gap-2">
                  <Badge
                    variant={saving.type === "card" ? "default" : "outline"}
                    className="uppercase rounded-sm"
                  >
                    {saving.type}
                  </Badge>
                  {saving.is_active ? (
                    <Badge
                      variant="ghost"
                      className="uppercase rounded-sm bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="uppercase rounded-sm bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    >
                      Inactive
                    </Badge>
                  )}
                </CardDescription>
              </div>
            </CardFooter>
          </Card>
        );
      },
    },
  ];
}
