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
  duration: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  targetMuscleGroups: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
  membershipId: z.string().optional(),
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

export default function NewWorkoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMuscleGroup, setNewMuscleGroup] = useState("");
  const [newEquipment, setNewEquipment] = useState("");
  const [memberships, setMemberships] = useState<
    { id: string; name: string; planId: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      difficulty: "medium",
      targetMuscleGroups: [],
      equipment: [],
      imageUrl: "",
      videoUrl: "",
      isPublished: false,
      membershipId: "",
    },
  });

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setLoading(true);
        console.log("Fetching memberships...");

        const response = await fetch("/api/admin/memberships");
        console.log("Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Memberships data:", data);

          if (Array.isArray(data)) {
            setMemberships(data);
            console.log("Memberships set:", data);
          } else {
            console.error("Memberships data is not an array:", data);
            setError("Narysčių duomenys neteisingi");
          }
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch memberships:", errorText);
          setError("Nepavyko gauti narysčių sąrašo");
        }
      } catch (error) {
        console.error("Error fetching memberships:", error);
        setError("Klaida gaunant narystes");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const formData = {
        ...values,
        membershipId:
          values.membershipId === "all" || !values.membershipId
            ? null
            : values.membershipId,
      };

      console.log("Submitting form data:", formData);

      const response = await fetch("/api/admin/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Treniruotė sėkmingai sukurta");
        router.push(`/admin/turinys/sportas/treniruotes/${data.workout.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko sukurti treniruotės");
      }
    } catch (error) {
      console.error("Error creating workout:", error);
      alert("Įvyko klaida bandant sukurti treniruotę");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMuscleGroup = () => {
    if (!newMuscleGroup) return;

    const currentGroups = form.getValues("targetMuscleGroups") || [];
    if (!currentGroups.includes(newMuscleGroup)) {
      form.setValue("targetMuscleGroups", [...currentGroups, newMuscleGroup]);
    }

    setNewMuscleGroup("");
  };

  const removeMuscleGroup = (group: string) => {
    const currentGroups = form.getValues("targetMuscleGroups") || [];
    form.setValue(
      "targetMuscleGroups",
      currentGroups.filter((g) => g !== group)
    );
  };

  const addEquipment = () => {
    if (!newEquipment) return;

    const currentEquipment = form.getValues("equipment") || [];
    if (!currentEquipment.includes(newEquipment)) {
      form.setValue("equipment", [...currentEquipment, newEquipment]);
    }

    setNewEquipment("");
  };

  const removeEquipment = (equipment: string) => {
    const currentEquipment = form.getValues("equipment") || [];
    form.setValue(
      "equipment",
      currentEquipment.filter((e) => e !== equipment)
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
        <h1 className="text-2xl font-bold text-gray-800">Nauja treniruotė</h1>
        <p className="text-gray-600">Sukurkite naują treniruotę</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Kraunami duomenys...</span>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Treniruotės informacija</CardTitle>
            <CardDescription>
              Įveskite pagrindinę informaciją apie treniruotę
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pavadinimas</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Įveskite treniruotės pavadinimą"
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
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trukmė (minutėmis)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Pvz.: 45"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Kiek minučių trunka treniruotė
                        </FormDescription>
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
                          placeholder="Įveskite treniruotės aprašymą"
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
                  name="targetMuscleGroups"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tikslinės raumenų grupės</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {field.value?.map((group) => (
                          <Badge
                            key={group}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {getMuscleGroupLabel(group)}
                            <button
                              type="button"
                              onClick={() => removeMuscleGroup(group)}
                              className="ml-1 rounded-full hover:bg-gray-200 p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Select
                          onValueChange={setNewMuscleGroup}
                          value={newMuscleGroup}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pasirinkite raumenų grupę" />
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
                          onClick={addMuscleGroup}
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
                  name="equipment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reikalinga įranga</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {field.value?.map((item) => (
                          <Badge
                            key={item}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {getEquipmentLabel(item)}
                            <button
                              type="button"
                              onClick={() => removeEquipment(item)}
                              className="ml-1 rounded-full hover:bg-gray-200 p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Select
                          onValueChange={setNewEquipment}
                          value={newEquipment}
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
                        <Button
                          type="button"
                          onClick={addEquipment}
                          variant="outline"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
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
                  name="membershipId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Narystė</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pasirinkite narystę" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">Visos narystės</SelectItem>
                          {memberships.length > 0 ? (
                            memberships.map((membership) => (
                              <SelectItem
                                key={membership.id}
                                value={membership.id}
                              >
                                {membership.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-memberships" disabled>
                              Nėra narysčių
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {memberships.length > 0
                          ? "Palikite tuščią, jei treniruotė prieinama visoms narystėms"
                          : "Nėra sukurtų narysčių. Pirmiausia sukurkite narystes."}
                      </FormDescription>
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
                        <FormLabel className="text-base">Publikuoti</FormLabel>
                        <FormDescription>
                          Ar treniruotė turėtų būti matoma vartotojams?
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
                    Sukurti treniruotę
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
