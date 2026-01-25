import { Database } from "@/utils/supabase/types";

export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type UserSavings = Database["public"]["Tables"]["user_savings"]["Row"];