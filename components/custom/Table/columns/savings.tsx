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
              <span className="font-medium text-xl">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(parseFloat(saving.balance?.toString() || "0"))}
              </span>
            </CardContent>
            <CardFooter className="justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-2.5">
                  <CardDescription className="uppercase">
                    {saving.is_active ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      >
                        Inactive
                      </Badge>
                    )}
                  </CardDescription>
                  <CardTitle className="flex items-center gap-1 text-md">
                    {saving.name}
                  </CardTitle>
                </div>
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
            </CardFooter>
          </Card>
        );
      },
    },
  ];
}
