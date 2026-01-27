"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ExpensesRow } from "@/types/expenses";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getTodayExpenses } from "./actions";

function HomePage() {
  const [expenses, setExpenses] = useState<ExpensesRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await getTodayExpenses();

      if (!results.success) toast.error(results.message);
      setExpenses(results.data || []);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return <Spinner className="items-center justify-items-center mx-auto" />;

  return (
    <div>
      <Card className="w-full max-w-sm border-0 shadow-md">
        <CardContent className="grid gap-2">
          <p className="text-muted-foreground text-sm">Today&apos;s Expenses</p>
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-balance">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(
              expenses.reduce((total, expense) => total + expense.amount, 0),
            )}
          </h1>
        </CardContent>
      </Card>
    </div>
  );
}

export default HomePage;
