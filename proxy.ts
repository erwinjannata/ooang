import type { NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function proxy(req: NextRequest) {
  return await updateSession(req)
}

export const config = {
  matcher: ['/', '/expenses/:path*' ,'/((?!_next/static|_next/image|favicon.ico).*)'],
};
