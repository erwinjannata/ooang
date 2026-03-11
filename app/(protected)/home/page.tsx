"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ExpensesRow } from "@/types/expenses";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCurrentMonthExpenses } from "./actions";

function HomePage() {
  const [, setExpenses] = useState<ExpensesRow[]>([]);
  const [formatted, setFormatted] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await getCurrentMonthExpenses();

      if (!results.success) toast.error(results.message);
      setExpenses(results.data || []);

      const total =
        results.data?.reduce((total, expense) => total + expense.amount, 0) ||
        0;

      setFormatted(
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(total),
      );
      setLoading(false);
    })();
  }, []);

  if (loading)
    return <Spinner className="items-center justify-items-center mx-auto" />;

  return (
    <div>
      <Card className="w-full max-w-sm border-0 shadow-md">
        <CardContent className="grid gap-2">
          <p className="text-muted-foreground text-sm">
            This month&apos;s expenses
          </p>
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-balance">
            <p>{formatted}</p>
          </h1>
        </CardContent>
      </Card>
    </div>
  );
}

export default HomePage;
