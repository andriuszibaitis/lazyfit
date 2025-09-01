"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Pavadinimas turi būti bent 2 simbolių ilgio" }),
  description: z.string().optional(),
  muscleGroup: z.string().optional(),
  secondaryMuscleGroups: z.array(z.string()).optional(),
  equipment: z.string().optional(),
  difficulty: z.string().optional(),
  instructions: z.string().optional(),
  tips: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
});

const muscleGroups = [
  { value: "chest", label: "Krūtinė" },
  { value: "back", label: "Nugara" },
  { value: "shoulders", label: "Pečiai" },
  { value: "arms", label: "Rankos" },
  { value: "legs", label: "Kojos" },
  { value: "core", label: "Pilvo presas" },
  { value: "fullBody", label: "Visas kūnas" },
];

const difficulties = [
  { value: "easy", label: "Lengvas" },
  { value: "medium", label: "Vidutinis" },
  { value: "hard", label: "Sunkus" },
];

export default function EditExercisePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      muscleGroup: "",
      secondaryMuscleGroups: [],
      equipment: "",
      difficulty: "",
      instructions: "",
      tips: "",
      imageUrl: "",
      videoUrl: "",
      isPublished: false,
    },
  });

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/exercises/${params.id}`);

        if (response.ok) {
          const data = await response.json();
          const exercise = data.exercise;

          const instructionsText = exercise.instructions
            ? exercise.instructions.join("\n")
            : "";
          const tipsText = exercise.tips ? exercise.tips.join("\n") : "";

          form.reset({
            name: exercise.name || "",
            description: exercise.description || "",
            muscleGroup: exercise.muscleGroup || "",
            secondaryMuscleGroups: exercise.secondaryMuscleGroups || [],
            equipment: exercise.equipment || "",
            difficulty: exercise.difficulty || "",
            instructions: instructionsText,
            tips: tipsText,
            imageUrl: exercise.imageUrl || "",
            videoUrl: exercise.videoUrl || "",
            isPublished: exercise.isPublished || false,
          });
        } else {
          alert("Nepavyko gauti pratimo duomenų");
          router.push("/admin/turinys/sportas/pratimai");
        }
      } catch (error) {
        console.error("Error fetching exercise:", error);
        alert("Įvyko klaida bandant gauti pratimo duomenis");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [params.id, router, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);

      const formData = {
        ...values,
        instructions: values.instructions
          ? values.instructions.split("\n").filter((line) => line.trim() !== "")
          : null,
        tips: values.tips
          ? values.tips.split("\n").filter((line) => line.trim() !== "")
          : null,
        secondaryMuscleGroups:
          values.secondaryMuscleGroups &&
          values.secondaryMuscleGroups.length > 0
            ? values.secondaryMuscleGroups
            : null,
      };

      const response = await fetch(`/api/admin/exercises/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Pratimas sėkmingai atnaujintas");
        router.push(`/admin/turinys/sportas/pratimai/${params.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko atnaujinti pratimo");
      }
    } catch (error) {
      console.error("Error updating exercise:", error);
      alert("Įvyko klaida bandant atnaujinti pratimą");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Kraunami pratimo duomenys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/admin/turinys/sportas/pratimai/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Grįžti į pratimo peržiūrą
          </Link>
        </Button>

        <h1 className="text-2xl font-bold text-gray-800">Redaguoti pratimą</h1>
        <p className="text-gray-600">Atnaujinkite pratimo informaciją</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pagrindinė informacija</CardTitle>
              <CardDescription>Pagrindiniai pratimo duomenys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pavadinimas *</FormLabel>
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
                  name="equipment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Įranga</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pvz.: Hanteliai, Štanga, TRX"
                          {...field}
                        />
                      </FormControl>
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
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pasirinkite raumenų grupę" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {muscleGroups.map((group) => (
                            <SelectItem key={group.value} value={group.value}>
                              {group.label}
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
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sudėtingumas</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pasirinkite sudėtingumą" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficulties.map((diff) => (
                            <SelectItem key={diff.value} value={diff.value}>
                              {diff.label}
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
                name="secondaryMuscleGroups"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Antrinės raumenų grupės</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {muscleGroups.map((group) => (
                        <div
                          key={group.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`secondary-${group.value}`}
                            checked={field.value?.includes(group.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([
                                  ...(field.value || []),
                                  group.value,
                                ]);
                              } else {
                                field.onChange(
                                  field.value?.filter(
                                    (value) => value !== group.value
                                  ) || []
                                );
                              }
                            }}
                            disabled={form.watch("muscleGroup") === group.value}
                          />
                          <label
                            htmlFor={`secondary-${group.value}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {group.label}
                          </label>
                        </div>
                      ))}
                    </div>
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
                        placeholder="Įveskite pratimo aprašymą"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Publikuoti pratimą
                      </FormLabel>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instrukcijos ir patarimai</CardTitle>
              <CardDescription>Kaip teisingai atlikti pratimą</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atlikimo instrukcijos</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Įveskite atlikimo instrukcijas (kiekviena nauja eilutė - nauja instrukcija)"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Kiekviena nauja eilutė bus atskira instrukcija
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
                    <FormControl>
                      <Textarea
                        placeholder="Įveskite patarimus (kiekviena nauja eilutė - naujas patarimas)"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Kiekviena nauja eilutė bus atskiras patarimas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medija</CardTitle>
              <CardDescription>Nuotraukos ir video</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href={`/admin/turinys/sportas/pratimai/${params.id}`}>
                Atšaukti
              </Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saugoma...
                </>
              ) : (
                "Išsaugoti"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
