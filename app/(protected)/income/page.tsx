"use client";

import FloatingButton from "@/components/custom/Button/FloatingButton";
import DestructiveAlertDialog from "@/components/custom/Dialog/desctuctiveAlertDialog";
import InsertIncomeDialog from "@/components/custom/Dialog/income/insert";
import UpdateIncomeDialog from "@/components/custom/Dialog/income/update";
import CustomSelect from "@/components/custom/Select/select";
import { getIncomeColumn } from "@/components/custom/Table/columns/income";
import DataTable from "@/components/custom/Table/dataTable";
import { Spinner } from "@/components/ui/spinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSavings } from "@/hooks/useSavings";
import { IncomeRow, IncomeUpdate } from "@/types/income";
import { PaginationType } from "@/types/paginations";
import { useAuth } from "@/utils/authProvider";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteIncome, fetchIncome } from "./actions";

function IncomePage() {
  const { savings } = useSavings();
  const { profile } = useAuth();
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
  const [filter, setFilter] = useState({
    saving: "all",
  });
  const [refresh, setRefresh] = useState<number>(0);
  const [selected, setSelected] = useState<IncomeUpdate | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await fetchIncome({
        pagination: pagination,
        filter: filter,
      });
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
  }, [pagination.pageIndex, refresh, filter]);

  const incomeColumns = getIncomeColumn({
    handleEdit: (selected: IncomeUpdate) => {
      setSelected(selected);
      setShowEditDialog(true);
    },
    handleDelete: async (selected: IncomeRow) => {
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
          columns={incomeColumns}
          data={income}
          searchColumn="title"
          pagination={pagination}
          setPagination={setPagination}
          loading={loading}
        >
          <CustomSelect
            label="Saving"
            groups={[
              {
                label: `${profile?.display_name}'s savings`,
                items: savings!.map((saving) => ({
                  label: saving.name,
                  value: saving.id,
                })),
              },
            ]}
            value={filter.saving}
            onChange={(val) =>
              setFilter((prev) => ({ ...prev, saving: val as string }))
            }
            disabled={loading}
            className="bg-white"
            allowAll
            allLabel="All Saving"
          />
        </DataTable>
      )}

      <FloatingButton
        size={useIsMobile() ? "icon-lg" : "lg"}
        onClick={() => setShowNewDialog(true)}
      >
        <Plus className="w-10 h-10" /> {!useIsMobile() && "Record Income"}
      </FloatingButton>
      <InsertIncomeDialog
        open={showNewDialog}
        setOpen={setShowNewDialog}
        setRefresh={setRefresh}
      />
      <UpdateIncomeDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        selected={selected!}
        setRefresh={setRefresh}
      />
      <DestructiveAlertDialog
        open={showDeleteDialog}
        onOpen={setShowDeleteDialog}
        title="Remove Income record?"
        onAction={async () => {
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
        }}
      />
    </div>
  );
}

export default IncomePage;
