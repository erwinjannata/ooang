"use client";

import { updateReceivable } from "@/app/(protected)/receiveables/actions";
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
import {
  ReceiveablesFormData,
  receiveablesSchema,
} from "@/schemas/forms/receiveables";
import { ReceiveableUpdate } from "@/types/receiveables";
import { useAuth } from "@/utils/authProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CurrencyInput from "../../Input/CurrencyInput";
import CustomSelect from "../../Select/select";

type Props = {
  selected: ReceiveableUpdate;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setRefresh: Dispatch<SetStateAction<number>>;
};

function UpdateReceiveablesDialog({
  selected,
  open,
  setOpen,
  setRefresh,
}: Props) {
  const { profile, savings } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<ReceiveablesFormData>({
    resolver: zodResolver(receiveablesSchema),
    defaultValues: {
      title: "",
      amount: 0,
      spend_from: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open && selected) {
      form.reset(selected);
    }
  }, [form, open, selected]);

  const onSubmit = async (formData: ReceiveablesFormData) => {
    setLoading(true);
    const result = await updateReceivable({
      formData: formData,
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
              <DialogTitle>New Receievable</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 p-4">
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
                              label: saving.name,
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

export default UpdateReceiveablesDialog;
