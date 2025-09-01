"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FoodProduct {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
  serving: number;
  servingUnit: string;
  isActive: boolean;
}

interface DeleteFoodProductModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  product: FoodProduct;
  onSuccess: () => void;
}

export default function DeleteFoodProductModal({
  isOpen,
  setIsOpen,
  product,
  onSuccess,
}: DeleteFoodProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleDelete = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/food-products/${product.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Produktas sėkmingai ištrintas" });
        onSuccess();
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      } else {
        const error = await response.text();
        setMessage({
          type: "error",
          text: `Klaida trinant produktą: ${error}`,
        });
      }
    } catch (error) {
      console.error("Error deleting food product:", error);
      setMessage({
        type: "error",
        text: `Klaida trinant produktą: ${error}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Trash2 className="h-5 w-5 mr-2 text-red-500" />
            Ištrinti maisto produktą
          </DialogTitle>
        </DialogHeader>

        {message && (
          <Alert
            className={`mb-4 ${
              message.type === "success" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <AlertCircle
              className={
                message.type === "success" ? "text-green-600" : "text-red-600"
              }
            />
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <p className="text-center">
            Ar tikrai norite ištrinti produktą <strong>{product.name}</strong>?
          </p>
          <p className="text-center text-gray-500 mt-2">
            Šio veiksmo negalėsite atšaukti.
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto"
          >
            Atšaukti
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
          >
            {isSubmitting ? "Trinama..." : "Ištrinti produktą"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
