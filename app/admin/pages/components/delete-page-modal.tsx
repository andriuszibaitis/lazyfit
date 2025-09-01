"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

interface Page {
  id: string;
  title: string;
  slug: string;
}

interface DeletePageModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  page: Page;
  onDeleteSuccess?: (deletedPageId: string) => void;
}

export default function DeletePageModal({
  isOpen,
  setIsOpen,
  page,
  onDeleteSuccess,
}: DeletePageModalProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!page) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/pages/${page.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (onDeleteSuccess) {
          onDeleteSuccess(page.id);
        } else {
          router.refresh();
        }
        setIsOpen(false);
      } else {
        console.error("Klaida trinant puslapį:", await response.text());
      }
    } catch (error) {
      console.error("Klaida trinant puslapį:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Ar tikrai norite ištrinti šį puslapį?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Puslapis "{page?.title}" bus ištrintas visam laikui. Šio veiksmo
            negalėsite atšaukti.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Atšaukti</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? "Trinama..." : "Ištrinti"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeletePageModal };
