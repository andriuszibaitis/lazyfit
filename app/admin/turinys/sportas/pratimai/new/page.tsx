"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Pavadinimas turi būti bent 2 simbolių ilgio" }),
  description: z.string().optional(),
  muscleGroup: z.string().optional(),
  secondaryMuscleGroups: z.array(z.string()).optional(),
  equipment: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  instructions: z.array(z.string()).optional(),
  tips: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
});

const muscleGroups = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "forearms",
  "abs",
  "quads",
  "hamstrings",
  "calves",
  "glutes",
  "cardio",
  "full_body",
];

const equipmentOptions = [
  "bodyweight",
  "dumbbells",
  "barbell",
  "kettlebell",
  "resistance_bands",
  "cable_machine",
  "smith_machine",
  "bench",
  "pull_up_bar",
  "medicine_ball",
  "bosu_ball",
];

const getMuscleGroupLabel = (group: string) => {
  const labels: Record<string, string> = {
    chest: "Krūtinė",
    back: "Nugara",
    shoulders: "Pečiai",
    biceps: "Bicepsai",
    triceps: "Tricepsai",
    forearms: "Dilbiai",
    abs: "Pilvo presas",
    quads: "Keturgalvis",
    hamstrings: "Dvigalvis",
    calves: "Blauzdos",
    glutes: "Sėdmenys",
    cardio: "Kardio",
    full_body: "Visas kūnas",
  };
  return labels[group] || group;
};

const getEquipmentLabel = (equipment: string) => {
  const labels: Record<string, string> = {
    bodyweight: "Kūno svoris",
    dumbbells: "Hanteliai",
    barbell: "Štanga",
    kettlebell: "Girija",
    resistance_bands: "Pasipriešinimo gumos",
    cable_machine: "Trosas",
    smith_machine: "Smith mašina",
    bench: "Suoliukas",
    pull_up_bar: "Skersinis",
    medicine_ball: "Medicininis kamuolys",
    bosu_ball: "Bosu kamuolys",
  };
  return labels[equipment] || equipment;
};

export default function NewExercisePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSecondaryMuscle, setNewSecondaryMuscle] = useState("");
  const [newInstruction, setNewInstruction] = useState("");
  const [newTip, setNewTip] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      muscleGroup: "",
      secondaryMuscleGroups: [],
      equipment: "",
      difficulty: "medium",
      instructions: [],
      tips: [],
      imageUrl: "",
      videoUrl: "",
      isPublished: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/admin/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Pratimas sėkmingai sukurtas");
        router.push(`/admin/turinys/sportas/pratimai/${data.exercise.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko sukurti pratimo");
      }
    } catch (error) {
      console.error("Error creating exercise:", error);
      alert("Įvyko klaida bandant sukurti pratimą");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSecondaryMuscle = () => {
    if (!newSecondaryMuscle) return;

    const currentMuscles = form.getValues("secondaryMuscleGroups") || [];
    if (!currentMuscles.includes(newSecondaryMuscle)) {
      form.setValue("secondaryMuscleGroups", [
        ...currentMuscles,
        newSecondaryMuscle,
      ]);
    }

    setNewSecondaryMuscle("");
  };

  const removeSecondaryMuscle = (muscle: string) => {
    const currentMuscles = form.getValues("secondaryMuscleGroups") || [];
    form.setValue(
      "secondaryMuscleGroups",
      currentMuscles.filter((m) => m !== muscle)
    );
  };

  const addInstruction = () => {
    if (!newInstruction) return;

    const currentInstructions = form.getValues("instructions") || [];
    form.setValue("instructions", [...currentInstructions, newInstruction]);
    setNewInstruction("");
  };

  const removeInstruction = (index: number) => {
    const currentInstructions = form.getValues("instructions") || [];
    form.setValue(
      "instructions",
      currentInstructions.filter((_, i) => i !== index)
    );
  };

  const addTip = () => {
    if (!newTip) return;

    const currentTips = form.getValues("tips") || [];
    form.setValue("tips", [...currentTips, newTip]);
    setNewTip("");
  };

  const removeTip = (index: number) => {
    const currentTips = form.getValues("tips") || [];
    form.setValue(
      "tips",
      currentTips.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/turinys/sportas">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Grįžti
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Naujas pratimas</h1>
        <p className="text-gray-600">Sukurkite naują pratimą</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pratimo informacija</CardTitle>
          <CardDescription>
            Įveskite pagrindinę informaciją apie pratimą
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pavadinimas</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Įveskite pratimo pavadinimą"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sudėtingumas</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pasirinkite sudėtingumą" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Lengvas</SelectItem>
                          <SelectItem value="medium">Vidutinis</SelectItem>
                          <SelectItem value="hard">Sunkus</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="muscleGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pagrindinė raumenų grupė</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pasirinkite pagrindinę raumenų grupę" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {muscleGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {getMuscleGroupLabel(group)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equipment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reikalinga įranga</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pasirinkite įrangą" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {equipmentOptions.map((item) => (
                            <SelectItem key={item} value={item}>
                              {getEquipmentLabel(item)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aprašymas</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Įveskite pratimo aprašymą"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondaryMuscleGroups"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Antrinės raumenų grupės</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {field.value?.map((muscle) => (
                        <Badge
                          key={muscle}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {getMuscleGroupLabel(muscle)}
                          <button
                            type="button"
                            onClick={() => removeSecondaryMuscle(muscle)}
                            className="ml-1 rounded-full hover:bg-gray-200 p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={setNewSecondaryMuscle}
                        value={newSecondaryMuscle}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pasirinkite antrinę raumenų grupę" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {muscleGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {getMuscleGroupLabel(group)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        onClick={addSecondaryMuscle}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atlikimo instrukcijos</FormLabel>
                    <div className="space-y-2 mb-2">
                      {field.value?.map((instruction, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 border rounded-md"
                        >
                          <span className="flex-1">
                            {index + 1}. {instruction}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeInstruction(index)}
                            className="rounded-full hover:bg-gray-200 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Įveskite instrukciją"
                        value={newInstruction}
                        onChange={(e) => setNewInstruction(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addInstruction();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addInstruction}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>
                      Įveskite atlikimo instrukcijas žingsnis po žingsnio
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tips"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patarimai</FormLabel>
                    <div className="space-y-2 mb-2">
                      {field.value?.map((tip, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 border rounded-md"
                        >
                          <span className="flex-1">• {tip}</span>
                          <button
                            type="button"
                            onClick={() => removeTip(index)}
                            className="rounded-full hover:bg-gray-200 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Įveskite patarimą"
                        value={newTip}
                        onChange={(e) => setNewTip(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTip();
                          }
                        }}
                      />
                      <Button type="button" onClick={addTip} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>
                      Įveskite naudingus patarimus, kaip teisingai atlikti
                      pratimą
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        />
                      </FormControl>
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Publikuoti</FormLabel>
                      <FormDescription>
                        Ar pratimas turėtų būti matomas vartotojams?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <CardFooter className="flex justify-end px-0 pb-0">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sukurti pratimą
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
