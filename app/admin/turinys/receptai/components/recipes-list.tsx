"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  Search,
  Pencil,
  Trash2,
  Tag,
  Filter,
} from "lucide-react";
import DeleteRecipeModal from "./delete-recipe-modal";

type Recipe = {
  id: string;
  title: string;
  description: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  difficulty: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  availableToAll: boolean;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type RecipeCategory = {
  id: string;
  name: string;
  slug: string;
};

export default function RecipesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<RecipeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || ""
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/recipes");
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/recipe-categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDeleteClick = (recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return;

    try {
      const response = await fetch(`/api/admin/recipes/${recipeToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      fetchRecipes();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);

    if (value && value !== "all") {
      router.push(`/admin/turinys/receptai?category=${value}`);
    } else {
      router.push("/admin/turinys/receptai");
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      !selectedCategory ||
      recipe.categoryId === selectedCategory ||
      (selectedCategory === "none" && !recipe.categoryId);

    return matchesSearch && matchesCategory;
  });

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Lengvas";
      case "medium":
        return "Vidutinis";
      case "hard":
        return "Sudėtingas";
      default:
        return "Nenurodyta";
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Nepriskirta";
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Nepriskirta";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Ieškoti receptų..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Visos kategorijos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Visos kategorijos</SelectItem>
                <SelectItem value="none">Nepriskirta</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[#60988E]" />
            <p>Kraunama...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory
                ? "Nerasta receptų pagal pasirinktus filtrus"
                : "Nėra sukurtų receptų"}
            </p>
            <Button
              onClick={() => router.push("/admin/turinys/receptai/new")}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Pridėti pirmą receptą
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nuotrauka</TableHead>
                  <TableHead>Pavadinimas</TableHead>
                  <TableHead>Kategorija</TableHead>
                  <TableHead>Sudėtingumas</TableHead>
                  <TableHead>Statusas</TableHead>
                  <TableHead>Prieiga</TableHead>
                  <TableHead className="text-right">Veiksmai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecipes.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell>
                      {recipe.image ? (
                        <div className="relative h-12 w-12 rounded-md overflow-hidden">
                          <Image
                            src={recipe.image || "/placeholder.svg"}
                            alt={recipe.title}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                          <Tag className="h-6 w-6" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {recipe.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-100">
                        {getCategoryName(recipe.categoryId)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getDifficultyLabel(recipe.difficulty)}
                    </TableCell>
                    <TableCell>
                      {recipe.isPublished ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Publikuotas
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100">
                          Juodraštis
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {recipe.availableToAll ? (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          Visiems
                        </Badge>
                      ) : (
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                          Ribota
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(
                              `/admin/turinys/receptai/${recipe.id}/edit`
                            )
                          }
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Redaguoti</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(recipe)}
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
          </div>
        )}
      </Card>

      <DeleteRecipeModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        recipeName={recipeToDelete?.title || ""}
      />
    </div>
  );
}
