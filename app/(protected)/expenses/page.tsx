"use client";

import FloatingButton from "@/components/custom/Button/FloatingButton";
import DestructiveAlertDialog from "@/components/custom/Dialog/desctuctiveAlertDialog";
import InsertExpenseDialog from "@/components/custom/Dialog/expenses/insert";
import UpdateExpenseDialog from "@/components/custom/Dialog/expenses/update";
import { getExpensesColumn } from "@/components/custom/Table/columns/expenses";
import DataTable from "@/components/custom/Table/dataTable";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExpensesRow, ExpensesUpdate } from "@/types/expenses";
import { PaginationType } from "@/types/paginations";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteExpenses, fetchExpenses } from "./actions";

function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpensesRow[]>([]);
  const [showNewDialog, setShowNewDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationType>({
    pageIndex: 0,
    pageSize: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [refresh, setRefresh] = useState<number>(0);
  const [selected, setSelected] = useState<ExpensesUpdate | null>(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const results = await fetchExpenses({ pagination: pagination });

      if (!results.success) {
        toast.error(results.message);
      }

      setLoading(false);
      setExpenses(results.data || []);
      setPagination((prev) => ({
        ...prev,
        hasNextPage: results.hasNextPage!,
        hasPrevPage: results.hasPrevPage!,
      }));
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, refresh]);

  const expensesColumns = getExpensesColumn({
    handleEdit: (selected: ExpensesUpdate) => {
      setSelected(selected);
      setShowEditDialog(true);
    },
    handleDelete: async (selected: ExpensesRow) => {
      await setSelected(selected);
      setShowDeleteDialog(true);
    },
  });

  return (
    <div>
      {loading ? (
        <Spinner className="items-center justify-items-center mx-auto" />
      ) : (
        <DataTable
          columns={expensesColumns}
          data={expenses}
          searchColumn="title"
          pagination={pagination}
          setPagination={setPagination}
          loading={loading}
        />
      )}

      <FloatingButton
        size={useIsMobile() ? "icon-lg" : "lg"}
        onClick={() => setShowNewDialog(true)}
      >
        <Plus className="w-10 h-10" /> {!useIsMobile() && "Record Expense"}
      </FloatingButton>
      <InsertExpenseDialog
        open={showNewDialog}
        setOpen={setShowNewDialog}
        setRefresh={setRefresh}
      />
      <UpdateExpenseDialog
        selected={selected!}
        open={showEditDialog}
        setOpen={setShowEditDialog}
        setRefresh={setRefresh}
      />
      <DestructiveAlertDialog
        open={showDeleteDialog}
        onOpen={setShowDeleteDialog}
        title="Remove Expense record?"
        onAction={async () => {
          setLoading(true);
          const results = await deleteExpenses({ selected: selected! });

          setLoading(false);
          if (!results.success) {
            toast.error(results.message);
          } else {
            toast.success(results.message);
            setShowDeleteDialog(false);
            setRefresh((r) => r + 1);
          }
        }}
      />
    </div>
  );
}

export default ExpensesPage;
