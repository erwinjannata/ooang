"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

function LoginPage() {
  const signInWithGoogle = async () => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      redirect("/error");
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Check for profile, if not exist create new profile
    const { data: existingProfile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!existingProfile) {
      await supabase.from("user_profiles").insert({
        id: user.id,
        display_name: user.user_metadata.full_name ?? "User",
      });
    }

    // Check for saving data, if not exist create new saving data
    const { data: existingSaving } = await supabase
      .from("user_savings")
      .select("id")
      .eq("user_id", user.id);

    if (!existingSaving) {
      await supabase.from("user_savings").upsert([
        { user_id: user.id, name: "cash", balance: 0 },
        { user_id: user.id, name: "card", balance: 0 },
      ]);
    }

    return NextResponse.redirect(new URL("/login"));
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Button onClick={() => signInWithGoogle()}>Login</Button>
    </div>
  );
}

export default LoginPage;
