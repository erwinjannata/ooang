import { updateExpenses } from "@/app/(protected)/expenses/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExpenseCategory } from "@/lib/constants/expenseCategory";
import { ExpensesFormData, expensesSchema } from "@/schemas/forms/expenses";
import { ExpensesUpdate } from "@/types/expenses";
import { useAuth } from "@/utils/authProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CurrencyInput from "../../Input/CurrencyInput";
import CustomSelect from "../../Select/select";

type Props = {
  selected: ExpensesUpdate;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setRefresh: Dispatch<SetStateAction<number>>;
};

function UpdateExpenseDialog({ selected, open, setOpen, setRefresh }: Props) {
  const { profile, savings } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<ExpensesFormData>({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      title: "",
      amount: 0,
      category: "",
      spend_from: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open && selected) {
      form.reset({
        title: selected.title || "",
        amount: selected.amount || 0,
        category: selected.category || "",
        spend_from: selected.spend_from || "",
        description: selected.description || "",
      });
    }
  }, [selected, form, open]);

  const onSubmit = async (formData: ExpensesFormData) => {
    setLoading(true);
    const result = await updateExpenses({
      data: formData,
      selected: selected!,
    });

    setLoading(false);
    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
      setOpen(false);
      setRefresh((r) => r + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Expense Detail</DialogTitle>
              <DialogDescription>{selected?.title}</DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[60vh] px-2 py-4 grid gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        {...field}
                        {...form.register("title")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <CurrencyInput fieldData={field} loading={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CustomSelect
                        {...field}
                        label="Category"
                        groups={[
                          { label: "Expense Category", items: ExpenseCategory },
                        ]}
                        disabled={loading}
                        onChange={(val) => field.onChange(val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="spend_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saving</FormLabel>
                    <FormControl>
                      <CustomSelect
                        {...field}
                        label="Saving"
                        groups={[
                          {
                            label: `${profile?.display_name}'s savings`,
                            items: savings!.map((saving) => ({
                              label: saving.name.toLocaleUpperCase(),
                              value: saving.id,
                            })),
                          },
                        ]}
                        disabled={loading}
                        onChange={(val) => field.onChange(val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Expense description here..."
                        value={field?.value || ""}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={loading}>
                  <X />
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                onClick={form.handleSubmit(onSubmit)}
              >
                <Save />
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

export default UpdateExpenseDialog;
