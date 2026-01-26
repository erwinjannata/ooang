import { Database } from "@/utils/supabase/types";
import { UserSavings } from "./user";

export type IncomeRow = Database["public"]["Tables"]["income"]["Row"] & {saving?: UserSavings | null};;
export type IncomeInsert = Database["public"]["Tables"]["income"]["Insert"];
export type IncomeUpdate = Database["public"]["Tables"]["income"]["Update"];