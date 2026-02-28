import { Database } from "@/utils/supabase/types";
import { UserSavings } from "./user";

export type ReceiveableRow = Database["public"]["Tables"]["receiveables"]["Row"] & {saving_spent?: UserSavings | null, saving_to?: UserSavings | null};
export type ReceiveableUpdate = Database["public"]["Tables"]["receiveables"]["Update"];