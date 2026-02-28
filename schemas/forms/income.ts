import z from 'zod';

export const incomeSchema = z.object({
    title: z.string().min(1, "Title is required"),
    amount: z.number().min(1, "Amount needs to be greater than 0").positive({ message: "Amount must be positive" }),
    save_to: z.string().min(1, {message: "Saving must be selected"}),
    description : z.string().optional().nullable(),
})

export type IncomeFormData = z.infer<typeof incomeSchema>;