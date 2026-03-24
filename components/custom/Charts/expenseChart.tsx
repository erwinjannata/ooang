"use client";

import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { ExpensesRow } from "@/types/expenses";

export const description = "A pie chart with a custom label";

const chartConfig = {
  essential: {
    label: "Essential",
    color: "var(--chart-1)",
  },
  "non essential": {
    label: "Non-Essential",
    color: "var(--chart-2)",
  },
  unexpected: {
    label: "Unexpected",
    color: "var(--chart-3)",
  },
  cultural: {
    label: "Cultural",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

type ExpenseTypeChartProps = {
  expenses: ExpensesRow[];
};

function capitalizeWords(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function ExpenseTypeChart({ expenses }: ExpenseTypeChartProps) {
  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "long" });
  const currentYear = now.toLocaleString("default", { year: "numeric" });

  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      const existing = acc.find((c) => c.name === expense.category);

      if (existing) {
        existing.value += expense.amount;
      } else {
        acc.push({ name: expense.category, value: expense.amount });
      }

      return acc;
    },
    [] as { name: string; value: number }[],
  );

  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle>Expenses by category</CardTitle>
        <CardDescription>
          {currentMonth} {currentYear}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-100 h-100 max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart width={300} height={300}>
            <Pie
              data={categoryTotals}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              //   label={({ name, value }) =>
              //     `${chartConfig[name as keyof typeof chartConfig]?.label}: Rp ${value.toLocaleString()}`
              //   }
            >
              {categoryTotals.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    chartConfig[entry.name as keyof typeof chartConfig]?.color
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => [
                `Rp ${Number(value).toLocaleString()}`,
                capitalizeWords(String(name)),
              ]}
            />
            <Legend formatter={(value) => capitalizeWords(String(value))} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
