"use client";

import ReportChart, {
  ReportChartType,
} from "@/components/custom/Charts/reportChart";
import DateInput from "@/components/custom/Input/DateInput";
import { getExpensesReportColumn } from "@/components/custom/Table/columns/reportExpense";
import { getIncomeReportColumn } from "@/components/custom/Table/columns/reportIncome";
import OldDataTable from "@/components/custom/Table/oldDataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpensesRow } from "@/types/expenses";
import { IncomeRow } from "@/types/income";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  BrushCleaning,
  FileSpreadsheet,
  Search,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getPeriodicActivity } from "../home/actions";
import { exportDataAsCsv, getChartData } from "./actions";

const FinanceReportPage = () => {
  const [startPeriod, setStartPeriod] = useState<Date | undefined>();
  const [endPeriod, setEndPeriod] = useState<Date | undefined>();
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<ExpensesRow[]>([]);
  const [incomes, setIncomes] = useState<IncomeRow[]>([]);
  const [activities, setActivities] = useState<ReportChartType[]>([]);

  const expensesColumns = getExpensesReportColumn();
  const incomesColumns = getIncomeReportColumn();

  const handleFind = async () => {
    if (!startPeriod || !endPeriod) {
      toast.error("Invalid date range");
      return;
    }

    setLoading(true);

    const results = await getPeriodicActivity({
      startPeriod: startPeriod,
      endPeriod: endPeriod,
    });

    if (!results.success) {
      toast.error(results.message);
      setLoading(false);
      setShow(false);
      return;
    }

    const chartData = getChartData({
      expense: results.expenses,
      income: results.incomes,
    });
    setExpenses(results.expenses || []);
    setIncomes(results.incomes || []);
    setActivities(chartData);

    setShow(true);
    setLoading(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <DateInput
            label="Starting Period"
            placeholder="Pick starting period"
            selected={startPeriod}
            onSelect={setStartPeriod}
          />
          <DateInput
            label="End Period"
            placeholder="Pick end period"
            selected={endPeriod}
            onSelect={setEndPeriod}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button onClick={() => handleFind()} className="w-full md:w-auto">
            <Search />
            Find
          </Button>
          {show && (
            <div>
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={async () =>
                  await exportDataAsCsv({
                    expenses: expenses,
                    incomes: incomes,
                  })
                }
              >
                <FileSpreadsheet />
                CSV
              </Button>
            </div>
          )}
          {show && (
            <div className="w-full">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  className="w-full md:w-auto"
                  onClick={() => {
                    setExpenses([]);
                    setIncomes([]);
                    setActivities([]);
                    setShow(false);
                  }}
                >
                  <BrushCleaning />
                  Clear Data
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {show && (
            <div>
              <Separator className="my-4" />
              <div>
                <ReportChart chartData={activities} />
                <Separator className="my-6" />
                <div className="bg-white rounded-md shadow-md p-4">
                  <Tabs defaultValue="expenses">
                    <TabsList variant="line" className="w-full mx-auto">
                      <TabsTrigger value="expenses" className="uppercase">
                        <BanknoteArrowUp />
                        Expenses
                      </TabsTrigger>
                      <TabsTrigger value="incomes" className="uppercase">
                        <BanknoteArrowDown />
                        Incomes
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="expenses">
                      <OldDataTable
                        data={expenses}
                        columns={expensesColumns}
                        searchColumn="title"
                        disablePagination
                        disableFilter
                      />
                    </TabsContent>
                    <TabsContent value="incomes">
                      <OldDataTable
                        data={incomes}
                        columns={incomesColumns}
                        searchColumn="title"
                        disablePagination
                        disableFilter
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FinanceReportPage;
