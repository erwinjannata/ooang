import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const {searchParams, origin} = new URL(req.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    
    const {error} = await supabase.auth.exchangeCodeForSession(code); 

    if (error) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
    
    const {error: userInitError} = await supabase.rpc("init_user_account");

    if (userInitError) {
      return NextResponse.redirect(`${origin}/auth/user-init-error`)
    }
  }

  
  return NextResponse.redirect(`${origin}${next}`);
}
