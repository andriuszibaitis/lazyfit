"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PageTitleContextType {
  pageTitle: string;
  setPageTitle: (title: string) => void;
  showBackButton: boolean;
  setShowBackButton: (show: boolean) => void;
  backUrl: string | null;
  setBackUrl: (url: string | null) => void;
}

const PageTitleContext = createContext<PageTitleContextType | undefined>(undefined);

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitle] = useState('');
  const [showBackButton, setShowBackButton] = useState(false);
  const [backUrl, setBackUrl] = useState<string | null>(null);

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle, showBackButton, setShowBackButton, backUrl, setBackUrl }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle() {
  const context = useContext(PageTitleContext);
  if (context === undefined) {
    throw new Error('usePageTitle must be used within a PageTitleProvider');
  }
  return context;
}