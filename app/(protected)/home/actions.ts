"use client"

import { ReturnType } from "@/types/common";
import { ExpensesRow } from "@/types/expenses";
import { createClient } from "@/utils/supabase/client";

export async function getCurrentMonthExpenses() : Promise<ReturnType & { data?: ExpensesRow[]}> {
    const supabase = await createClient();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const { data, error} = await supabase.from("expenses")
        .select("*, saving:user_savings!spend_from(*)")
        .gte("created_at", startOfMonth.toISOString())
        .lt("created_at", startOfNextMonth.toISOString())
        .order("created_at", {ascending: false});

    if (error) return {success: false, message: error.message}

    return {success: true, message:"Expenses retrieved", data: data}
}