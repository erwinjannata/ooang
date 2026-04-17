import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAuth } from "@/utils/authProvider";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export type ReportChartType = {
  date: string;
  dateNumber: number;
  expense: number;
  income: number;
};

const ReportChartConfig = {
  report: {
    label: "Finance Activity",
  },
  expense: {
    label: "Expenses",
    color: "var(--chart-1)",
  },
  income: {
    label: "Incomes",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const ReportChart = ({ chartData }: { chartData: ReportChartType[] }) => {
  const { profile } = useAuth();
  const [active, setActive] =
    useState<keyof typeof ReportChartConfig>("expense");
  const transformedData = chartData.map((data) => ({
    ...data,
    expense: data.expense,
    income: data.income,
  }));
  const total = useMemo(
    () => ({
      expense: chartData.reduce((acc, curr) => acc + curr.expense, 0),
      income: chartData.reduce((acc, curr) => acc + curr.income, 0),
    }),
    [chartData],
  );

  return (
    <div>
      <Card className="py-0 shadow-md">
        <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-2 px-6 pt-4 pb-3 sm:py-0!">
            <CardTitle>
              <span>{profile?.display_name}</span> activity
            </CardTitle>
            <CardDescription>Expenses & Income</CardDescription>
          </div>
          <div className="flex">
            {["expense", "income"].map((key) => {
              const chart = key as keyof typeof ReportChartConfig;

              return (
                <button
                  key={chart}
                  data-active={active === chart}
                  className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                  onClick={() => setActive(chart)}
                >
                  <span className="text-muted-foreground text-xs">
                    {ReportChartConfig[chart].label}
                  </span>
                  <span className="text-lg leading-none font-bold sm:text-2xl">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(total[key as keyof typeof total])}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={ReportChartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={transformedData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("id-ID", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                reversed
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="w-[200px]"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey={active} fill={`var(--color-${active})`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportChart;
