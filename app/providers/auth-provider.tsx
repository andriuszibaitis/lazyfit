"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

export const InitialDataContext = createContext<any>(null);

export function AuthProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData?: any;
}) {
  return (
    <InitialDataContext.Provider value={initialData}>
      <SessionProvider>{children}</SessionProvider>
    </InitialDataContext.Provider>
  );
}

export function useInitialData() {
  return useContext(InitialDataContext);
}
