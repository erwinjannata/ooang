"use client";

import { UserProfile, UserSavings } from "@/types/user";
import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

type AuthContextType = {
  user: User | null;
  profile: UserProfile | undefined;
  savings: UserSavings[] | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  user,
  profile,
  savings,
  children,
}: {
  user: User | null;
  profile: UserProfile | undefined;
  savings: UserSavings[] | undefined;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ user, profile, savings }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error("Error on Authentication");

  return context;
}
