/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PaginationType } from "@/types/paginations";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: PaginationType;
  setPagination?: Dispatch<SetStateAction<PaginationType>>;
  searchColumn: string;
  disablePagination?: boolean;
  disableFilter?: boolean;
  onRowClicked?: (row: any) => void;
  onFilterReset?: (reset: () => void) => void;
  loading?: boolean;
  className?: string;
}

function OldDataTable<TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  searchColumn,
  disablePagination = false,
  disableFilter = false,
  onRowClicked,
  onFilterReset,
  loading = false,
  className,
}: Props<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { columnFilters },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    if (!onFilterReset) return;

    const reset = () => {
      setColumnFilters([]);
      table.getColumn(searchColumn)?.setFilterValue(null);
    };
    onFilterReset(() => reset);
  }, [onFilterReset, searchColumn, table]);

  return (
    <div className={cn("rounded-md p-4", className)}>
      {!disableFilter && (
        <div className="items-center">
          <Input
            placeholder="Cari"
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchColumn)?.setFilterValue(event?.target.value)
            }
            className="mb-2"
            disabled={loading}
          />
        </div>
      )}
      <div className="rounded-md overflow-auto max-h-100">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="uppercase">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (loading) return;
                    onRowClicked?.(row.original!);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-12 text-center font-medium italic"
                >
                  No Results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!disablePagination && (
        <div className="flex flex-row justify-end space-x-2 py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  className="select-none"
                  disabled={!pagination?.hasPrevPage}
                  onClick={() =>
                    setPagination!((prev) => ({
                      ...prev,
                      pageIndex: prev.pageIndex - 1,
                    }))
                  }
                >
                  <ArrowLeft /> Previous
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="ghost"
                  className="select-none"
                  disabled={!pagination?.hasNextPage}
                  onClick={() =>
                    setPagination!((prev) => ({
                      ...prev,
                      pageIndex: prev.pageIndex + 1,
                    }))
                  }
                >
                  Next <ArrowRight />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default OldDataTable;
