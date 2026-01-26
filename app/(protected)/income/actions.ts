"use client"

import { IncomeFormData } from "@/schemas/forms/income";
import { ReturnType } from "@/types/common";
import { IncomeRow, IncomeUpdate } from "@/types/income";
import { PaginationType } from "@/types/paginations";
import { createClient } from "@/utils/supabase/client";

export async function fetchIncome({pagination} : {pagination : PaginationType}) : Promise<ReturnType & {data?: IncomeRow[]}> {
    const supabase = await createClient();
    const from = pagination.pageIndex * pagination.pageSize;
    const to = from + pagination.pageSize

    const {data: income, error} = await supabase.from("income").select("*, saving:user_savings!save_to(*)").range(from, to).order("created_at", {ascending: false});

    if (error) return {success: false, message: error.message}
    
    const hasNextPage:boolean = income.length > pagination.pageSize;
    const hasPrevPage:boolean = pagination.pageIndex > 0;
    const rows : IncomeRow[] = hasNextPage ? income.slice(0, pagination.pageSize) : income

    return {success: true, message: "Expenses retrieved", data: rows, hasNextPage: hasNextPage, hasPrevPage: hasPrevPage}       
}

export async function insertIncome({ data, userId }: { data: IncomeFormData, userId?: string }): Promise<ReturnType> {
    const supabase = await createClient();

    // Insert new Row to Expense table
    const { error: expenseError } = await supabase.from("income").insert({
        ...data,
        user_id: userId,
    })

    if (expenseError) return { success: false, message: expenseError.message }

    return { success: true, message: "Expenses recorded" }
}

export async function updateIncome({data, selected} : {data: IncomeFormData, selected: IncomeUpdate}): Promise<ReturnType>{
    const supabase = await createClient();

    const {error} = await supabase.from("income").update(data).eq("id", selected.id!).select();

    if (error) return {success: false, message: "Failed to update income detail"}

    return {success: true, message: "Income detail updated"}
}

export async function deleteIncome({selected} : {selected: IncomeUpdate}) : Promise<ReturnType>{
    const supabase = await createClient();
    
    const {error} = await supabase.from("income").delete().eq("id", selected.id!);

    if (error) return {success: false, message: "Failed to delete income data"}

    return {success: true, message: "Income data deleted successfully"}
}