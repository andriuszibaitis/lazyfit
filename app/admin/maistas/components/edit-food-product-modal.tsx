"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, AlertCircle, Edit } from "lucide-react";
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

interface EditFoodProductModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  product: FoodProduct;
  onSuccess: () => void;
  categories: string[];
}

export default function EditFoodProductModal({
  isOpen,
  setIsOpen,
  product,
  onSuccess,
  categories,
}: EditFoodProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    newCategory: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sugar: "",
    serving: "",
    servingUnit: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        newCategory: "",
        calories: product.calories.toString(),
        protein: product.protein.toString(),
        carbs: product.carbs.toString(),
        fat: product.fat.toString(),
        fiber: product.fiber ? product.fiber.toString() : "",
        sugar: product.sugar ? product.sugar.toString() : "",
        serving: product.serving.toString(),
        servingUnit: product.servingUnit,
      });
      setShowNewCategory(false);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      setShowNewCategory(true);
      setFormData((prev) => ({ ...prev, category: "" }));
    } else {
      setShowNewCategory(false);
      setFormData((prev) => ({ ...prev, category: value }));
    }
  };

  const handleServingUnitChange = (value: string) => {
    setFormData((prev) => ({ ...prev, servingUnit: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!formData.name) {
        setMessage({ type: "error", text: "Pavadinimas yra privalomas" });
        setIsSubmitting(false);
        return;
      }

      const category = showNewCategory
        ? formData.newCategory
        : formData.category;
      if (!category) {
        setMessage({ type: "error", text: "Kategorija yra privaloma" });
        setIsSubmitting(false);
        return;
      }

      if (
        !formData.calories ||
        !formData.protein ||
        !formData.carbs ||
        !formData.fat
      ) {
        setMessage({
          type: "error",
          text: "Kalorijos, baltymai, angliavandeniai ir riebalai yra privalomi",
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`/api/admin/food-products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          category: category,
          calories: Number.parseFloat(formData.calories),
          protein: Number.parseFloat(formData.protein),
          carbs: Number.parseFloat(formData.carbs),
          fat: Number.parseFloat(formData.fat),
          fiber: formData.fiber ? Number.parseFloat(formData.fiber) : null,
          sugar: formData.sugar ? Number.parseFloat(formData.sugar) : null,
          serving: Number.parseFloat(formData.serving),
          servingUnit: formData.servingUnit,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Produktas sėkmingai atnaujintas",
        });
        onSuccess();
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      } else {
        const error = await response.text();
        setMessage({
          type: "error",
          text: `Klaida atnaujinant produktą: ${error}`,
        });
      }
    } catch (error) {
      console.error("Error updating food product:", error);
      setMessage({
        type: "error",
        text: `Klaida atnaujinant produktą: ${error}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="h-5 w-5 mr-2 text-[#60988E]" />
            Redaguoti maisto produktą
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
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

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Pavadinimas <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Pvz.: Obuolys"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">
                Kategorija <span className="text-red-500">*</span>
              </Label>
              <Select
                value={showNewCategory ? "new" : formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pasirinkite kategoriją" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">
                    + Pridėti naują kategoriją
                  </SelectItem>
                </SelectContent>
              </Select>

              {showNewCategory && (
                <div className="mt-2">
                  <Input
                    id="newCategory"
                    name="newCategory"
                    value={formData.newCategory}
                    onChange={handleChange}
                    placeholder="Įveskite naują kategoriją"
                    required
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="calories">
                  Kalorijos (kcal) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="0.0"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="protein">
                  Baltymai (g) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="protein"
                  name="protein"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.protein}
                  onChange={handleChange}
                  placeholder="0.0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="carbs">
                  Angliavandeniai (g) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="carbs"
                  name="carbs"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.carbs}
                  onChange={handleChange}
                  placeholder="0.0"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fat">
                  Riebalai (g) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fat"
                  name="fat"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.fat}
                  onChange={handleChange}
                  placeholder="0.0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fiber">Skaidulos (g)</Label>
                <Input
                  id="fiber"
                  name="fiber"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.fiber}
                  onChange={handleChange}
                  placeholder="0.0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sugar">Cukrus (g)</Label>
                <Input
                  id="sugar"
                  name="sugar"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.sugar}
                  onChange={handleChange}
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serving">
                  Porcijos dydis <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="serving"
                  name="serving"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.serving}
                  onChange={handleChange}
                  placeholder="100"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="servingUnit">
                  Porcijos vienetas <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.servingUnit}
                  onValueChange={handleServingUnitChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pasirinkite vienetą" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">Gramai (g)</SelectItem>
                    <SelectItem value="ml">Mililitrai (ml)</SelectItem>
                    <SelectItem value="vnt">Vienetai (vnt)</SelectItem>
                    <SelectItem value="porcija">Porcija</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
              type="submit"
              disabled={isSubmitting}
              className="flex items-center w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Išsaugoma..." : "Išsaugoti pakeitimus"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
