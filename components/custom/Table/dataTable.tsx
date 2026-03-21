"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PaginationType } from "@/types/paginations";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationType;
  setPagination: Dispatch<SetStateAction<PaginationType>>;
  searchColumn: string;
  loading?: boolean;
}

function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  searchColumn,
  loading,
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

  return (
    <div className="rounded-md py-4 px-2">
      <div className="items-center mb-4 px-2">
        <InputGroup className="w-full bg-white">
          <InputGroupInput
            placeholder="Search..."
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchColumn)?.setFilterValue(event?.target.value)
            }
            disabled={loading}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {(table.getColumn(searchColumn)?.getFilterValue() as string)
              ? `${table.getRowModel().rows?.length} results`
              : ""}
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="overflow-auto max-h-110">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  Sorry, there&apos;s noting to show here
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {table.getRowModel().rows?.length ? (
        <div className="flex flex-row justify-end space-x-2 py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  className="select-none"
                  disabled={!pagination.hasPrevPage}
                  onClick={() =>
                    setPagination((prev) => ({
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
                  disabled={!pagination.hasNextPage}
                  onClick={() =>
                    setPagination((prev) => ({
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
      ) : null}
    </div>
  );
}

export default DataTable;
