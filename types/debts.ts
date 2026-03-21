import { Database } from "@/utils/supabase/types";
import { UserSavings } from "./user";

export type DebtsRow = Database["public"]["Tables"]["debts"]["Row"] & {depositSaving?: UserSavings | null, spentSaving?: UserSavings | null};
export type DebtsInsert = Database["public"]["Tables"]["debts"]["Insert"];
export type DebtsUpdate = Database["public"]["Tables"]["debts"]["Update"];