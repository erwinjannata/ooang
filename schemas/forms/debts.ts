import z from 'zod';

export const debtsSchema = z.object({
    title: z.string().min(1, "Title is required"),
    amount: z.number().min(1, "Amount needs to be greater than 0").positive({ message: "Amount must be positive" }),
    save_to: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
})

export const debtsSettlementSchema = z.object({
    amount: z.number().min(1, "Amount needs to be greater than 0").positive({ message: "Amount must be positive" }),
    paid_from: z.string().min(1, "Saving must be selected"),
})

export type DebtsFormData = z.infer<typeof debtsSchema>;
export type DebtsSettlementFormData = z.infer<typeof debtsSettlementSchema>;