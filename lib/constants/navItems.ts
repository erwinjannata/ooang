import { BanknoteArrowDown, ChartLine, LucideIcon } from "lucide-react";

type NavGroupItem = {
  title: string;
  url: string;
};

type NavGroupContent = {
  title: string;
  icon: LucideIcon;
  items: NavGroupItem[];
};

type NavGroup = {
  label: string;
  content: NavGroupContent[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Tracker",
    content: [
      {
        title: "Expenses Tracker",
        icon: BanknoteArrowDown,
        items: [
          { title: "Home", url: "/home" },
          { title: "Expenses", url: "/expenses" },
          { title: "Income", url: "/income" },
          { title: "Savings", url: "/savings"}
        ],
      },
    ],
  },
  {
    label: "Reports",
    content: [
      {
        title: "Finance",
        icon: ChartLine,
        items: [
          { title: "Debts", url: "/expenses" },
          { title: "Receivables", url: "/income" },
        ],
      },
    ],
  },
];