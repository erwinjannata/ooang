"use client";

import { useEffect } from "react";

export function UserInitialization() {
  useEffect(() => {
    fetch("/api/post-auth", { method: "POST" });
  }, []);

  return null;
}
