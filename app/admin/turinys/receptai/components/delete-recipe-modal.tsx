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
import { Loader2 } from "lucide-react";

type DeleteRecipeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipeName: string;
};

export default function DeleteRecipeModal({
  isOpen,
  onClose,
  onConfirm,
  recipeName,
}: DeleteRecipeModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Ar tikrai norite ištrinti šį receptą?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Šis veiksmas negrįžtamai ištrins receptą "{recipeName}". Šio veiksmo
            negalėsite atšaukti.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Atšaukti</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Trinama...
              </>
            ) : (
              "Ištrinti"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
