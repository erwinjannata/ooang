import { insertSaving } from "@/app/(protected)/savings/actions";
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
import { SavingsFormData, savingsSchema } from "@/schemas/forms/savings";
import { useAuth } from "@/utils/authProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CurrencyInput from "../../Input/CurrencyInput";
import CustomSelect from "../../Select/select";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setRefresh: Dispatch<SetStateAction<number>>;
};

function InsertSavingDialog({ open, setOpen, setRefresh }: Props) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<SavingsFormData>({
    resolver: zodResolver(savingsSchema),
    defaultValues: {
      name: "",
      balance: undefined,
      type: undefined,
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [form, open]);

  const onSubmit = async (formData: SavingsFormData) => {
    setLoading(true);
    const result = await insertSaving({
      user_id: profile!.id,
      formData: formData,
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
              <DialogTitle>New Saving Account</DialogTitle>
              <DialogDescription>
                Provide data about your new saving account, so you can track and
                manage it here.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 p-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder={`e.g. ${profile?.display_name}'s saving`}
                        {...form.register("name")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <CustomSelect
                        {...field}
                        label="Saving"
                        groups={[
                          {
                            label: "Saving",
                            items: [
                              { label: "Cash", value: "cash" },
                              { label: "Card", value: "card" },
                            ],
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
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance</FormLabel>
                    <FormControl>
                      <CurrencyInput fieldData={field} loading={loading} />
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
                        placeholder="Account description here..."
                        value={field.value || ""}
                        disabled={loading}
                        {...form.register("description")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm" disabled={loading}>
                  <X />
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size="sm"
                type="submit"
                disabled={loading}
                onClick={form.handleSubmit(onSubmit)}
              >
                <Plus />
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

export default InsertSavingDialog;
