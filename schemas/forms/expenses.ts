import z from 'zod';

export const expensesSchema = z.object({
    title: z.string().min(1, "Title is required"),
    amount: z.number().min(1, "Amount needs to be greater than 0").positive({ message: "Amount must be positive" }),
    category: z.string().min(1, "Category must be selected"),
    spend_from: z.string().min(1, {message: "Saving must be selected"}),
    description: z.string().optional().nullable(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
})

export type ExpensesFormData = z.infer<typeof expensesSchema>;