"use client"

import { ReceiveablesFormData } from "@/schemas/forms/receiveables";
import { ReturnType } from "@/types/common";
import { PaginationType } from "@/types/paginations";
import { ReceiveableRow, ReceiveableUpdate } from "@/types/receiveables";
import { createClient } from "@/utils/supabase/client";

type ReceiveableReturn = ReturnType & {data?: ReceiveableRow[]};

export async function fetchReceiveables({pagination, user_id} : {pagination: PaginationType, user_id: string}): Promise<ReceiveableReturn>{
    if (!user_id) return {success: false, message: "User not found"} 
    
        const supabase = await createClient();
        const from = pagination.pageIndex * pagination.pageSize;
        const to = from + pagination.pageSize
    
        const {data: receiveables, error} = await supabase.from("receiveables")
            .select("*, saving_spent:user_savings!spend_from(*), saving_to:user_savings!save_to(*)")
            .range(from, to)
            .eq("user_id", user_id)
            .order("created_at", {ascending: false});
    
        if (error) return {success: false, message: error.message}
    
        const hasNextPage:boolean = receiveables.length > pagination.pageSize;
        const hasPrevPage:boolean = pagination.pageIndex > 0;
        const rows:ReceiveableRow[] = hasNextPage ? receiveables.slice(0, pagination.pageSize) : receiveables
    
        return {success: true, message: "Receiveables retrieved", data: rows, hasNextPage: hasNextPage, hasPrevPage: hasPrevPage}
}

export async function insertReceivable({user_id, formData} : {user_id: string, formData: ReceiveablesFormData}) : Promise<ReturnType> {
    if (!user_id) return {success: false, message: "No user found"};

    const supabase = await createClient();

    const {error} = await supabase.from("receiveables").insert({
        ...formData,
        user_id: user_id,
    }).select();

    if (error) return {success: false, message: "Failed to insert new receiveable data"}

    return {success: true, message: "Receiveable inserted successfully"}
}

export async function updateReceivable({selected, formData} : {selected: ReceiveableUpdate, formData: ReceiveablesFormData}) : Promise<ReturnType> {
    if (!selected) return {success: false, message: "No receivable selected"};

    const supabase = await createClient();
    const {error} = await supabase.from("receiveables").update({
        ...formData,
    }).eq("id", selected.id!).select();

    if (error) return {success: false, message: "Failed to update receiveable data"}

    return {success: true, message: "Receiveable updated successfully"}
}

export async function deleteReceiveable({selected} : {selected: ReceiveableUpdate}) : Promise<ReturnType> {
    if (!selected) return {success: false, message: "No receivable selected"};

    const supabase = await createClient();
    const {error} = await supabase.from("receiveables").delete().eq("id", selected.id!);

    if (error) return {success: false, message: "Failed to delete receiveable data"}

    return {success: true, message: "Receiveable deleted successfully"}
}