'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error(error.message);
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/login");
}

export async function getUser() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
        console.error('No user detected')
        redirect('/login')
    } else {
        return data.user
    }
}