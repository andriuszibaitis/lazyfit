"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteNutritionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string | null;
  onSuccess: () => void;
}

export function DeleteNutritionPlanModal({
  isOpen,
  onClose,
  planId,
  onSuccess,
}: DeleteNutritionPlanModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!planId) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/nutrition-plans/${planId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Įvyko klaida trinant mitybos planą"
        );
      }
    } catch (error) {
      console.error("Error deleting nutrition plan:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Nepavyko ištrinti mitybos plano"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ar tikrai norite ištrinti?</AlertDialogTitle>
          <AlertDialogDescription>
            Šis veiksmas negrįžtamai ištrins mitybos planą ir visus jo duomenis.
            Šio veiksmo nebus galima atšaukti.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Atšaukti</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Trinama..." : "Ištrinti"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
