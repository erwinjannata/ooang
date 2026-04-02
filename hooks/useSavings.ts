/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SavingsRow } from "@/types/savings";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState } from "react";

export function useSavings() {
  const [savings, setSavings] = useState<SavingsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const supabase = createClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (mounted) {
            setSavings([]);
            setLoading(false);
          }
          return;
        }

        // initial fetch
        const { data, error } = await supabase
          .from("user_savings")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true);

        if (error) {
          setError(error.message);
        } else if (mounted && data) {
          setSavings(data as SavingsRow[]);
        }

        setLoading(false);

        // subscribe to realtime changes for this user's savings
        const channel = supabase
          .channel(`public:user_savings:${user.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "user_savings",
              filter: `user_id=eq.${user.id}`,
            },
            (payload: any) => {
              setSavings((prev) => {
                const ev = payload.eventType || payload.type || payload.event;

                if (ev === "DELETE") {
                  return prev.filter((item) => item.id !== payload.old?.id);
                }
                if (ev === "INSERT") {
                  return [...prev, payload.new];
                }
                if (ev === "UPDATE") {
                  return prev.map((item) =>
                    item.id === payload.new?.id ? payload.new : item
                  );
                }
                return prev;
              });
            }
          )
          .subscribe();

        channelRef.current = channel;
      } catch (err: any) {
        setError(err?.message || String(err));
        setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          if (channelRef.current.unsubscribe) {
            channelRef.current.unsubscribe();
          }
        }
      }
    };
  }, [supabase]);

  return { savings, loading, error } as const;
}
