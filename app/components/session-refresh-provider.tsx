"use client";

import { useSession } from "next-auth/react";
import {
  useEffect,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react";

const SessionRefreshContext = createContext({
  lastRefresh: new Date(),
  refreshSession: () => {},
});

export const useSessionRefresh = () => useContext(SessionRefreshContext);

interface SessionRefreshProviderProps {
  children: ReactNode;
  refreshInterval?: number;
}

export function SessionRefreshProvider({
  children,
  refreshInterval = 5 * 60 * 1000,
}: SessionRefreshProviderProps) {
  const { data: session, update } = useSession();
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const refreshSession = async () => {
    console.log("Atnaujinama sesija...");
    await update();
    setLastRefresh(new Date());
    console.log("Sesija atnaujinta:", new Date().toISOString());
  };

  useEffect(() => {
    const intervalId = setInterval(refreshSession, refreshInterval);
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <SessionRefreshContext.Provider value={{ lastRefresh, refreshSession }}>
      {children}
    </SessionRefreshContext.Provider>
  );
}
