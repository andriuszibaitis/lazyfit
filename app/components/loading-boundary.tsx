"use client";

import { Suspense, type ReactNode } from "react";

interface LoadingBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

export default function LoadingBoundary({
  children,
  fallback,
}: LoadingBoundaryProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
