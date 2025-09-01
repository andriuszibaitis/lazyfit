// components/ui/toast.tsx

import { toast as sonner } from "sonner";

interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function toast({ title, description, variant = "default" }: ToastProps) {
  sonner(title, {
    description,
    className: variant === "destructive" ? "bg-red-500 text-white" : "",
  });
}
