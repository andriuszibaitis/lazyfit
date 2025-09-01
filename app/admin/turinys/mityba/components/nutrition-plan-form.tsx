"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  name: z.string().min(1, "Pavadinimas yra privalomas"),
  description: z.string().optional(),
  gender: z.string().default("all"),
  membershipId: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
});

interface FoodProduct {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealItem {
  id?: string;
  foodProductId: string;
  foodProductName: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  id?: string;
  mealNumber: number;
  name: string;
  items: MealItem[];
}

interface Day {
  id?: string;
  dayNumber: number;
  meals: Meal[];
}

interface Membership {
  id: string;
  name: string;
}

interface NutritionPlan {
  id: string;
  name: string;
  description: string | null;
  gender: string;
  membershipId: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  isPublished: boolean;
  days: Day[];
}

interface NutritionPlanFormProps {
  initialData?: NutritionPlan;
}

export default function NutritionPlanForm({
  initialData,
}: NutritionPlanFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [foodProducts, setFoodProducts] = useState<FoodProduct[]>([]);
  const [foodProductsLoaded, setFoodProductsLoaded] = useState(false);
  const [days, setDays] = useState<Day[]>(initialData?.days || []);
  const [activeTab, setActiveTab] = useState("details");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      gender: initialData?.gender || "all",
      membershipId: initialData?.membershipId || undefined,
      imageUrl: initialData?.imageUrl || "",
      videoUrl: initialData?.videoUrl || "",
      isPublished: initialData?.isPublished || false,
    },
  });

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await fetch("/api/admin/memberships");
        if (response.ok) {
          const data = await response.json();
          setMemberships(data || []);
        }
      } catch (error) {
        console.error("Error fetching memberships:", error);
        setFormError("Nepavyko gauti narysčių sąrašo");
        setMemberships([]);
      }
    };

    const fetchFoodProducts = async () => {
      try {
        const response = await fetch("/api/admin/food-products");
        if (response.ok) {
          const data = await response.json();
          console.log("Food products API response:", data);

          if (data && data.products && Array.isArray(data.products)) {
            setFoodProducts(data.products);
            console.log("Food products set:", data.products);
          } else {
            console.error("Food products data structure is unexpected:", data);
            setFoodProducts([]);
          }
        } else {
          console.error(
            "Failed to fetch food products, status:",
            response.status
          );
          setFoodProducts([]);
        }
      } catch (error) {
        console.error("Error fetching food products:", error);
        setFormError("Nepavyko gauti maisto produktų sąrašo");
        setFoodProducts([]);
      } finally {
        setFoodProductsLoaded(true);
      }
    };

    fetchMemberships();
    fetchFoodProducts();
  }, []);

  const addDay = () => {
    const newDayNumber =
      days.length > 0 ? Math.max(...days.map((d) => d.dayNumber)) + 1 : 1;
    setDays([...days, { dayNumber: newDayNumber, meals: [] }]);
    setActiveTab(`day-${newDayNumber}`);
  };

  const removeDay = (dayNumber: number) => {
    setDays(days.filter((day) => day.dayNumber !== dayNumber));
    setActiveTab("details");
  };

  const addMeal = (dayNumber: number) => {
    const dayIndex = days.findIndex((day) => day.dayNumber === dayNumber);
    if (dayIndex === -1) return;

    const day = days[dayIndex];
    const newMealNumber =
      day.meals.length > 0
        ? Math.max(...day.meals.map((m) => m.mealNumber)) + 1
        : 1;
    const newMeal: Meal = {
      mealNumber: newMealNumber,
      name: `Valgymas ${newMealNumber}`,
      items: [],
    };

    const updatedDays = [...days];
    updatedDays[dayIndex] = {
      ...day,
      meals: [...day.meals, newMeal],
    };

    setDays(updatedDays);
  };

  const removeMeal = (dayNumber: number, mealNumber: number) => {
    const dayIndex = days.findIndex((day) => day.dayNumber === dayNumber);
    if (dayIndex === -1) return;

    const day = days[dayIndex];
    const updatedMeals = day.meals.filter(
      (meal) => meal.mealNumber !== mealNumber
    );

    const updatedDays = [...days];
    updatedDays[dayIndex] = {
      ...day,
      meals: updatedMeals,
    };

    setDays(updatedDays);
  };

  const addFoodProduct = (
    dayNumber: number,
    mealNumber: number,
    foodProductId: string,
    quantity: number
  ) => {
    const dayIndex = days.findIndex((day) => day.dayNumber === dayNumber);
    if (dayIndex === -1) return;

    const day = days[dayIndex];
    const mealIndex = day.meals.findIndex(
      (meal) => meal.mealNumber === mealNumber
    );
    if (mealIndex === -1) return;

    const foodProduct = foodProducts.find((fp) => fp.id === foodProductId);
    if (!foodProduct) return;

    const ratio = quantity / 100;
    const newItem: MealItem = {
      foodProductId,
      foodProductName: foodProduct.name,
      quantity,
      calories: foodProduct.calories * ratio,
      protein: foodProduct.protein * ratio,
      carbs: foodProduct.carbs * ratio,
      fat: foodProduct.fat * ratio,
    };

    const updatedDays = [...days];
    updatedDays[dayIndex].meals[mealIndex].items = [
      ...updatedDays[dayIndex].meals[mealIndex].items,
      newItem,
    ];

    setDays(updatedDays);
  };

  const removeFoodProduct = (
    dayNumber: number,
    mealNumber: number,
    index: number
  ) => {
    const dayIndex = days.findIndex((day) => day.dayNumber === dayNumber);
    if (dayIndex === -1) return;

    const day = days[dayIndex];
    const mealIndex = day.meals.findIndex(
      (meal) => meal.mealNumber === mealNumber
    );
    if (mealIndex === -1) return;

    const updatedItems = [...day.meals[mealIndex].items];
    updatedItems.splice(index, 1);

    const updatedDays = [...days];
    updatedDays[dayIndex].meals[mealIndex].items = updatedItems;

    setDays(updatedDays);
  };

  const updateMealName = (
    dayNumber: number,
    mealNumber: number,
    name: string
  ) => {
    const dayIndex = days.findIndex((day) => day.dayNumber === dayNumber);
    if (dayIndex === -1) return;

    const day = days[dayIndex];
    const mealIndex = day.meals.findIndex(
      (meal) => meal.mealNumber === mealNumber
    );
    if (mealIndex === -1) return;

    const updatedDays = [...days];
    updatedDays[dayIndex].meals[mealIndex].name = name;

    setDays(updatedDays);
  };

  const calculateMealTotals = (items: MealItem[]) => {
    return items.reduce(
      (acc, item) => {
        return {
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const calculateDayTotals = (meals: Meal[]) => {
    return meals.reduce(
      (acc, meal) => {
        const mealTotals = calculateMealTotals(meal.items);
        return {
          calories: acc.calories + mealTotals.calories,
          protein: acc.protein + mealTotals.protein,
          carbs: acc.carbs + mealTotals.carbs,
          fat: acc.fat + mealTotals.fat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (days.length === 0) {
      setFormError("Pridėkite bent vieną dieną į mitybos planą");
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    try {
      const payload = {
        ...values,
        days: days.map((day) => ({
          ...day,
          meals: day.meals.map((meal) => ({
            ...meal,
            items: meal.items,
          })),
        })),
      };

      const url = initialData
        ? `/api/admin/nutrition-plans/${initialData.id}`
        : "/api/admin/nutrition-plans";

      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormSuccess(
          initialData
            ? "Mitybos planas sėkmingai atnaujintas"
            : "Naujas mitybos planas sėkmingai sukurtas"
        );

        setTimeout(() => {
          router.push("/admin/turinys/mityba");
          router.refresh();
        }, 1500);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Įvyko klaida");
      }
    } catch (error) {
      console.error("Error saving nutrition plan:", error);
      setFormError("Nepavyko išsaugoti mitybos plano. Bandykite dar kartą.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {formError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          {formSuccess && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{formSuccess}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="details">Pagrindinė informacija</TabsTrigger>
              {days.map((day) => (
                <TabsTrigger key={day.dayNumber} value={`day-${day.dayNumber}`}>
                  Diena {day.dayNumber}
                </TabsTrigger>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDay}
                className="ml-2"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Pridėti dieną
              </Button>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Pagrindinė informacija</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pavadinimas</FormLabel>
                        <FormControl>
                          <Input placeholder="Įveskite pavadinimą" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aprašymas</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Įveskite aprašymą"
                            className="min-h-32"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lytis</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pasirinkite lytį" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">Visiems</SelectItem>
                              <SelectItem value="male">Vyrams</SelectItem>
                              <SelectItem value="female">Moterims</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="membershipId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Narystės planas</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pasirinkite narystės planą" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="null">Nepriskirta</SelectItem>
                              {memberships.map((membership) => (
                                <SelectItem
                                  key={membership.id}
                                  value={membership.id}
                                >
                                  {membership.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Pasirinkite narystės planą, kuriam bus prieinamas
                            šis mitybos planas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nuotraukos URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Įveskite nuotraukos URL adresą
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://youtube.com/watch?v=..."
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Įveskite video URL adresą (YouTube, Vimeo ir t.t.)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Publikuoti</FormLabel>
                          <FormDescription>
                            Pažymėkite, jei norite, kad mitybos planas būtų
                            matomas vartotojams
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {days.map((day) => (
              <TabsContent key={day.dayNumber} value={`day-${day.dayNumber}`}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Diena {day.dayNumber}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addMeal(day.dayNumber)}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Pridėti valgymą
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeDay(day.dayNumber)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Ištrinti dieną
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {day.meals.length === 0 ? (
                      <div className="text-center p-6 border rounded-lg">
                        <p className="text-muted-foreground">
                          Šiai dienai dar nepridėta valgymų. Pridėkite valgymą
                          paspaudę mygtuką viršuje.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {day.meals.map((meal, mealIndex) => {
                          const mealTotals = calculateMealTotals(meal.items);

                          return (
                            <div
                              key={mealIndex}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={meal.name}
                                    onChange={(e) =>
                                      updateMealName(
                                        day.dayNumber,
                                        meal.mealNumber,
                                        e.target.value
                                      )
                                    }
                                    className="font-medium w-64"
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    #{meal.mealNumber}
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    removeMeal(day.dayNumber, meal.mealNumber)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Ištrinti
                                </Button>
                              </div>

                              <div className="mb-4">
                                <div className="flex flex-wrap gap-2 mb-2">
                                  <Select
                                    onValueChange={(value) => {
                                      const quantity = 100;
                                      addFoodProduct(
                                        day.dayNumber,
                                        meal.mealNumber,
                                        value,
                                        quantity
                                      );
                                    }}
                                  >
                                    <SelectTrigger className="w-[250px]">
                                      <SelectValue placeholder="Pridėti maisto produktą" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.isArray(foodProducts) &&
                                      foodProducts.length > 0 ? (
                                        foodProducts.map((product) => (
                                          <SelectItem
                                            key={product.id}
                                            value={product.id}
                                          >
                                            {product.name}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem
                                          value="no-products"
                                          disabled
                                        >
                                          {foodProductsLoaded
                                            ? "Nėra maisto produktų"
                                            : "Kraunami produktai..."}
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {meal.items.length > 0 ? (
                                <div>
                                  <div className="grid grid-cols-12 gap-2 font-medium text-sm mb-2">
                                    <div className="col-span-4">Produktas</div>
                                    <div className="col-span-2">Kiekis (g)</div>
                                    <div className="col-span-1">Kcal</div>
                                    <div className="col-span-1">Balt. (g)</div>
                                    <div className="col-span-1">Angl. (g)</div>
                                    <div className="col-span-1">Rieb. (g)</div>
                                    <div className="col-span-2"></div>
                                  </div>

                                  {meal.items.map((item, itemIndex) => (
                                    <div
                                      key={itemIndex}
                                      className="grid grid-cols-12 gap-2 items-center py-2 border-t"
                                    >
                                      <div className="col-span-4">
                                        {item.foodProductName}
                                      </div>
                                      <div className="col-span-2">
                                        <Input
                                          type="number"
                                          min="1"
                                          value={item.quantity}
                                          onChange={(e) => {
                                            const newQuantity =
                                              Number.parseFloat(
                                                e.target.value
                                              ) || 0;
                                            const foodProduct =
                                              foodProducts.find(
                                                (fp) =>
                                                  fp.id === item.foodProductId
                                              );
                                            if (!foodProduct) return;

                                            const ratio = newQuantity / 100;
                                            const updatedItem = {
                                              ...item,
                                              quantity: newQuantity,
                                              calories:
                                                foodProduct.calories * ratio,
                                              protein:
                                                foodProduct.protein * ratio,
                                              carbs: foodProduct.carbs * ratio,
                                              fat: foodProduct.fat * ratio,
                                            };

                                            const updatedDays = [...days];
                                            const dayIndex =
                                              updatedDays.findIndex(
                                                (d) =>
                                                  d.dayNumber === day.dayNumber
                                              );
                                            const mealIndex = updatedDays[
                                              dayIndex
                                            ].meals.findIndex(
                                              (m) =>
                                                m.mealNumber === meal.mealNumber
                                            );
                                            updatedDays[dayIndex].meals[
                                              mealIndex
                                            ].items[itemIndex] = updatedItem;

                                            setDays(updatedDays);
                                          }}
                                          className="h-8"
                                        />
                                      </div>
                                      <div className="col-span-1">
                                        {Math.round(item.calories)}
                                      </div>
                                      <div className="col-span-1">
                                        {item.protein.toFixed(1)}
                                      </div>
                                      <div className="col-span-1">
                                        {item.carbs.toFixed(1)}
                                      </div>
                                      <div className="col-span-1">
                                        {item.fat.toFixed(1)}
                                      </div>
                                      <div className="col-span-2 text-right">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            removeFoodProduct(
                                              day.dayNumber,
                                              meal.mealNumber,
                                              itemIndex
                                            )
                                          }
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}

                                  <div className="grid grid-cols-12 gap-2 font-medium py-2 border-t">
                                    <div className="col-span-4">Iš viso:</div>
                                    <div className="col-span-2"></div>
                                    <div className="col-span-1">
                                      {Math.round(mealTotals.calories)}
                                    </div>
                                    <div className="col-span-1">
                                      {mealTotals.protein.toFixed(1)}
                                    </div>
                                    <div className="col-span-1">
                                      {mealTotals.carbs.toFixed(1)}
                                    </div>
                                    <div className="col-span-1">
                                      {mealTotals.fat.toFixed(1)}
                                    </div>
                                    <div className="col-span-2"></div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center p-4 border rounded-lg">
                                  <p className="text-muted-foreground">
                                    Šiam valgymui dar nepridėta produktų.
                                    Pridėkite produktą iš sąrašo viršuje.
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {day.meals.length > 0 && (
                      <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-medium mb-2">
                          Dienos maistinės vertės
                        </h3>
                        <div className="grid grid-cols-4 gap-4">
                          {(() => {
                            const dayTotals = calculateDayTotals(day.meals);
                            return (
                              <>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Kalorijos
                                  </p>
                                  <p className="font-medium">
                                    {Math.round(dayTotals.calories)} kcal
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Baltymai
                                  </p>
                                  <p className="font-medium">
                                    {dayTotals.protein.toFixed(1)} g
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Angliavandeniai
                                  </p>
                                  <p className="font-medium">
                                    {dayTotals.carbs.toFixed(1)} g
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Riebalai
                                  </p>
                                  <p className="font-medium">
                                    {dayTotals.fat.toFixed(1)} g
                                  </p>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saugoma...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  {initialData
                    ? "Atnaujinti mitybos planą"
                    : "Sukurti mitybos planą"}
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
