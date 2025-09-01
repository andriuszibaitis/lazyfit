"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { toast } from "@/components/ui/use-toast";

interface FoodProduct {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isUserCreated?: boolean;
}

interface AddFoodProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (product: FoodProduct) => void;
}

export default function AddFoodProductModal({
  isOpen,
  onClose,
  onProductAdded,
}: AddFoodProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!formData.name) {
      toast({
        title: "Klaida",
        description: "Įveskite produkto pavadinimą",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.calories ||
      !formData.protein ||
      !formData.carbs ||
      !formData.fat
    ) {
      toast({
        title: "Klaida",
        description: "Įveskite visas maistines vertes",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/dashboard/food-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          calories: Number.parseFloat(formData.calories),
          protein: Number.parseFloat(formData.protein),
          carbs: Number.parseFloat(formData.carbs),
          fat: Number.parseFloat(formData.fat),
          category,
        }),
      });

      if (!response.ok) {
        throw new Error("Nepavyko pridėti produkto");
      }

      const newProduct = await response.json();

      toast({
        title: "Sėkmingai pridėta",
        description: "Produktas sėkmingai pridėtas",
      });

      const productWithFlag = {
        ...newProduct,
        isUserCreated: true,
      };

      onProductAdded(productWithFlag);

      setFormData({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      });
      setCategory("");

      onClose();
    } catch (error) {
      console.error("Error adding food product:", error);
      toast({
        title: "Klaida",
        description: "Nepavyko pridėti produkto. Bandykite dar kartą.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pridėti naują produktą</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Pavadinimas
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Pvz., Vištienos krūtinėlė"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Kategorija
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pasirinkite kategoriją" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meat">Mėsa</SelectItem>
                  <SelectItem value="fish">Žuvis</SelectItem>
                  <SelectItem value="dairy">Pieno produktai</SelectItem>
                  <SelectItem value="vegetables">Daržovės</SelectItem>
                  <SelectItem value="fruits">Vaisiai</SelectItem>
                  <SelectItem value="grains">Grūdiniai</SelectItem>
                  <SelectItem value="nuts">Riešutai ir sėklos</SelectItem>
                  <SelectItem value="sweets">Saldumynai</SelectItem>
                  <SelectItem value="drinks">Gėrimai</SelectItem>
                  <SelectItem value="other">Kita</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="calories" className="text-right">
                Kalorijos (kcal)
              </Label>
              <Input
                id="calories"
                name="calories"
                type="number"
                step="0.1"
                min="0"
                value={formData.calories}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Kalorijos 100g produkto"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="protein" className="text-right">
                Baltymai (g)
              </Label>
              <Input
                id="protein"
                name="protein"
                type="number"
                step="0.1"
                min="0"
                value={formData.protein}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Baltymai 100g produkto"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carbs" className="text-right">
                Angliavandeniai (g)
              </Label>
              <Input
                id="carbs"
                name="carbs"
                type="number"
                step="0.1"
                min="0"
                value={formData.carbs}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Angliavandeniai 100g produkto"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fat" className="text-right">
                Riebalai (g)
              </Label>
              <Input
                id="fat"
                name="fat"
                type="number"
                step="0.1"
                min="0"
                value={formData.fat}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Riebalai 100g produkto"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Atšaukti
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Pridedama..." : "Pridėti produktą"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
