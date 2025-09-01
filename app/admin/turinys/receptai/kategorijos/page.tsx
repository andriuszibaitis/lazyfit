"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Loader2,
  MoveUp,
  MoveDown,
} from "lucide-react";

export default function RecipeCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/recipe-categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Nepavyko gauti kategorijų sąrašo");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setFormName("");
    setFormDescription("");
    setFormImage("");
    setFormIsActive(true);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (category: any) => {
    setSelectedCategory(category);
    setFormName(category.name);
    setFormDescription(category.description || "");
    setFormImage(category.image || "");
    setFormIsActive(category.isActive);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleAddCategory = async () => {
    try {
      setFormSubmitting(true);
      setError("");

      if (!formName.trim()) {
        setError("Kategorijos pavadinimas yra privalomas");
        return;
      }

      const response = await fetch("/api/admin/recipe-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formName,
          description: formDescription,
          image: formImage,
          isActive: formIsActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      await fetchCategories();
      setIsAddDialogOpen(false);
      setSuccess("Kategorija sėkmingai sukurta");

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error creating category:", error);
      setError("Nepavyko sukurti kategorijos");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      setFormSubmitting(true);
      setError("");

      if (!formName.trim()) {
        setError("Kategorijos pavadinimas yra privalomas");
        return;
      }

      const response = await fetch(
        `/api/admin/recipe-categories/${selectedCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formName,
            description: formDescription,
            image: formImage,
            isActive: formIsActive,
            order: selectedCategory.order,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      await fetchCategories();
      setIsEditDialogOpen(false);
      setSuccess("Kategorija sėkmingai atnaujinta");

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Nepavyko atnaujinti kategorijos");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setFormSubmitting(true);

      const response = await fetch(
        `/api/admin/recipe-categories/${selectedCategory.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete category");
      }

      await fetchCategories();
      setIsDeleteDialogOpen(false);
      setSuccess("Kategorija sėkmingai ištrinta");

      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      console.error("Error deleting category:", error);
      setError(error.message || "Nepavyko ištrinti kategorijos");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleMoveCategory = async (
    categoryId: string,
    direction: "up" | "down"
  ) => {
    try {
      const currentIndex = categories.findIndex((c) => c.id === categoryId);
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === categories.length - 1)
      ) {
        return;
      }

      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const targetCategory = categories[targetIndex];

      const currentOrder = categories[currentIndex].order;
      const targetOrder = targetCategory.order;

      await fetch(`/api/admin/recipe-categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: targetOrder,
        }),
      });

      await fetch(`/api/admin/recipe-categories/${targetCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: currentOrder,
        }),
      });

      await fetchCategories();
    } catch (error) {
      console.error("Error moving category:", error);
      setError("Nepavyko pakeisti kategorijos pozicijos");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-2"
          onClick={() => router.push("/admin/turinys/receptai")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Grįžti į receptų sąrašą
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Receptų kategorijos</h1>
          <Button
            onClick={handleOpenAddDialog}
            className="bg-[#60988E] hover:bg-[#4e7d75]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Pridėti kategoriją
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[#60988E]" />
            <p>Kraunama...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">Nėra sukurtų kategorijų</p>
            <Button onClick={handleOpenAddDialog} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Pridėti pirmą kategoriją
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pavadinimas</TableHead>
                <TableHead>Aprašymas</TableHead>
                <TableHead>Statusas</TableHead>
                <TableHead className="w-[150px]">Veiksmai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {category.description || "-"}
                  </TableCell>
                  <TableCell>
                    {category.isActive ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                        Aktyvus
                      </span>
                    ) : (
                      <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                        Neaktyvus
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveCategory(category.id, "up")}
                        disabled={categories.indexOf(category) === 0}
                        className="h-8 w-8"
                      >
                        <MoveUp className="h-4 w-4" />
                        <span className="sr-only">Aukštyn</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveCategory(category.id, "down")}
                        disabled={
                          categories.indexOf(category) === categories.length - 1
                        }
                        className="h-8 w-8"
                      >
                        <MoveDown className="h-4 w-4" />
                        <span className="sr-only">Žemyn</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditDialog(category)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Redaguoti</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDeleteDialog(category)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Ištrinti</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pridėti naują kategoriją</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pavadinimas</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Kategorijos pavadinimas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Aprašymas</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Kategorijos aprašymas"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Nuotraukos URL</Label>
              <Input
                id="image"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formIsActive}
                onCheckedChange={setFormIsActive}
              />
              <Label htmlFor="isActive">Aktyvus</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={formSubmitting}
            >
              Atšaukti
            </Button>
            <Button
              onClick={handleAddCategory}
              disabled={formSubmitting}
              className="bg-[#60988E] hover:bg-[#4e7d75]"
            >
              {formSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Pridėti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redaguoti kategoriją</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Pavadinimas</Label>
              <Input
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Kategorijos pavadinimas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Aprašymas</Label>
              <Textarea
                id="edit-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Kategorijos aprašymas"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Nuotraukos URL</Label>
              <Input
                id="edit-image"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formIsActive}
                onCheckedChange={setFormIsActive}
              />
              <Label htmlFor="edit-isActive">Aktyvus</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={formSubmitting}
            >
              Atšaukti
            </Button>
            <Button
              onClick={handleUpdateCategory}
              disabled={formSubmitting}
              className="bg-[#60988E] hover:bg-[#4e7d75]"
            >
              {formSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Išsaugoti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ar tikrai norite ištrinti šią kategoriją?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Šis veiksmas negrįžtamai ištrins kategoriją. Jei kategorijoje yra
              receptų, jie nebus ištrinti, bet praras kategoriją.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formSubmitting}>
              Atšaukti
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={formSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {formSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Ištrinti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
