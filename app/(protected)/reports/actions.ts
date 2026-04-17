"use client"

import { ReportChartType } from "@/components/custom/Charts/reportChart";
import { ExpensesRow } from "@/types/expenses";
import { IncomeRow } from "@/types/income";
import { utils, writeFile } from 'xlsx';

const convertToClientTimezone = (isoString: string, offsetHours: number = 8): { dateStr: string; day: number } => {
  const date = new Date(isoString);
  // Adjust for timezone offset (UTC+8)
  const clientDate = new Date(date.getTime() + offsetHours * 60 * 60 * 1000);
  
  const year = clientDate.getUTCFullYear();
  const month = String(clientDate.getUTCMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(clientDate.getUTCDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${dayOfMonth}`;
  
  return {
    dateStr,
    day: clientDate.getUTCDate(),
  };
};

export const getChartData = ({expense, income} : {expense?: ExpensesRow[], income?:IncomeRow[]}) : ReportChartType[] => {
  const chartData: ReportChartType[] = [];

  // Process expenses
  expense?.reduce((acc: ReportChartType[], item) => {
    const { dateStr, day } = convertToClientTimezone(item.created_at);
    const existing = acc.find((d) => d.date === dateStr);

    if (existing) {
      existing.expense = existing.expense + item.amount;
    } else {
      acc.push({
        date: dateStr,
        dateNumber: day,
        expense: item.amount,
        income: 0,
      });
    }
    return acc;
  }, chartData.sort((a,b) => b.dateNumber - a.dateNumber));

  // Process income
  income?.reduce((acc: ReportChartType[], item) => {
    const { dateStr, day } = convertToClientTimezone(item.created_at);
    const existing = acc.find((d) => d.date === dateStr);

    if (existing) {
      existing.income = existing.income + item.amount;
    } else {
      acc.push({
        date: dateStr,
        dateNumber: day,
        expense: 0,
        income: item.amount,
      });
    }
    return acc;
  }, chartData);

  return chartData.sort((a,b) => b.dateNumber - a.dateNumber);
}

export async function exportDataAsCsv({expenses, incomes} : {expenses: ExpensesRow[], incomes: IncomeRow[]}){
  const processExpense = expenses.map((expense) => ({
    title: expense.title,
    category: expense.category.toUpperCase(),
    amount: expense.amount,
    saving: expense.saving?.name,
    date: new Date(expense.created_at),
    description: expense.description,
  }))

  const processIncome = incomes.map((income) => ({
    title: income.title,
    amount: income.amount,
    saving: income.saving?.name,
    date: new Date(income.created_at),
    description: income.description,
  }))

  const expenseWS = utils.json_to_sheet(processExpense);
  const incomeWS = utils.json_to_sheet(processIncome);

  const workbook = utils.book_new();

  utils.book_append_sheet(workbook, expenseWS, "Expenses");
    utils.sheet_add_aoa(
        expenseWS,
        [
            [
                "Title",
                "Category",
                "Amount",
                "Spent From",
                "Date",
                "Description",
            ],
        ],
        { origin: "A1" }
    );
  
    utils.book_append_sheet(workbook, incomeWS, "Incomes");
    utils.sheet_add_aoa(
        incomeWS,
        [
            [
                "Title",
                "Amount",
                "Save To",
                "Date",
                "Description",
            ],
        ],
        { origin: "A1" }
    );
    writeFile(workbook, "OOang Export.xlsx");
}