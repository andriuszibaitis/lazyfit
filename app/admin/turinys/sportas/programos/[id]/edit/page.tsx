"use client";

import React from "react";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Pavadinimas turi būti bent 2 simbolių ilgio" }),
  description: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  duration: z.string().optional(),
  gender: z.enum(["all", "male", "female"]),
  goal: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
  membershipId: z.string().optional(),
});

type Membership = {
  id: string;
  name: string;
  planId: string;
};

type TrainingProgram = {
  id: string;
  name: string;
  description: string | null;
  difficulty: string;
  duration: number | null;
  gender: string;
  goal: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  isPublished: boolean;
  membershipId: string | null;
  membership: { name: string; planId: string } | null;
  programWorkouts: any[];
  createdAt: string;
  updatedAt: string;
};

export default function EditTrainingProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [program, setProgram] = useState<TrainingProgram | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      difficulty: "medium",
      duration: "",
      gender: "all",
      goal: "",
      imageUrl: "",
      videoUrl: "",
      isPublished: false,
      membershipId: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const membershipsResponse = await fetch("/api/admin/memberships");
        if (membershipsResponse.ok) {
          const membershipsData = await membershipsResponse.json();
          setMemberships(membershipsData.memberships || []);
        }

        const programResponse = await fetch(
          `/api/admin/training-programs/${id}`
        );
        if (programResponse.ok) {
          const programData = await programResponse.json();
          setProgram(programData.program);

          form.reset({
            name: programData.program.name,
            description: programData.program.description || "",
            difficulty: programData.program.difficulty,
            duration: programData.program.duration
              ? String(programData.program.duration)
              : "",
            gender: programData.program.gender,
            goal: programData.program.goal || "",
            imageUrl: programData.program.imageUrl || "",
            videoUrl: programData.program.videoUrl || "",
            isPublished: programData.program.isPublished,
            membershipId: programData.program.membershipId || "all",
          });
        } else {
          alert("Nepavyko gauti programos duomenų");
          router.push("/admin/turinys/sportas");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Įvyko klaida bandant gauti duomenis");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, form, router]);

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

      const response = await fetch(`/api/admin/training-programs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Treniruočių programa sėkmingai atnaujinta");
        router.push(`/admin/turinys/sportas/programos/${id}`);
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko atnaujinti programos");
      }
    } catch (error) {
      console.error("Error updating program:", error);
      alert("Įvyko klaida bandant atnaujinti programą");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Kraunami programos duomenys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/admin/turinys/sportas/programos/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Grįžti
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          Redaguoti treniruočių programą
        </h1>
        <p className="text-gray-600">Atnaujinkite programos informaciją</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programos informacija</CardTitle>
          <CardDescription>
            Redaguokite pagrindinę informaciją apie treniruočių programą
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
                          placeholder="Įveskite programos pavadinimą"
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
                      <FormLabel>Trukmė (dienomis)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Pvz.: 28"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Kiek dienų trunka programa
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            <SelectValue placeholder="Pasirinkite tikslinę lytį" />
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
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tikslas</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pvz.: Svorio metimas, raumenų auginimas"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="membershipId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Narystė</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "all"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pasirinkite narystę" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">Visos narystės</SelectItem>
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
                        Palikite tuščią, jei programa prieinama visoms narystėms
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
                        placeholder="Įveskite programos aprašymą"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
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
                        Ar programa turėtų būti matoma vartotojams?
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
                  Atnaujinti programą
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
