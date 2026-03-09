"use client";

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
import { useAuth } from "@/utils/authProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import CurrencyInput from "../../Input/CurrencyInput";
import CustomSelect from "../../Select/select";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setRefresh: Dispatch<SetStateAction<number>>;
};

const amountSchema = z.object({
  amount: z
    .number()
    .min(1, { message: "Amount invalid" })
    .positive({ message: "Amount invalid" }),
  save_to: z.string().min(1, { message: "Saving is not selected" }),
});

function SettleReceiveablesDialog({ open, setOpen, setRefresh }: Props) {
  const { profile, savings } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof amountSchema>>({
    resolver: zodResolver(amountSchema),
    defaultValues: {
      amount: 0,
      save_to: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [form, open]);

  const onSubmit = async () => {
    setLoading(true);
    // const result = await insertReceivable({
    //   user_id: profile!.id,
    //   formData: formData,
    // });
    // setLoading(false);
    // if (!result.success) {
    //   toast.error(result.message);
    // } else {
    //   toast.success(result.message);
    //   setOpen(false);
    //   setRefresh((r) => r + 1);
    // }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settle Receiveable</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 p-4">
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
                name="save_to"
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

export default SettleReceiveablesDialog;
