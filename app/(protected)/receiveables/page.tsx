"use client";

import FloatingButton from "@/components/custom/Button/FloatingButton";
import CustomAlertDialog from "@/components/custom/Dialog/customAlertDialog";
import InsertReceiveablesDialog from "@/components/custom/Dialog/receiveables/insert";
import UpdateReceiveablesDialog from "@/components/custom/Dialog/receiveables/update";
import { getReceiveablesColumn } from "@/components/custom/Table/columns/receiveables";
import DataTable from "@/components/custom/Table/dataTable";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { PaginationType } from "@/types/paginations";
import { ReceiveableRow, ReceiveableUpdate } from "@/types/receiveables";
import { useAuth } from "@/utils/authProvider";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteReceiveable, fetchReceiveables } from "./actions";

function ReceiveablesPage() {
  const { profile } = useAuth();
  const [receiveables, setReceiveables] = useState<ReceiveableRow[]>([]);
  const [showInsertDialog, setShowInsertDialog] = useState<boolean>(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationType>({
    pageIndex: 0,
    pageSize: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [refresh, setRefresh] = useState<number>(0);
  const [selected, setSelected] = useState<ReceiveableUpdate | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await fetchReceiveables({
        pagination: pagination,
        user_id: profile!.id,
      });

      if (!results.success) {
        toast.error(results.message);
      }

      setLoading(false);
      setReceiveables(results.data || []);
      setPagination((prev) => ({
        ...prev,
        hasNextPage: results.hasNextPage!,
        hasPrevPage: results.hasPrevPage!,
      }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, refresh]);

  const handleEdit = (selected: ReceiveableUpdate) => {
    setSelected(selected);
    setShowUpdateDialog(true);
  };

  const handleDelete = async (selected: ReceiveableRow) => {
    await setSelected(selected);
    setShowDeleteDialog(true);
  };

  const onDelete = async () => {
    setLoading(true);
    const results = await deleteReceiveable({ selected: selected! });
    setLoading(false);
    if (!results.success) {
      toast.error(results.message);
    } else {
      toast.success(results.message);
      setShowDeleteDialog(false);
      setRefresh((r) => r + 1);
    }
  };

  const receiveableColumns = getReceiveablesColumn({
    handleEdit: handleEdit,
    handleDelete: handleDelete,
  });

  return (
    <div>
      {loading ? (
        <Spinner className="items-center justify-items-center mx-auto" />
      ) : (
        <div className="bg-white shadow-md rounded-md p-4">
          <DataTable
            columns={receiveableColumns}
            data={receiveables}
            searchColumn="title"
            pagination={pagination}
            setPagination={setPagination}
            loading={loading}
          />
        </div>
      )}

      <FloatingButton
        size={useIsMobile() ? "icon-lg" : "lg"}
        onClick={() => setShowInsertDialog(true)}
      >
        <Plus className="w-10 h-10" /> {!useIsMobile() && "New Receiveable"}
      </FloatingButton>
      <InsertReceiveablesDialog
        open={showInsertDialog}
        setOpen={setShowInsertDialog}
        setRefresh={setRefresh}
      />
      <UpdateReceiveablesDialog
        open={showUpdateDialog}
        setOpen={setShowUpdateDialog}
        selected={selected!}
        setRefresh={setRefresh}
      />
      <CustomAlertDialog
        open={showDeleteDialog}
        onOpen={setShowDeleteDialog}
        title="Remove receiveable"
        onAction={() => onDelete()}
      >
        Proceed to remove <span className="font-medium">{selected?.title}</span>{" "}
        receiveable record? This action cannot be undone
      </CustomAlertDialog>
    </div>
  );
}

export default ReceiveablesPage;
