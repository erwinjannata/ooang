"use client";

import FloatingButton from "@/components/custom/Button/FloatingButton";
import CustomAlertDialog from "@/components/custom/Dialog/customAlertDialog";
import EditIncomeDialog from "@/components/custom/Dialog/income/editIncome";
import NewIncomeDialog from "@/components/custom/Dialog/income/newIncome";
import { getIncomeColumn } from "@/components/custom/Table/columns/income";
import DataTable from "@/components/custom/Table/dataTable";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { IncomeRow, IncomeUpdate } from "@/types/income";
import { PaginationType } from "@/types/paginations";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteIncome, fetchIncome } from "./actions";

function IncomePage() {
  const [income, setIncome] = useState<IncomeRow[]>([]);
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
  const [selected, setSelected] = useState<IncomeUpdate | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await fetchIncome({ pagination: pagination });
      if (!results.success) {
        toast.error(results.message);
      }
      setLoading(false);
      setIncome(results.data || []);
      setPagination((prev) => ({
        ...prev,
        hasNextPage: results.hasNextPage!,
        hasPrevPage: results.hasPrevPage!,
      }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, refresh]);

  const handleEdit = (selected: IncomeUpdate) => {
    setSelected(selected);
    setShowEditDialog(true);
  };

  const handleDelete = async (selected: IncomeRow) => {
    await setSelected(selected);
    setShowDeleteDialog(true);
  };

  const onDelete = async () => {
    setLoading(true);
    const results = await deleteIncome({ selected: selected! });
    setLoading(false);
    if (!results.success) {
      toast.error(results.message);
    } else {
      toast.success(results.message);
      setShowDeleteDialog(false);
      setRefresh((r) => r + 1);
    }
  };

  const incomeColumns = getIncomeColumn({
    handleEdit,
    handleDelete,
  });

  return (
    <div>
      {loading ? (
        <Spinner className="items-center justify-items-center mx-auto" />
      ) : (
        <div className="bg-white shadow-md rounded-md p-4">
          <DataTable
            columns={incomeColumns}
            data={income}
            searchColumn="title"
            pagination={pagination}
            setPagination={setPagination}
            loading={loading}
          />
        </div>
      )}

      <FloatingButton
        size={useIsMobile() ? "icon-lg" : "lg"}
        onClick={() => setShowNewDialog(true)}
      >
        <Plus className="w-10 h-10" /> {!useIsMobile() && "Record Income"}
      </FloatingButton>
      <NewIncomeDialog
        open={showNewDialog}
        setOpen={setShowNewDialog}
        setRefresh={setRefresh}
      />
      <EditIncomeDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        selected={selected!}
        setRefresh={setRefresh}
      />
      <CustomAlertDialog
        open={showDeleteDialog}
        onOpen={setShowDeleteDialog}
        title="Remove expenses"
        onAction={() => onDelete()}
      >
        Proceed to remove <span className="font-medium">{selected?.title}</span>{" "}
        income record? This action cannot be undone
      </CustomAlertDialog>
    </div>
  );
}

export default IncomePage;
