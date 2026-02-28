import z from 'zod';

export const savingsSchema = z.object({
    name: z.string().min(4, {message: "Saving name is required"}),
    balance: z.number().min(1, "Amount needs to be greater than 0").positive({ message: "Amount must be positive" }),
    description: z.string().optional().nullable(),
})

export type SavingsFormData = z.infer<typeof savingsSchema>;