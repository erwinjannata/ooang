"use client"

import { ReturnType } from "@/types/common";
import { ExpensesRow } from "@/types/expenses";
import { createClient } from "@/utils/supabase/client";

export async function getTodayExpenses() : Promise<ReturnType & { data?: ExpensesRow[]}> {
    const supabase = await createClient();

    const { data, error} = await supabase.from("expenses")
        .select("*, saving:user_savings!spend_from(*)")
        .gte("created_at", new Date().toISOString().split("T")[0])
        .order("created_at", {ascending: false});

    if (error) return {success: false, message: error.message}

    return {success: true, message:"Expenses retrieved", data: data}
}