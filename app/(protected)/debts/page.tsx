"use client";

import FloatingButton from "@/components/custom/Button/FloatingButton";
import InsertDebtDialog from "@/components/custom/Dialog/debts/insert";
import SettleDebtDialog from "@/components/custom/Dialog/debts/settlement";
import UpdateDebtDialog from "@/components/custom/Dialog/debts/update";
import DestructiveAlertDialog from "@/components/custom/Dialog/desctuctiveAlertDialog";
import { getDebtsColumn } from "@/components/custom/Table/columns/debts";
import DataTable from "@/components/custom/Table/dataTable";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { DebtsRow, DebtsUpdate } from "@/types/debts";
import { PaginationType } from "@/types/paginations";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteDebts, fetchDebts } from "./actions";

function DebtsPage() {
  const [debts, setDebts] = useState<DebtsRow[]>([]);
  const [showNewDialog, setShowNewDialog] = useState<boolean>(false);
  const [showSettleDialog, setShowSettleDialog] = useState<boolean>(false);
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
  const [selected, setSelected] = useState<DebtsUpdate | null>(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const results = await fetchDebts({ pagination: pagination });

      if (!results.success) {
        toast.error(results.message);
      }

      setLoading(false);
      setDebts(results.data || []);
      setPagination((prev) => ({
        ...prev,
        hasNextPage: results.hasNextPage!,
        hasPrevPage: results.hasPrevPage!,
      }));
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, refresh]);

  const columns = getDebtsColumn({
    handleSettlement: async (selected: DebtsUpdate) => {
      setSelected(selected);
      setShowSettleDialog(true);
    },
    handleEdit: async (selected: DebtsUpdate) => {
      setSelected(selected);
      setShowEditDialog(true);
    },
    handleDelete: async (selected: DebtsRow) => {
      setSelected(selected);
      setShowDeleteDialog(true);
    },
  });

  return (
    <div>
      {loading ? (
        <Spinner className="items-center justify-items-center mx-auto" />
      ) : (
        <DataTable
          columns={columns}
          data={debts}
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
        <Plus className="w-10 h-10" /> {!useIsMobile() && "Record Debt"}
      </FloatingButton>
      <InsertDebtDialog
        open={showNewDialog}
        setOpen={setShowNewDialog}
        setRefresh={setRefresh}
      />
      <SettleDebtDialog
        selected={selected!}
        open={showSettleDialog}
        setOpen={setShowSettleDialog}
        setRefresh={setRefresh}
      />
      <UpdateDebtDialog
        selected={selected!}
        open={showEditDialog}
        setOpen={setShowEditDialog}
        setRefresh={setRefresh}
      />
      <DestructiveAlertDialog
        open={showDeleteDialog}
        onOpen={setShowDeleteDialog}
        title="Remove Debt record?"
        onAction={async () => {
          setLoading(true);
          const results = await deleteDebts({ selected: selected! });
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

export default DebtsPage;
