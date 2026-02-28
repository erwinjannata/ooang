
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      console.error("No user detected");
      redirect("/login");
    } else {
      return data.user;
    }
  }

export async function getProfile() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const {
        data,
        error,
    } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {
        return;
    };

    return data;
}

export async function getSavings() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const {
        data,
        error,
    } = await supabase
        .from("user_savings")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true);

    if (error) {
        return;
    };

    return data;
}