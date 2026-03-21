"use client"

import { DebtsFormData } from "@/schemas/forms/debts";
import { ReturnType } from "@/types/common";
import { DebtsRow, DebtsUpdate } from "@/types/debts";
import { PaginationType } from "@/types/paginations";
import { createClient } from "@/utils/supabase/client";

export async function fetchDebts({pagination} : {pagination: PaginationType}): Promise<ReturnType & {data?: DebtsRow[]}>{
    const supabase = await createClient();
    const from = pagination.pageIndex * pagination.pageSize;
    const to = from + pagination.pageSize

    const {data: debts, error} = await supabase.from("debts").select("*, depositSaving:user_savings!save_to(*), spentSaving:user_savings!paid_from(*)").range(from, to).order("created_at", {ascending: false});

    if (error) return {success: false, message: error.message}

    const hasNextPage:boolean = debts.length > pagination.pageSize;
    const hasPrevPage:boolean = pagination.pageIndex > 0;
    const rows: DebtsRow[] = hasNextPage ? debts.slice(0, pagination.pageSize) : debts

    return {success: true, message: "Expenses retrieved", data: rows, hasNextPage: hasNextPage, hasPrevPage: hasPrevPage}
}

export async function insertDebts({formData, userId} : {formData: DebtsFormData, userId?: string}): Promise<ReturnType> {
    if (!userId) return {success: false, message: "User invalid"}

    const supabase = await createClient();
    const {error} = await supabase.from("debts").insert({ ...formData, user_id: userId, remaining_amount: formData.amount, is_deposited: formData.save_to === "" ? false : true, save_to: formData.save_to === "" ? null : formData.save_to}).select();

    if (error) return {success: false, message: error.message}

    return {success: true, message: "Debt data created successfully"}
}

export async function deleteDebts({selected} : {selected: DebtsUpdate}) : Promise<ReturnType> {
    if (!selected) return {success: false, message: "No debt selected"}

    const supabase = await createClient();
    const {error} = await supabase.from("debts").delete().eq("id", selected.id!);

    if (error) return {success: false, message: "Failed to delete debt data"}

    return {success: true, message: "Debt deleted successfully"}
}