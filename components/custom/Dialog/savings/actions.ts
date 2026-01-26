"use client"

import { SavingsFormData } from "@/schemas/forms/savings";
import { ReturnType } from "@/types/common";
import { SavingsUpdate } from "@/types/savings";
import { createClient } from "@/utils/supabase/client";

export async function updateSavings({saving, formData} : {saving: SavingsUpdate, formData: SavingsFormData}) : Promise<ReturnType> {
    const supabase = await createClient();

    const {error} = await supabase.from("user_savings").update(formData).eq("id", saving.id!).select();

    if (error) return {success: false, message: "Failed to update saving data"}

    return {success: true, message: "Saving updated"}
}