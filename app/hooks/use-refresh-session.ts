"use client";

import { useSessionRefresh } from "@/app/components/session-refresh-provider";
import { useCallback } from "react";

export function useRefreshSession() {
  const { refreshSession, lastRefresh } = useSessionRefresh();

  const refreshSessionAsync = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/refresh-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Nepavyko atnaujinti sesijos");
      }

      await refreshSession();

      return true;
    } catch (error) {
      console.error("Klaida atnaujinant sesiją:", error);
      return false;
    }
  }, [refreshSession]);

  return {
    refreshSession: refreshSessionAsync,
    lastRefresh,
  };
}
