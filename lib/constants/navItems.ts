import { BanknoteArrowDown, BanknoteArrowUp, HandCoins, Handshake, Home, LucideIcon, PiggyBank } from "lucide-react";

type NavItems = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
}

export const NavLinks : NavItems[] = [
  {title: "Home", url: "/home", icon: Home, isActive: true},
  {title: "Expenses", url: "/expenses", icon: BanknoteArrowUp, isActive: false},
  {title: "Incomes", url: "/income", icon: BanknoteArrowDown, isActive: false},
  {title: "Savings", url: "/savings", icon: PiggyBank, isActive: false},
  {title: "Debts", url: "/home", icon: Handshake, isActive: false},
  {title: "Receiveables", url: "/receiveables", icon: HandCoins, isActive: false},
];