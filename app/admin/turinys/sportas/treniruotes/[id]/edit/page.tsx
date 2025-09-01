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
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Pavadinimas turi būti bent 2 simbolių ilgio" }),
  description: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  duration: z.number().min(1).optional(),
  equipment: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
  membershipId: z.string().optional(),
});

export default function EditWorkoutPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [memberships, setMemberships] = useState<
    { id: string; name: string }[]
  >([]);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      difficulty: "medium",
      duration: undefined,
      equipment: "",
      imageUrl: "",
      videoUrl: "",
      isPublished: false,
      membershipId: "default",
    },
  });

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await fetch("/api/memberships");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched memberships:", data);
          setMemberships(data || []);
        } else {
          console.error("Failed to fetch memberships:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching memberships:", error);
      }
    };

    const fetchWorkout = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/workouts/${params.id}`);

        if (response.ok) {
          const data = await response.json();
          const workout = data.workout;

          console.log("Workout data from API:", workout);
          console.log("Membership ID:", workout.membershipId);
          console.log("Membership:", workout.membership);

          setDebugInfo({
            workoutId: workout.id,
            workoutName: workout.name,
            membershipId: workout.membershipId,
            membership: workout.membership,
          });

          form.reset({
            name: workout.name,
            description: workout.description || "",
            difficulty: workout.difficulty || "medium",
            duration: workout.duration || undefined,
            equipment: Array.isArray(workout.equipment)
              ? workout.equipment.join(", ")
              : "",
            imageUrl: workout.imageUrl || "",
            videoUrl: workout.videoUrl || "",
            isPublished: workout.isPublished || false,
            membershipId: workout.membershipId || "default",
          });
        } else {
          alert("Nepavyko gauti treniruotės duomenų");
          router.push("/admin/turinys/sportas/treniruotes");
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
        alert("Įvyko klaida bandant gauti treniruotės duomenis");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberships();
    fetchWorkout();
  }, [params.id, router, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);
      console.log("Submitting form with values:", values);

      const response = await fetch(`/api/admin/workouts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          equipment: values.equipment
            ? values.equipment.split(",").map((item) => item.trim())
            : [],
          membershipId:
            values.membershipId === "default" ? null : values.membershipId,
        }),
      });

      if (response.ok) {
        alert("Treniruotė sėkmingai atnaujinta");
        router.push(`/admin/turinys/sportas/treniruotes/${params.id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko atnaujinti treniruotės");
      }
    } catch (error) {
      console.error("Error updating workout:", error);
      alert("Įvyko klaida bandant atnaujinti treniruotę");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Kraunami treniruotės duomenys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/admin/turinys/sportas/treniruotes/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Grįžti į treniruotės peržiūrą
          </Link>
        </Button>

        <h1 className="text-2xl font-bold text-gray-800">
          Redaguoti treniruotę
        </h1>
        <p className="text-gray-600">Atnaujinkite treniruotės informaciją</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pagrindinė informacija</CardTitle>
              <CardDescription>
                Pagrindiniai treniruotės duomenys
              </CardDescription>
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
                        value={field.value}
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
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Kiek minučių trunka treniruotė
                      </FormDescription>
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
              </div>

              <FormField
                control={form.control}
                name="membershipId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Narystė</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pasirinkite narystę" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="default">
                          Visiems vartotojams
                        </SelectItem>
                        {memberships.map((membership) => (
                          <SelectItem key={membership.id} value={membership.id}>
                            {membership.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Pasirinkite, kokią narystę turi turėti vartotojas, kad
                      galėtų matyti šią treniruotę
                    </FormDescription>
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
                        placeholder="Įveskite treniruotės aprašymą"
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
                        Publikuoti treniruotę
                      </FormLabel>
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
              <Link href={`/admin/turinys/sportas/treniruotes/${params.id}`}>
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
