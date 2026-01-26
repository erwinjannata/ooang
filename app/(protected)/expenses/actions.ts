'use client'

import { ExpensesFormData } from "@/schemas/forms/expenses";
import { ExpensesRow, ExpensesUpdate } from "@/types/expenses";
import { PaginationType } from "@/types/paginations";
import { createClient } from "@/utils/supabase/client";

type ReturnType = {
    success: boolean,
    message: string,
    data?: ExpensesRow[];
    hasNextPage?: boolean;
    hasPrevPage?: boolean; 
}

export async function fetchExpenses({pagination} : {pagination: PaginationType}): Promise<ReturnType>{
    const supabase = await createClient();
    const from = pagination.pageIndex * pagination.pageSize;
    const to = from + pagination.pageSize

    const {data: expenses, error} = await supabase.from("expenses").select("*, saving:user_savings!spend_from(*)").range(from, to).order("created_at", {ascending: false});

    if (error) return {success: false, message: error.message}

    const hasNextPage:boolean = expenses.length > pagination.pageSize;
    const hasPrevPage:boolean = pagination.pageIndex > 0;
    const rows:ExpensesRow[] = hasNextPage ? expenses.slice(0, pagination.pageSize) : expenses

    return {success: true, message: "Expenses retrieved", data: rows, hasNextPage: hasNextPage, hasPrevPage: hasPrevPage}
}

export async function insertExpenses({ data, userId }: { data: ExpensesFormData, userId?: string }): Promise<ReturnType> {
    const supabase = await createClient();

    // Insert new Row to Expense table
    const { error: expenseError } = await supabase.from("expenses").insert({
        title: data.title,
        amount: data.amount,
        spend_from: data.spend_from,
        description: data.description,
        category: data.category as "essential" | "non essential" | "cultural" | "unexpected",
        user_id: userId,
    })

    if (expenseError) return { success: false, message: expenseError.message }

    return { success: true, message: "Expenses recorded" }
}

export async function updateExpenses({data, selected} : {data: ExpensesFormData, selected: ExpensesUpdate}): Promise<ReturnType>{
    const supabase = await createClient();

    const {error} = await supabase.from("expenses").update({
        ...data,
        category: data.category as "essential" | "non essential" | "cultural" | "unexpected"
    }).eq("id", selected.id!).select();

    if (error) return {success: false, message: "Failed to update expenses detail"}

    return {success: true, message: "Expenses detail updated"}
}

export async function deleteExpenses({selected} : {selected: ExpensesUpdate}) : Promise<ReturnType>{
    const supabase = await createClient();
    
    const {error} = await supabase.from("expenses").delete().eq("id", selected.id!);

    if (error) return {success: false, message: "Failed to delete expenses data"}

    return {success: true, message: "Expenses data deleted successfully"}
}