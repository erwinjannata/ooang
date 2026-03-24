"use client"

import { ReturnType } from "@/types/common";
import { ExpensesRow } from "@/types/expenses";
import { IncomeRow } from "@/types/income";
import { createClient } from "@/utils/supabase/client";

export async function getCurrentMonthExpenses() : Promise<ReturnType & { expenses?: ExpensesRow[], incomes?: IncomeRow[]}> {
    const supabase = await createClient();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const { data: expenseData, error: expenseError} = await supabase.from("expenses")
        .select("*, saving:user_savings!spend_from(*)")
        .gte("created_at", startOfMonth.toISOString())
        .lt("created_at", startOfNextMonth.toISOString())
        .order("created_at", {ascending: false});

    if (expenseError) return {success: false, message: expenseError.message}

    const { data: incomeData, error: incomeError} = await supabase.from("income")
        .select("*, saving:user_savings!save_to(*)")
        .gte("created_at", startOfMonth.toISOString())
        .lt("created_at", startOfNextMonth.toISOString())
        .order("created_at", {ascending: false});

    if (incomeError) return {success: false, message: incomeError.message}

    return {success: true, message:"Expenses retrieved", expenses: expenseData, incomes: incomeData}
}