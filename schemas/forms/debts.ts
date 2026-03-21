import z from 'zod';

export const debtsSchema = z.object({
    title: z.string().min(1, "Title is required"),
    amount: z.number().min(1, "Amount needs to be greater than 0").positive({ message: "Amount must be positive" }),
    is_deposited: z.boolean().optional(),
    save_to: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
})

export type DebtsFormData = z.infer<typeof debtsSchema>;