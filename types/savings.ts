import { Database } from "@/utils/supabase/types";

export type SavingsRow = Database["public"]["Tables"]["user_savings"]["Row"];
export type SavingsUpdate = Database["public"]["Tables"]["user_savings"]["Update"];