"use client";

import { ExpenseTypeChart } from "@/components/custom/Charts/expenseChart";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { ExpensesRow } from "@/types/expenses";
import { IncomeRow } from "@/types/income";
import { useAuth } from "@/utils/authProvider";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCurrentMonthExpenses } from "./actions";

function HomePage() {
  const { savings } = useAuth();
  const [expenses, setExpenses] = useState<ExpensesRow[]>([]);
  const [incomes, setIncomes] = useState<IncomeRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await getCurrentMonthExpenses();

      if (!results.success) toast.error(results.message);
      setExpenses(results.expenses || []);
      setIncomes(results.incomes || []);
      setLoading(false);
    })();
  }, []);

  const showedItem = [
    {
      title: "Total saving balance",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(
        savings?.map((saving) => saving.balance).reduce((a, b) => a! + b!, 0) ||
          0,
      ),
      textStyle: "",
    },
    {
      title: "This month's total income",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(
        incomes.map((income) => income.amount).reduce((a, b) => a + b, 0),
      ),
      textStyle: "text-green-600",
    },
    {
      title: "This month's total expense",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(
        expenses.map((expense) => expense.amount).reduce((a, b) => a + b, 0),
      ),
      textStyle: "text-red-700",
    },
    {
      title: "Netflow this month",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(
        incomes.map((income) => income.amount).reduce((a, b) => a + b, 0) -
          expenses.map((expense) => expense.amount).reduce((a, b) => a + b, 0),
      ),
      textStyle: "text-red-700",
    },
  ];

  if (loading)
    return <Spinner className="items-center justify-items-center mx-auto" />;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 justify-center items-center">
        {showedItem.map((item) => (
          <Card
            className="w-full md:max-w-xs border-0 shadow-md"
            key={item.title}
          >
            <CardContent className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs">{item.title}</p>
              <h1 className="scroll-m-20 text-xl lg:text-xl font-bold tracking-tight text-balance">
                <p className={cn(item.textStyle)}>{item.value}</p>
              </h1>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="mt-4 md:max-w-xs">
          <ExpenseTypeChart expenses={expenses} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
