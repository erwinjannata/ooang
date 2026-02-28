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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CurrencyInput from "../../Input/CurrencyInput";
import { X, Plus } from "lucide-react";

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
      balance: 0,
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
              <DialogTitle>New Saving</DialogTitle>
              <DialogDescription>
                Provide data about your new saving
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
                        disabled={loading}
                        {...field}
                        {...form.register("name")}
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
                    <FormLabel>Current Saving</FormLabel>
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
                        placeholder="Saving description here..."
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
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

export default InsertSavingDialog;
