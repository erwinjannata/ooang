import { AppSidebar } from "@/components/custom/Sidebar/appsidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/utils/authProvider";
import React from "react";
import { getProfile, getSavings, getUser } from "./actions";
import { UserInitialization } from "./api/post-auth/userInitialization";

async function ProtectedRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, profile, savings] = await Promise.all([
    getUser(),
    getProfile(),
    getSavings(),
  ]);

  return (
    <SidebarProvider open={false} defaultChecked={false}>
      <AppSidebar user={user} profile={profile!} />
      <main className="px-4 py-2 bg-white max-h-screen w-screen">
        <AuthProvider user={user} profile={profile} savings={savings}>
          <SidebarTrigger />
          <UserInitialization />
          <div className="lg:px-10">{children}</div>
          <Toaster />
        </AuthProvider>
      </main>
    </SidebarProvider>
  );
}

export default ProtectedRootLayout;
