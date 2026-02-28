import z from 'zod';

export const receiveablesSchema = z.object({
    title: z.string().min(4, {message: "Title is required"}),
    amount: z.number().min(1, "Amount needs to be greater than 0").positive({ message: "Amount must be positive" }),
    spend_from: z.string().min(1, {message: "Saving must be selected"}),
    description: z.string().optional().nullable(),
})

export type ReceiveablesFormData = z.infer<typeof receiveablesSchema>;