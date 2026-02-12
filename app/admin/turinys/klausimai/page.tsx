"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
  MoveUp,
  MoveDown,
  FolderPlus,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface FAQCategory {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  order: number;
  isActive: boolean;
  _count?: { items: number };
  items?: FAQItem[];
}

interface FAQItem {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  category?: { id: string; title: string; slug: string };
}

export default function FAQAdminPage() {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Expanded categories
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Category dialogs
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);

  // Item dialogs
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [isDeleteItemDialogOpen, setIsDeleteItemDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FAQItem | null>(null);

  // Category form
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryIsActive, setCategoryIsActive] = useState(true);

  // Item form
  const [itemCategoryId, setItemCategoryId] = useState("");
  const [itemQuestion, setItemQuestion] = useState("");
  const [itemAnswer, setItemAnswer] = useState("");
  const [itemIsActive, setItemIsActive] = useState(true);

  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, itemsRes] = await Promise.all([
        fetch("/api/admin/faq-categories"),
        fetch("/api/admin/faq-items"),
      ]);

      if (!categoriesRes.ok || !itemsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [categoriesData, itemsData] = await Promise.all([
        categoriesRes.json(),
        itemsRes.json(),
      ]);

      setCategories(categoriesData);
      setItems(itemsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Nepavyko gauti duomenų");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryItems = (categoryId: string) => {
    return items.filter((item) => item.categoryId === categoryId);
  };

  // Category handlers
  const handleOpenAddCategoryDialog = () => {
    setCategoryTitle("");
    setCategoryDescription("");
    setCategoryIsActive(true);
    setIsCategoryDialogOpen(true);
  };

  const handleOpenEditCategoryDialog = (category: FAQCategory) => {
    setSelectedCategory(category);
    setCategoryTitle(category.title);
    setCategoryDescription(category.description || "");
    setCategoryIsActive(category.isActive);
    setIsEditCategoryDialogOpen(true);
  };

  const handleOpenDeleteCategoryDialog = (category: FAQCategory) => {
    setSelectedCategory(category);
    setIsDeleteCategoryDialogOpen(true);
  };

  const handleAddCategory = async () => {
    try {
      setFormSubmitting(true);
      setError("");

      if (!categoryTitle.trim()) {
        setError("Kategorijos pavadinimas yra privalomas");
        return;
      }

      const response = await fetch("/api/admin/faq-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: categoryTitle,
          description: categoryDescription,
          isActive: categoryIsActive,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create category");
      }

      await fetchData();
      setIsCategoryDialogOpen(false);
      setSuccess("Kategorija sėkmingai sukurta");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      console.error("Error creating category:", error);
      setError(error.message || "Nepavyko sukurti kategorijos");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      setFormSubmitting(true);
      setError("");

      if (!categoryTitle.trim()) {
        setError("Kategorijos pavadinimas yra privalomas");
        return;
      }

      const response = await fetch(`/api/admin/faq-categories/${selectedCategory?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: categoryTitle,
          description: categoryDescription,
          isActive: categoryIsActive,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update category");
      }

      await fetchData();
      setIsEditCategoryDialogOpen(false);
      setSuccess("Kategorija sėkmingai atnaujinta");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      console.error("Error updating category:", error);
      setError(error.message || "Nepavyko atnaujinti kategorijos");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setFormSubmitting(true);

      const response = await fetch(`/api/admin/faq-categories/${selectedCategory?.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete category");
      }

      await fetchData();
      setIsDeleteCategoryDialogOpen(false);
      setSuccess("Kategorija sėkmingai ištrinta");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      console.error("Error deleting category:", error);
      setError(error.message || "Nepavyko ištrinti kategorijos");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleMoveCategoryOrder = async (categoryId: string, direction: "up" | "down") => {
    try {
      const currentIndex = categories.findIndex((c) => c.id === categoryId);
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === categories.length - 1)
      ) {
        return;
      }

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const targetCategory = categories[targetIndex];
      const currentCategory = categories[currentIndex];

      await Promise.all([
        fetch(`/api/admin/faq-categories/${categoryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: targetCategory.order }),
        }),
        fetch(`/api/admin/faq-categories/${targetCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: currentCategory.order }),
        }),
      ]);

      await fetchData();
    } catch (error) {
      console.error("Error moving category:", error);
      setError("Nepavyko pakeisti kategorijos pozicijos");
    }
  };

  // Item handlers
  const handleOpenAddItemDialog = (categoryId?: string) => {
    setItemCategoryId(categoryId || categories[0]?.id || "");
    setItemQuestion("");
    setItemAnswer("");
    setItemIsActive(true);
    setIsItemDialogOpen(true);
  };

  const handleOpenEditItemDialog = (item: FAQItem) => {
    setSelectedItem(item);
    setItemCategoryId(item.categoryId);
    setItemQuestion(item.question);
    setItemAnswer(item.answer);
    setItemIsActive(item.isActive);
    setIsEditItemDialogOpen(true);
  };

  const handleOpenDeleteItemDialog = (item: FAQItem) => {
    setSelectedItem(item);
    setIsDeleteItemDialogOpen(true);
  };

  const handleAddItem = async () => {
    try {
      setFormSubmitting(true);
      setError("");

      if (!itemCategoryId) {
        setError("Kategorija yra privaloma");
        return;
      }
      if (!itemQuestion.trim()) {
        setError("Klausimas yra privalomas");
        return;
      }
      if (!itemAnswer.trim()) {
        setError("Atsakymas yra privalomas");
        return;
      }

      const response = await fetch("/api/admin/faq-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: itemCategoryId,
          question: itemQuestion,
          answer: itemAnswer,
          isActive: itemIsActive,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create item");
      }

      await fetchData();
      setIsItemDialogOpen(false);
      setSuccess("Klausimas sėkmingai sukurtas");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      console.error("Error creating item:", error);
      setError(error.message || "Nepavyko sukurti klausimo");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdateItem = async () => {
    try {
      setFormSubmitting(true);
      setError("");

      if (!itemQuestion.trim()) {
        setError("Klausimas yra privalomas");
        return;
      }
      if (!itemAnswer.trim()) {
        setError("Atsakymas yra privalomas");
        return;
      }

      const response = await fetch(`/api/admin/faq-items/${selectedItem?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: itemCategoryId,
          question: itemQuestion,
          answer: itemAnswer,
          isActive: itemIsActive,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update item");
      }

      await fetchData();
      setIsEditItemDialogOpen(false);
      setSuccess("Klausimas sėkmingai atnaujintas");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      console.error("Error updating item:", error);
      setError(error.message || "Nepavyko atnaujinti klausimo");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    try {
      setFormSubmitting(true);

      const response = await fetch(`/api/admin/faq-items/${selectedItem?.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete item");
      }

      await fetchData();
      setIsDeleteItemDialogOpen(false);
      setSuccess("Klausimas sėkmingai ištrintas");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      console.error("Error deleting item:", error);
      setError(error.message || "Nepavyko ištrinti klausimo");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleMoveItemOrder = async (itemId: string, categoryId: string, direction: "up" | "down") => {
    try {
      const categoryItems = getCategoryItems(categoryId);
      const currentIndex = categoryItems.findIndex((i) => i.id === itemId);
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === categoryItems.length - 1)
      ) {
        return;
      }

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const targetItem = categoryItems[targetIndex];
      const currentItem = categoryItems[currentIndex];

      await Promise.all([
        fetch(`/api/admin/faq-items/${itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: targetItem.order }),
        }),
        fetch(`/api/admin/faq-items/${targetItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: currentItem.order }),
        }),
      ]);

      await fetchData();
    } catch (error) {
      console.error("Error moving item:", error);
      setError("Nepavyko pakeisti klausimo pozicijos");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Klausimai (DUK)</h1>
          <p className="text-gray-500">Valdykite dažnai užduodamus klausimus</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenAddCategoryDialog}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Nauja kategorija
          </Button>
          <Button
            onClick={() => handleOpenAddItemDialog()}
            className="bg-[#60988E] hover:bg-[#4e7d75]"
            disabled={categories.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Naujas klausimas
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
            <Button onClick={handleOpenAddCategoryDialog} variant="outline">
              <FolderPlus className="h-4 w-4 mr-2" />
              Pridėti pirmą kategoriją
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {categories.map((category, catIndex) => {
              const categoryItems = getCategoryItems(category.id);
              const isExpanded = expandedCategories.has(category.id);

              return (
                <div key={category.id}>
                  {/* Category row */}
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{category.title}</span>
                          <span className="text-xs text-gray-400">
                            ({categoryItems.length} klausimai)
                          </span>
                          {!category.isActive && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              Neaktyvus
                            </span>
                          )}
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-500">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveCategoryOrder(category.id, "up")}
                        disabled={catIndex === 0}
                        className="h-8 w-8"
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveCategoryOrder(category.id, "down")}
                        disabled={catIndex === categories.length - 1}
                        className="h-8 w-8"
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenAddItemDialog(category.id)}
                        className="h-8 w-8 text-[#60988E]"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditCategoryDialog(category)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDeleteCategoryDialog(category)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Items */}
                  {isExpanded && categoryItems.length > 0 && (
                    <div className="bg-gray-50 border-t">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-gray-50">
                            <TableHead className="pl-12">Klausimas</TableHead>
                            <TableHead>Atsakymas</TableHead>
                            <TableHead>Statusas</TableHead>
                            <TableHead className="w-[140px]">Veiksmai</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryItems.map((item, itemIndex) => (
                            <TableRow key={item.id} className="hover:bg-gray-100">
                              <TableCell className="pl-12 font-medium max-w-xs">
                                <div className="truncate">{item.question}</div>
                              </TableCell>
                              <TableCell className="max-w-md">
                                <div className="truncate text-gray-600">{item.answer}</div>
                              </TableCell>
                              <TableCell>
                                {item.isActive ? (
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
                                    onClick={() => handleMoveItemOrder(item.id, category.id, "up")}
                                    disabled={itemIndex === 0}
                                    className="h-8 w-8"
                                  >
                                    <MoveUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleMoveItemOrder(item.id, category.id, "down")}
                                    disabled={itemIndex === categoryItems.length - 1}
                                    className="h-8 w-8"
                                  >
                                    <MoveDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleOpenEditItemDialog(item)}
                                    className="h-8 w-8"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleOpenDeleteItemDialog(item)}
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {isExpanded && categoryItems.length === 0 && (
                    <div className="bg-gray-50 border-t p-4 pl-12 text-sm text-gray-500">
                      Nėra klausimų šioje kategorijoje.{" "}
                      <button
                        onClick={() => handleOpenAddItemDialog(category.id)}
                        className="text-[#60988E] hover:underline"
                      >
                        Pridėti pirmą klausimą
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pridėti naują kategoriją</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryTitle">Pavadinimas</Label>
              <Input
                id="categoryTitle"
                value={categoryTitle}
                onChange={(e) => setCategoryTitle(e.target.value)}
                placeholder="Kategorijos pavadinimas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryDescription">Aprašymas (neprivalomas)</Label>
              <Textarea
                id="categoryDescription"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Kategorijos aprašymas"
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="categoryIsActive"
                checked={categoryIsActive}
                onCheckedChange={setCategoryIsActive}
              />
              <Label htmlFor="categoryIsActive">Aktyvus</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCategoryDialogOpen(false)}
              disabled={formSubmitting}
            >
              Atšaukti
            </Button>
            <Button
              onClick={handleAddCategory}
              disabled={formSubmitting}
              className="bg-[#60988E] hover:bg-[#4e7d75]"
            >
              {formSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Pridėti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redaguoti kategoriją</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editCategoryTitle">Pavadinimas</Label>
              <Input
                id="editCategoryTitle"
                value={categoryTitle}
                onChange={(e) => setCategoryTitle(e.target.value)}
                placeholder="Kategorijos pavadinimas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCategoryDescription">Aprašymas (neprivalomas)</Label>
              <Textarea
                id="editCategoryDescription"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Kategorijos aprašymas"
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="editCategoryIsActive"
                checked={categoryIsActive}
                onCheckedChange={setCategoryIsActive}
              />
              <Label htmlFor="editCategoryIsActive">Aktyvus</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditCategoryDialogOpen(false)}
              disabled={formSubmitting}
            >
              Atšaukti
            </Button>
            <Button
              onClick={handleUpdateCategory}
              disabled={formSubmitting}
              className="bg-[#60988E] hover:bg-[#4e7d75]"
            >
              {formSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Išsaugoti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <AlertDialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ar tikrai norite ištrinti šią kategoriją?</AlertDialogTitle>
            <AlertDialogDescription>
              Šis veiksmas negrįžtamai ištrins kategoriją ir visus jos klausimus (
              {getCategoryItems(selectedCategory?.id || "").length} klausimai).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formSubmitting}>Atšaukti</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={formSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {formSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Ištrinti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Item Dialog */}
      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pridėti naują klausimą</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="itemCategory">Kategorija</Label>
              <Select value={itemCategoryId} onValueChange={setItemCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pasirinkite kategoriją" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemQuestion">Klausimas</Label>
              <Textarea
                id="itemQuestion"
                value={itemQuestion}
                onChange={(e) => setItemQuestion(e.target.value)}
                placeholder="Įveskite klausimą"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemAnswer">Atsakymas</Label>
              <Textarea
                id="itemAnswer"
                value={itemAnswer}
                onChange={(e) => setItemAnswer(e.target.value)}
                placeholder="Įveskite atsakymą"
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="itemIsActive"
                checked={itemIsActive}
                onCheckedChange={setItemIsActive}
              />
              <Label htmlFor="itemIsActive">Aktyvus</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsItemDialogOpen(false)}
              disabled={formSubmitting}
            >
              Atšaukti
            </Button>
            <Button
              onClick={handleAddItem}
              disabled={formSubmitting}
              className="bg-[#60988E] hover:bg-[#4e7d75]"
            >
              {formSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Pridėti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Redaguoti klausimą</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editItemCategory">Kategorija</Label>
              <Select value={itemCategoryId} onValueChange={setItemCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pasirinkite kategoriją" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editItemQuestion">Klausimas</Label>
              <Textarea
                id="editItemQuestion"
                value={itemQuestion}
                onChange={(e) => setItemQuestion(e.target.value)}
                placeholder="Įveskite klausimą"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editItemAnswer">Atsakymas</Label>
              <Textarea
                id="editItemAnswer"
                value={itemAnswer}
                onChange={(e) => setItemAnswer(e.target.value)}
                placeholder="Įveskite atsakymą"
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="editItemIsActive"
                checked={itemIsActive}
                onCheckedChange={setItemIsActive}
              />
              <Label htmlFor="editItemIsActive">Aktyvus</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditItemDialogOpen(false)}
              disabled={formSubmitting}
            >
              Atšaukti
            </Button>
            <Button
              onClick={handleUpdateItem}
              disabled={formSubmitting}
              className="bg-[#60988E] hover:bg-[#4e7d75]"
            >
              {formSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Išsaugoti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Item Dialog */}
      <AlertDialog open={isDeleteItemDialogOpen} onOpenChange={setIsDeleteItemDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ar tikrai norite ištrinti šį klausimą?</AlertDialogTitle>
            <AlertDialogDescription>
              Šis veiksmas negrįžtamai ištrins klausimą ir jo atsakymą.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formSubmitting}>Atšaukti</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteItem}
              disabled={formSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {formSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Ištrinti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
