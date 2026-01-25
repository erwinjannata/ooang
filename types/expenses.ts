import { Database } from "@/utils/supabase/types";
import { UserSavings } from "./user";

export type ExpensesRow = Database["public"]["Tables"]["expenses"]["Row"] & {saving?: UserSavings | null};
export type ExpensesUpdate = Database["public"]["Tables"]["expenses"]["Update"];