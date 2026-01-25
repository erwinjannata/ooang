"use client"

import { ReturnType } from "@/types/common";
import { PaginationType } from "@/types/paginations";
import { SavingsRow } from "@/types/savings";
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