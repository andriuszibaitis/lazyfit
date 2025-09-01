"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Minus,
  Trash2,
  UtensilsCrossed,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Clock,
  Users,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preparationTime, setPreparationTime] = useState<number | undefined>(
    undefined
  );
  const [cookingTime, setCookingTime] = useState<number | undefined>(undefined);
  const [servings, setServings] = useState(2);
  const [difficulty, setDifficulty] = useState("medium");
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [isPublished, setIsPublished] = useState(false);
  const [image, setImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [availableToAll, setAvailableToAll] = useState(true);

  const [ingredients, setIngredients] = useState<any[]>([
    { id: "", foodProductId: "", quantity: 0, unit: "g", url: "" },
  ]);

  const [foodProducts, setFoodProducts] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [selectedMemberships, setSelectedMemberships] = useState<string[]>([]);

  const [nutritionSummary, setNutritionSummary] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchFoodProducts(),
          fetchMemberships(),
          fetchCategories(),
          fetchRecipe(),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!fetchingData) {
      calculateNutrition();
    }
  }, [ingredients, servings, fetchingData, foodProducts]);

  const fetchFoodProducts = async () => {
    try {
      const response = await fetch("/api/admin/food-products");
      if (!response.ok) {
        throw new Error("Failed to fetch food products");
      }
      const data = await response.json();
      setFoodProducts(data.products || data);
    } catch (error) {
      console.error("Error fetching food products:", error);
      setMessage({
        type: "error",
        text: "Nepavyko gauti maisto produktų sąrašo",
      });
    }
  };

  const fetchMemberships = async () => {
    try {
      const response = await fetch("/api/admin/memberships");
      if (!response.ok) {
        throw new Error("Failed to fetch memberships");
      }
      const data = await response.json();
      setMemberships(data);
    } catch (error) {
      console.error("Error fetching memberships:", error);
      setMessage({
        type: "error",
        text: "Nepavyko gauti narysčių sąrašo",
      });
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
      setMessage({
        type: "error",
        text: "Nepavyko gauti kategorijų sąrašo",
      });
    }
  };

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/admin/recipes/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipe");
      }
      const recipe = await response.json();

      setTitle(recipe.title || "");
      setDescription(recipe.description || "");
      setPreparationTime(recipe.preparationTime || undefined);
      setCookingTime(recipe.cookingTime || undefined);
      setServings(recipe.servings || 2);
      setDifficulty(recipe.difficulty || "medium");
      setIsPublished(recipe.isPublished || false);
      setImage(recipe.image || "");
      setTags(recipe.tags || []);
      setAvailableToAll(recipe.availableToAll ?? true);

      if (recipe.instructions) {
        if (typeof recipe.instructions === "string") {
          setInstructions(
            recipe.instructions.split("\n").filter((i: string) => i.trim())
          );
        } else if (Array.isArray(recipe.instructions)) {
          setInstructions(recipe.instructions);
        }
      }

      if (recipe.ingredients?.length > 0) {
        setIngredients(
          recipe.ingredients.map((ing: any) => ({
            id: ing.id,
            foodProductId: ing.foodProductId,
            quantity: ing.quantity,
            unit: ing.unit,
            url: ing.url || "",
          }))
        );
      }

      if (recipe.memberships?.length > 0) {
        setSelectedMemberships(
          recipe.memberships.map((m: any) => m.membershipId)
        );
      }

      setNutritionSummary({
        calories: recipe.totalCalories || 0,
        protein: recipe.totalProtein || 0,
        carbs: recipe.totalCarbs || 0,
        fat: recipe.totalFat || 0,
        fiber: recipe.totalFiber || 0,
        sugar: recipe.totalSugar || 0,
      });

      setSelectedCategory(recipe.categoryId || "");
    } catch (error) {
      console.error("Error fetching recipe:", error);
      setMessage({
        type: "error",
        text: "Nepavyko gauti recepto duomenų",
      });
      router.push("/admin/turinys/receptai");
    }
  };

  const calculateNutrition = () => {
    if (!foodProducts.length) return;

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let fiber = 0;
    let sugar = 0;

    ingredients.forEach((ingredient) => {
      const product = foodProducts.find(
        (p) => p.id === ingredient.foodProductId
      );
      if (product && ingredient.quantity > 0) {
        const ratio = ingredient.quantity / 100;
        calories += product.calories * ratio;
        protein += product.protein * ratio;
        carbs += product.carbs * ratio;
        fat += product.fat * ratio;

        if (product.fiber) {
          fiber += product.fiber * ratio;
        }

        if (product.sugar) {
          sugar += product.sugar * ratio;
        }
      }
    });

    setNutritionSummary({
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
    });
  };

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: "", foodProductId: "", quantity: 0, unit: "g", url: "" },
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length <= 1) return;
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index: number, field: string, value: any) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: field === "quantity" ? Number.parseFloat(value) || 0 : value,
    };
    setIngredients(newIngredients);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index: number) => {
    if (instructions.length <= 1) return;
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    setInstructions(newInstructions);
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAvailableToAllChange = (checked: boolean) => {
    setAvailableToAll(checked);
    if (checked) {
      setSelectedMemberships([]);
    }
  };

  const handleMembershipChange = (membershipId: string, checked: boolean) => {
    if (checked) {
      setSelectedMemberships((prev) => [...prev, membershipId]);
    } else {
      setSelectedMemberships((prev) =>
        prev.filter((id) => id !== membershipId)
      );
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);

      if (!title.trim()) {
        setMessage({
          type: "error",
          text: "Pavadinimas yra privalomas",
        });
        setLoading(false);
        return;
      }

      if (ingredients.some((i) => !i.foodProductId || i.quantity <= 0)) {
        setMessage({
          type: "error",
          text: "Visi ingredientai turi būti užpildyti teisingai",
        });
        setLoading(false);
        return;
      }

      if (instructions.some((i) => !i.trim())) {
        setMessage({
          type: "error",
          text: "Visi gaminimo žingsniai turi būti užpildyti",
        });
        setLoading(false);
        return;
      }

      if (!availableToAll && selectedMemberships.length === 0) {
        setMessage({
          type: "error",
          text: "Pasirinkite bent vieną narystę arba pažymėkite 'Prieinama visiems'",
        });
        setLoading(false);
        return;
      }

      const filteredInstructions = instructions.filter((i) => i.trim());

      const recipeData = {
        title,
        description,
        preparationTime: preparationTime || 0,
        cookingTime: cookingTime || 0,
        servings,
        difficulty,
        instructions: filteredInstructions,
        image,
        tags,
        isPublished,
        availableToAll,
        membershipIds: selectedMemberships,
        ingredients: ingredients.map((i) => ({
          id: i.id,
          foodProductId: i.foodProductId,
          quantity: Number.parseFloat(i.quantity),
          unit: i.unit,
          url: i.url || null,
        })),

        totalCalories: nutritionSummary.calories,
        totalProtein: nutritionSummary.protein,
        totalCarbs: nutritionSummary.carbs,
        totalFat: nutritionSummary.fat,
        totalFiber: nutritionSummary.fiber,
        totalSugar: nutritionSummary.sugar,
        caloriesPerServing: nutritionSummary.calories / servings,
        proteinPerServing: nutritionSummary.protein / servings,
        carbsPerServing: nutritionSummary.carbs / servings,
        fatPerServing: nutritionSummary.fat / servings,
        categoryId: selectedCategory || null,
      };

      const response = await fetch(`/api/admin/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      setMessage({
        type: "success",
        text: "Receptas sėkmingai atnaujintas",
      });

      setTimeout(() => {
        router.push("/admin/turinys/receptai");
      }, 1500);
    } catch (error) {
      console.error("Error updating recipe:", error);
      setMessage({
        type: "error",
        text: "Nepavyko atnaujinti recepto",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p>Kraunama...</p>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold">Redaguoti receptą</h1>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${
            message.type === "error"
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-green-50 text-green-800 border-green-200"
          }`}
        >
          <div className="flex items-center">
            {message.type === "error" ? (
              <AlertCircle className="h-4 w-4 mr-2" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </div>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Pagrindinė informacija</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Pavadinimas</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Recepto pavadinimas"
                />
              </div>
              <div>
                <Label htmlFor="description">Aprašymas</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Trumpas recepto aprašymas"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="preparationTime"
                    className="flex items-center"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Paruošimo laikas (min)
                  </Label>
                  <Input
                    id="preparationTime"
                    type="number"
                    min="0"
                    value={preparationTime || ""}
                    onChange={(e) =>
                      setPreparationTime(
                        Number.parseInt(e.target.value) || undefined
                      )
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="cookingTime" className="flex items-center">
                    <UtensilsCrossed className="h-4 w-4 mr-1" />
                    Gaminimo laikas (min)
                  </Label>
                  <Input
                    id="cookingTime"
                    type="number"
                    min="0"
                    value={cookingTime || ""}
                    onChange={(e) =>
                      setCookingTime(
                        Number.parseInt(e.target.value) || undefined
                      )
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="servings" className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Porcijų skaičius
                  </Label>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setServings(Math.max(1, servings - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="servings"
                      type="number"
                      min="1"
                      className="mx-2 text-center"
                      value={servings}
                      onChange={(e) =>
                        setServings(Number.parseInt(e.target.value) || 1)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setServings(servings + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="difficulty">Sudėtingumas</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Pasirinkite sudėtingumą" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Lengvas</SelectItem>
                      <SelectItem value="medium">Vidutinis</SelectItem>
                      <SelectItem value="hard">Sudėtingas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="image">Nuotraukos URL</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="category">Kategorija</Label>
                <div className="flex items-center mt-1">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Pasirinkite kategoriją" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nepriskirta</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() =>
                      router.push("/admin/turinys/receptai/kategorijos")
                    }
                  >
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Žymos</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="flex items-center gap-1 bg-[#60988E]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-xs rounded-full hover:bg-[#4e7d75] p-0.5"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Pašalinti</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Pridėti žymą"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                  >
                    Pridėti
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Ingredientai</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddIngredient}
              >
                <Plus className="h-4 w-4 mr-1" /> Pridėti ingredientą
              </Button>
            </div>

            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex flex-col gap-2 mb-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`ingredient-${index}`} className="text-xs">
                      Produktas
                    </Label>
                    <Select
                      value={ingredient.foodProductId}
                      onValueChange={(value) =>
                        handleIngredientChange(index, "foodProductId", value)
                      }
                    >
                      <SelectTrigger id={`ingredient-${index}`}>
                        <SelectValue placeholder="Pasirinkite produktą" />
                      </SelectTrigger>
                      <SelectContent>
                        {foodProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-24">
                    <Label htmlFor={`quantity-${index}`} className="text-xs">
                      Kiekis
                    </Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={ingredient.quantity || ""}
                      onChange={(e) =>
                        handleIngredientChange(
                          index,
                          "quantity",
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="w-24">
                    <Label htmlFor={`unit-${index}`} className="text-xs">
                      Vnt.
                    </Label>
                    <Select
                      value={ingredient.unit}
                      onValueChange={(value) =>
                        handleIngredientChange(index, "unit", value)
                      }
                    >
                      <SelectTrigger id={`unit-${index}`}>
                        <SelectValue placeholder="Pasirinkite vienetą" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="l">l</SelectItem>
                        <SelectItem value="vnt">vnt</SelectItem>
                        <SelectItem value="šaukštas">šaukštas</SelectItem>
                        <SelectItem value="šaukštelis">šaukštelis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveIngredient(index)}
                    disabled={ingredients.length === 1}
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Pašalinti</span>
                  </Button>
                </div>
                <div className="ml-1">
                  <Label htmlFor={`url-${index}`} className="text-xs">
                    URL nuoroda (neprivaloma)
                  </Label>
                  <Input
                    id={`url-${index}`}
                    type="url"
                    placeholder="https://example.com/ingredient"
                    value={ingredient.url || ""}
                    onChange={(e) =>
                      handleIngredientChange(index, "url", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Gaminimo eiga</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddInstruction}
              >
                <Plus className="h-4 w-4 mr-1" /> Pridėti žingsnį
              </Button>
            </div>

            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-2 mb-4">
                <div className="flex-shrink-0 bg-[#60988E] text-white rounded-full w-6 h-6 flex items-center justify-center mt-2">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <Textarea
                    value={instruction}
                    onChange={(e) =>
                      handleInstructionChange(index, e.target.value)
                    }
                    placeholder={`Žingsnis ${index + 1}`}
                    rows={2}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveInstruction(index)}
                  disabled={instructions.length === 1}
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 mt-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Pašalinti</span>
                </Button>
              </div>
            ))}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Publikavimas</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <Label htmlFor="isPublished">Publikuoti receptą</Label>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium mb-2">Narystės prieiga</h3>

                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="availableToAll"
                    checked={availableToAll}
                    onCheckedChange={handleAvailableToAllChange}
                  />
                  <Label htmlFor="availableToAll" className="font-medium">
                    Prieinama visiems planams
                  </Label>
                </div>

                {!availableToAll && (
                  <div className="space-y-2 pl-6">
                    <p className="text-sm text-gray-500 mb-2">
                      Pasirinkite, kuriems narystės planams bus prieinamas šis
                      receptas:
                    </p>

                    {memberships.map((membership) => (
                      <div
                        key={membership.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`membership-${membership.id}`}
                          checked={selectedMemberships.includes(membership.id)}
                          onCheckedChange={(checked) =>
                            handleMembershipChange(
                              membership.id,
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor={`membership-${membership.id}`}>
                          {membership.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Maistinė vertė</h2>
            <Tabs defaultValue="serving">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="serving" className="flex-1">
                  Vienai porcijai
                </TabsTrigger>
                <TabsTrigger value="total" className="flex-1">
                  Viso
                </TabsTrigger>
              </TabsList>

              <TabsContent value="serving" className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kalorijos:</span>
                  <span className="font-medium">
                    {Math.round(nutritionSummary.calories / servings)} kcal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Baltymai:</span>
                  <span className="font-medium">
                    {(nutritionSummary.protein / servings).toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Angliavandeniai:</span>
                  <span className="font-medium">
                    {(nutritionSummary.carbs / servings).toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Riebalai:</span>
                  <span className="font-medium">
                    {(nutritionSummary.fat / servings).toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Skaidulos:</span>
                  <span className="font-medium">
                    {(nutritionSummary.fiber / servings).toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cukrus:</span>
                  <span className="font-medium">
                    {(nutritionSummary.sugar / servings).toFixed(1)}g
                  </span>
                </div>
              </TabsContent>

              <TabsContent value="total" className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Kalorijos:</span>
                  <span className="font-medium">
                    {Math.round(nutritionSummary.calories)} kcal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Baltymai:</span>
                  <span className="font-medium">
                    {nutritionSummary.protein.toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Angliavandeniai:</span>
                  <span className="font-medium">
                    {nutritionSummary.carbs.toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Riebalai:</span>
                  <span className="font-medium">
                    {nutritionSummary.fat.toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Skaidulos:</span>
                  <span className="font-medium">
                    {nutritionSummary.fiber.toFixed(1)}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cukrus:</span>
                  <span className="font-medium">
                    {nutritionSummary.sugar.toFixed(1)}g
                  </span>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#60988E] hover:bg-[#4e7d75]"
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Išsaugoti receptą
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/turinys/receptai")}
              >
                Atšaukti
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
