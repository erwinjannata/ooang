"use client";

import FloatingButton from "@/components/custom/Button/FloatingButton";
import CustomAlertDialog from "@/components/custom/Dialog/customAlertDialog";
import InsertSavingDialog from "@/components/custom/Dialog/savings/insert";
import UpdateSavingDialog from "@/components/custom/Dialog/savings/update";
import { getSavingsColumns } from "@/components/custom/Table/columns/savings";
import DataTable from "@/components/custom/Table/dataTable";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { PaginationType } from "@/types/paginations";
import { SavingsRow, SavingsUpdate } from "@/types/savings";
import { useAuth } from "@/utils/authProvider";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { disableSaving, fetchSavings } from "./actions";

function SavingPage() {
  const { profile } = useAuth();
  const [savings, setSavings] = useState<SavingsRow[]>([]);
  const [showNewDialog, setShowNewDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showDisableDialog, setShowDisableDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationType>({
    pageIndex: 0,
    pageSize: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [refresh, setRefresh] = useState<number>(0);
  const [selected, setSelected] = useState<SavingsUpdate | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await fetchSavings({
        pagination: pagination,
        user_id: profile!.id,
      });

      if (!results.success) {
        toast.error(results.message);
      }

      setLoading(false);
      setSavings(results.data || []);
      setPagination((prev) => ({
        ...prev,
        hasNextPage: results.hasNextPage!,
        hasPrevPage: results.hasPrevPage!,
      }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, refresh]);

  const handleEdit = (selected: SavingsUpdate) => {
    setSelected(selected);
    setShowEditDialog(true);
  };

  const handleDisable = async (selected: SavingsRow) => {
    await setSelected(selected);
    setShowDisableDialog(true);
  };

  const onDisable = async () => {
    setLoading(true);
    const results = await disableSaving({ selected: selected! });

    setLoading(false);
    if (!results.success) {
      toast.error(results.message);
    } else {
      toast.success(results.message);
      setShowDisableDialog(false);
      setRefresh((r) => r + 1);
    }
  };

  const savingsColumns = getSavingsColumns({
    handleEdit: handleEdit,
    handleDisable: handleDisable,
  });

  return (
    <div>
      {loading ? (
        <Spinner className="items-center justify-items-center mx-auto" />
      ) : (
        <div className="bg-white shadow-md rounded-md p-4">
          <DataTable
            columns={savingsColumns}
            data={savings}
            searchColumn="name"
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
        <Plus className="w-10 h-10" /> {!useIsMobile() && "Register Saving"}
      </FloatingButton>
      <InsertSavingDialog
        open={showNewDialog}
        setOpen={setShowNewDialog}
        setRefresh={setRefresh}
      />
      <UpdateSavingDialog
        selected={selected!}
        open={showEditDialog}
        setOpen={setShowEditDialog}
        setRefresh={setRefresh}
      />
      <CustomAlertDialog
        open={showDisableDialog}
        onOpen={setShowDisableDialog}
        title="Disable saving"
        onAction={() => onDisable()}
      >
        Proceed to {selected?.is_active ? "disable" : "enable"}{" "}
        <span className="font-medium">{selected?.name}</span> saving account?
        You can {selected?.is_active ? "enable" : "disable"} this saving again
        later
      </CustomAlertDialog>
    </div>
  );
}

export default SavingPage;
