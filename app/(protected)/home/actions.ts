"use client"

import { endOfDate, startOfDate } from "@/hooks/getDate";
import { ReturnType } from "@/types/common";
import { ExpensesRow } from "@/types/expenses";
import { IncomeRow } from "@/types/income";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";

export async function getPeriodicActivity({startPeriod, endPeriod} : {startPeriod: Date, endPeriod: Date}) : Promise<ReturnType & { expenses?: ExpensesRow[], incomes?: IncomeRow[]}> {
    if (!startPeriod || !endPeriod) {
        return { success: false, message: "Invalid date range" }
    }

    const diffInMs = endOfDate({ suppliedDate: endPeriod })!.getTime() - startOfDate({ suppliedDate: startPeriod })!.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    
    if (diffInDays >= 31) return { success: false, message: "Max period"}

    const from = format(startPeriod, "yyyy-MM-dd")
    const to = format(endPeriod, "yyyy-MM-dd")
    
    const supabase = await createClient();

    const { data: expenseData, error: expenseError} = await supabase.from("expenses")
        .select("*, saving:user_savings!spend_from(*)")
        .gte("created_at", `${from}T00:00:00+08:00`)
        .lte("created_at", `${to}T23:59:59.999+08:00`)
        .order("created_at", {ascending: false});

    if (expenseError) return {success: false, message: expenseError.message}

    const { data: incomeData, error: incomeError} = await supabase.from("income")
        .select("*, saving:user_savings!save_to(*)")
        .gte("created_at", `${from}T00:00:00+08:00`)
        .lte("created_at", `${to}T23:59:59.999+08:00`)
        .order("created_at", {ascending: false});

    if (incomeError) return {success: false, message: incomeError.message}

    return {success: true, message:"Data retrieved", expenses: expenseData, incomes: incomeData}
}