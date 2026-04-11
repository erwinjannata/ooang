"use client"

import { EnumDebtFilter } from "@/lib/enums/debtsStatusFilter";
import { DebtsFormData, DebtsSettlementFormData } from "@/schemas/forms/debts";
import { ReturnType } from "@/types/common";
import { DebtsRow, DebtsUpdate } from "@/types/debts";
import { PaginationType } from "@/types/paginations";
import { createClient } from "@/utils/supabase/client";

export async function fetchDebts({pagination, filter} : {pagination: PaginationType, filter: {status: "all" & EnumDebtFilter}}): Promise<ReturnType & {data?: DebtsRow[]}>{
    const supabase = await createClient();
    const from = pagination.pageIndex * pagination.pageSize;
    const to = from + pagination.pageSize

    let query = supabase.from("debts").select("*, depositSaving:user_savings!save_to(*), spentSaving:user_savings!paid_from(*)")

    if (filter.status !== "all") query = query.eq("status", filter.status);

    const {data: debts, error} = await query.range(from, to).order("created_at", {ascending: false});

    if (error) return {success: false, message: error.message}

    const hasNextPage:boolean = debts.length > pagination.pageSize;
    const hasPrevPage:boolean = pagination.pageIndex > 0;
    const rows: DebtsRow[] = hasNextPage ? debts.slice(0, pagination.pageSize) : debts

    return {success: true, message: "Expenses retrieved", data: rows, hasNextPage: hasNextPage, hasPrevPage: hasPrevPage}
}

export async function insertDebts({formData, userId} : {formData: DebtsFormData, userId?: string}): Promise<ReturnType> {
    if (!userId) return {success: false, message: "User invalid"}
    const isDeposited = formData.save_to && formData.save_to !== "" ? true : false;

    const supabase = await createClient();
    const {error} = await supabase.from("debts").insert({ ...formData, user_id: userId, remaining_amount: formData.amount, is_deposited: isDeposited, save_to: isDeposited ? formData.save_to : null}).select();

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

export async function updateDebts({data, selected} : {data: DebtsFormData, selected: DebtsUpdate}): Promise<ReturnType>{
    if (!selected) return {success: false, message: "No debt selected"}

    const supabase = await createClient();
    const {error} = await supabase.from("debts").update({
        ...data,
        is_deposited: data.save_to && data.save_to !== "" ? true : false,
        save_to: data.save_to && data.save_to !== "" ? data.save_to : null,
    }).eq("id", selected.id!).select();

    if (error) return {success: false, message: "Failed to update debt data"}

    return {success: true, message: "Debt updated"}
}

export async function settleDebts({data, selected} : {data: DebtsSettlementFormData, selected: DebtsUpdate}) : Promise<ReturnType> {
    if (!selected) return {success: false, message: "No debt selected"}
    if (!data.paid_from) return {success: false, message: "Saving account is required for settlement"}

    const supabase= await createClient();
    const {error} = await supabase.rpc("settle_debt", {
        p_debt_id: selected.id!,
        p_amount: data.amount,
        p_saving_id: data.paid_from,        
    });
    
    if (error) return {success: false, message: error.message};

    return {success: true, message: "Debt settled successfully"};
}