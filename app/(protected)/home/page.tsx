"use client";

import { ExpenseTypeChart } from "@/components/custom/Charts/expenseChart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSavings } from "@/hooks/useSavings";
import { expenseBadge } from "@/lib/constants/expenseBadge";
import { cn } from "@/lib/utils";
import { ExpensesRow } from "@/types/expenses";
import { IncomeRow } from "@/types/income";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getPeriodicActivity } from "./actions";

function HomePage() {
  const { savings, loading: savingsLoading } = useSavings();
  const [expenses, setExpenses] = useState<ExpensesRow[]>([]);
  const [incomes, setIncomes] = useState<IncomeRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1,
      );

      const results = await getPeriodicActivity({
        startPeriod: startOfMonth,
        endPeriod: startOfNextMonth,
      });

      if (!results.success) toast.error(results.message);
      setExpenses(results.expenses || []);
      setIncomes(results.incomes || []);
      setLoading(false);
    })();
  }, []);

  // Calculate totals
  const totalIncome = incomes
    .map((income) => income.amount)
    .reduce((a, b) => a + b, 0);
  const totalExpense = expenses
    .map((expense) => expense.amount)
    .reduce((a, b) => a + b, 0);
  const netflow = totalIncome - totalExpense;

  const expensiveExpenses = [...expenses]
    .sort((prev, next) => next.amount - prev.amount)
    .slice(0, 5);

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
      }).format(totalIncome),
      textStyle: "text-green-700",
    },
    {
      title: "This month's total expense",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(totalExpense),
      textStyle: "text-red-700",
    },
    {
      title: "Netflow this month",
      value: `${netflow > 0 ? "+" : ""} ${new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(netflow)}`,
      textStyle: netflow < 0 ? "text-red-700" : "text-green-700",
    },
  ];

  if (loading || savingsLoading)
    return <Spinner className="items-center justify-items-center mx-auto" />;

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 justify-center items-center">
        {showedItem.map((item) => (
          <Card className="w-full border-0 shadow-md" key={item.title}>
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
        {expenses.length > 0 && (
          <div className="md:max-w-xs">
            <ExpenseTypeChart expenses={expenses} />
          </div>
        )}
        <Card className="w-full">
          <CardContent>
            <div className="overflow-auto max-h-[300px]">
              <Table>
                <TableCaption className="italic">
                  Most expensive expense this month
                </TableCaption>
                <TableHeader>
                  <TableRow className="uppercase">
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expensiveExpenses
                    .map((expense) => {
                      const { variant, className } =
                        expenseBadge[
                          expense.category as keyof typeof expenseBadge
                        ];

                      return (
                        <TableRow key={expense.id}>
                          <TableCell>
                            <p className="truncate w-25 md:w-full font-medium">
                              {expense.title}
                            </p>
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(expense.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={variant}
                              className={cn("rounded-sm uppercase", className)}
                            >
                              {expense.category}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                    .slice(0, 5)}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default HomePage;
