"use client"

import { SavingsFormData } from "@/schemas/forms/savings";
import { ReturnType } from "@/types/common";
import { PaginationType } from "@/types/paginations";
import { SavingsRow, SavingsUpdate } from "@/types/savings";
import { createClient } from "@/utils/supabase/client";

type SavingsReturn = ReturnType & {data?: SavingsRow[]}

export async function fetchSavings({pagination, user_id} : {pagination: PaginationType, user_id: string}): Promise<SavingsReturn>{
    if (!user_id) return {success: false, message: "User not found"} 

    const supabase = await createClient();
    const from = pagination.pageIndex * pagination.pageSize;
    const to = from + pagination.pageSize

    const {data: savings, error} = await supabase.from("user_savings")
        .select("*")
        .range(from, to)
        .eq("user_id", user_id)
        .order("created_at", {ascending: false});

    if (error) return {success: false, message: error.message}

    const hasNextPage:boolean = savings.length > pagination.pageSize;
    const hasPrevPage:boolean = pagination.pageIndex > 0;
    const rows:SavingsRow[] = hasNextPage ? savings.slice(0, pagination.pageSize) : savings

    return {success: true, message: "Savings retrieved", data: rows, hasNextPage: hasNextPage, hasPrevPage: hasPrevPage}
}

export async function insertSaving({user_id, formData} : {user_id:string, formData: SavingsFormData}) : Promise<ReturnType> {
    if (!user_id) return {success: false, message: "User not found"};

    const supabase = await createClient();

    const {error} = await supabase.from("user_savings").insert({
        user_id: user_id,
        ...formData,
    }).select();

    if (error) return {success: false, message: "Failed to create new saving account"}

    return {success: true, message: "New saving account created successfully"}
}

export async function disableSaving({selected} : {selected: SavingsUpdate}) : Promise<SavingsReturn> {
    if (!selected) return {success: false, message: "No saving selected!"};

    const supabase = await createClient();
    const {error} = await supabase.from("user_savings").update({
        is_active: !selected.is_active
    }).eq("id", selected.id!).select();

    if (error) return {success: false, message: "Failed to update saving"}

    return {success: true, message: "User's saving updated successfully"}
}

export async function updateSavings({saving, formData} : {saving: SavingsUpdate, formData: SavingsFormData}) : Promise<ReturnType> {
    const supabase = await createClient();

    const {error} = await supabase.from("user_savings").update(formData).eq("id", saving.id!).select();

    if (error) return {success: false, message: "Failed to update saving data"}

    return {success: true, message: "Saving updated"}
}