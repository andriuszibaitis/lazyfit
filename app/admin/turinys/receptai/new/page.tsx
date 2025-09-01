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
  Users,
  BookOpen,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function NewRecipePage() {
  const router = useRouter();
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
  const [memberships, setMemberships] = useState<any[]>([]);
  const [selectedMemberships, setSelectedMemberships] = useState<string[]>([]);

  const [ingredients, setIngredients] = useState<any[]>([
    { foodProductId: "", quantity: 0, unit: "g", url: "" },
  ]);

  const [foodProducts, setFoodProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        const foodResponse = await fetch("/api/admin/food-products");
        if (!foodResponse.ok) {
          throw new Error("Failed to fetch food products");
        }
        const foodData = await foodResponse.json();
        setFoodProducts(foodData.products || []);

        const membershipResponse = await fetch("/api/admin/memberships");
        if (!membershipResponse.ok) {
          throw new Error("Failed to fetch memberships");
        }
        const membershipData = await membershipResponse.json();
        setMemberships(membershipData || []);

        const categoryResponse = await fetch("/api/admin/recipe-categories");
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoryData = await categoryResponse.json();
        setCategories(categoryData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Nepavyko gauti duomenų");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    calculateNutrition();
  }, [ingredients]);

  const calculateNutrition = () => {
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
      if (product && ingredient.quantity) {
        const ratio = ingredient.quantity / product.serving;
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
      { foodProductId: "", quantity: 0, unit: "g", url: "" },
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index: number, field: string, value: any) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleRemoveInstruction = (index: number) => {
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

  const handleMembershipChange = (membershipId: string, checked: boolean) => {
    if (checked) {
      setSelectedMemberships([...selectedMemberships, membershipId]);
    } else {
      setSelectedMemberships(
        selectedMemberships.filter((id) => id !== membershipId)
      );
    }
  };

  const handleAvailableToAllChange = (checked: boolean) => {
    setAvailableToAll(checked);
    if (checked) {
      setSelectedMemberships([]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (!title.trim()) {
        setError("Pavadinimas yra privalomas");
        return;
      }

      if (
        ingredients.length === 0 ||
        ingredients.some((i) => !i.foodProductId || i.quantity <= 0)
      ) {
        setError("Visi ingredientai turi būti užpildyti teisingai");
        return;
      }

      if (instructions.some((i) => !i.trim())) {
        setError("Visi gaminimo žingsniai turi būti užpildyti");
        return;
      }

      if (!availableToAll && selectedMemberships.length === 0) {
        setError(
          "Pasirinkite bent vieną narystę arba pažymėkite 'Prieinama visiems'"
        );
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
        categoryId:
          selectedCategory === "none" ? null : selectedCategory || null,
        ingredients: ingredients.map((i) => ({
          foodProductId: i.foodProductId,
          quantity: Number.parseFloat(i.quantity),
          unit: i.unit,
          url: i.url || null,
        })),
      };

      const response = await fetch("/api/admin/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        throw new Error("Failed to create recipe");
      }

      router.push("/admin/turinys/receptai");
      router.refresh();
    } catch (error) {
      console.error("Error creating recipe:", error);
      setError("Nepavyko sukurti recepto");
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold">Naujas receptas</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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
                  <Label htmlFor="preparationTime">
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
                  <Label htmlFor="cookingTime">Gaminimo laikas (min)</Label>
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
                  <Label htmlFor="servings">Porcijų skaičius</Label>
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
                      <SelectItem value="none">Nepriskirta</SelectItem>
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <Label htmlFor="isPublished">Publikuoti receptą</Label>
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
            <h2 className="text-lg font-medium mb-4">Narystės prieiga</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="availableToAll"
                  checked={availableToAll}
                  onCheckedChange={handleAvailableToAllChange}
                />
                <Label
                  htmlFor="availableToAll"
                  className="font-medium flex items-center"
                >
                  <Users className="h-4 w-4 mr-2 text-[#60988E]" />
                  Prieinama visiems planams
                </Label>
              </div>

              {!availableToAll && (
                <div className="space-y-2 pl-6 mt-2">
                  <p className="text-sm text-gray-500 mb-2">
                    Pasirinkite, kuriems narystės planams bus prieinamas šis
                    receptas:
                  </p>

                  {memberships.length > 0 ? (
                    memberships.map((membership) => (
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
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      Narysčių sąrašas kraunasi...
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Kategorija</h2>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Pasirinkite kategoriją" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          <Card className="p-6 sticky top-6">
            <h2 className="text-lg font-medium mb-4">Maistinė vertė</h2>
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <UtensilsCrossed className="h-4 w-4 mr-1 text-[#60988E]" />
                Maistinė vertė (1 porcijai)
              </h3>
              <div className="space-y-2 text-sm">
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
              </div>
            </div>

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
