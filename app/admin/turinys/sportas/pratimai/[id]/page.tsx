"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Dumbbell,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Loader2 } from "lucide-react";

type Exercise = {
  id: string;
  name: string;
  description: string | null;
  muscleGroup: string | null;
  secondaryMuscleGroups: string[] | null;
  equipment: string | null;
  difficulty: string | null;
  instructions: string[] | null;
  tips: string[] | null;
  imageUrl: string | null;
  videoUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  workoutExercises: {
    id: string;
    workoutId: string;
    workout: {
      id: string;
      name: string;
    };
  }[];
};

export default function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/exercises/${id}`);

        if (response.ok) {
          const data = await response.json();
          setExercise(data.exercise);
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
  }, [id, router]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Ar tikrai norite ištrinti šį pratimą? Šio veiksmo negalima atšaukti."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/admin/exercises/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Pratimas sėkmingai ištrintas");
        router.push("/admin/turinys/sportas/pratimai");
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko ištrinti pratimo");
      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
      alert("Įvyko klaida bandant ištrinti pratimą");
    } finally {
      setIsDeleting(false);
    }
  };

  const getDifficultyLabel = (difficulty: string | null) => {
    if (!difficulty) return "Nenurodyta";

    switch (difficulty) {
      case "easy":
        return "Lengvas";
      case "medium":
        return "Vidutinis";
      case "hard":
        return "Sunkus";
      default:
        return difficulty;
    }
  };

  const getMuscleGroupLabel = (muscleGroup: string | null) => {
    if (!muscleGroup) return "Nenurodyta";

    switch (muscleGroup) {
      case "chest":
        return "Krūtinė";
      case "back":
        return "Nugara";
      case "shoulders":
        return "Pečiai";
      case "arms":
        return "Rankos";
      case "legs":
        return "Kojos";
      case "core":
        return "Pilvo presas";
      case "fullBody":
        return "Visas kūnas";
      default:
        return muscleGroup;
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

  if (!exercise) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-500">Pratimas nerastas</p>
          <Button asChild className="mt-4">
            <Link href="/admin/turinys/sportas/pratimai">
              Grįžti į pratimų sąrašą
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/turinys/sportas/pratimai">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Grįžti į pratimų sąrašą
          </Link>
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {exercise.name}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {exercise.muscleGroup && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {getMuscleGroupLabel(exercise.muscleGroup)}
                </Badge>
              )}
              {exercise.difficulty && (
                <Badge
                  variant="outline"
                  className={
                    exercise.difficulty === "easy"
                      ? "bg-green-100 text-green-800"
                      : exercise.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {getDifficultyLabel(exercise.difficulty)}
                </Badge>
              )}
              <Badge variant={exercise.isPublished ? "default" : "secondary"}>
                {exercise.isPublished ? "Publikuota" : "Nepublikuota"}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/turinys/sportas/pratimai/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Redaguoti
              </Link>
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Ištrinti
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="details"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="details">Informacija</TabsTrigger>
          <TabsTrigger value="usage">Naudojimas</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Aprašymas</CardTitle>
                </CardHeader>
                <CardContent>
                  {exercise.description ? (
                    <div className="prose max-w-none">
                      <p>{exercise.description}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Nėra aprašymo</p>
                  )}
                </CardContent>
              </Card>

              {exercise.instructions && exercise.instructions.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Atlikimo instrukcijos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal pl-5 space-y-2">
                      {exercise.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}

              {exercise.tips && exercise.tips.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Patarimai</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {exercise.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Informacija</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Pagrindinė raumenų grupė
                      </dt>
                      <dd>{getMuscleGroupLabel(exercise.muscleGroup)}</dd>
                    </div>

                    {exercise.secondaryMuscleGroups &&
                      exercise.secondaryMuscleGroups.length > 0 && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Antrinės raumenų grupės
                          </dt>
                          <dd>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {exercise.secondaryMuscleGroups.map((group) => (
                                <Badge key={group} variant="outline">
                                  {getMuscleGroupLabel(group)}
                                </Badge>
                              ))}
                            </div>
                          </dd>
                        </div>
                      )}

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Įranga
                      </dt>
                      <dd>{exercise.equipment || "Nereikia įrangos"}</dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Sudėtingumas
                      </dt>
                      <dd>{getDifficultyLabel(exercise.difficulty)}</dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Statusas
                      </dt>
                      <dd className="flex items-center">
                        {exercise.isPublished ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                            <span>Publikuota</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-gray-500 mr-1" />
                            <span>Nepublikuota</span>
                          </>
                        )}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Sukurta
                      </dt>
                      <dd>
                        {new Date(exercise.createdAt).toLocaleDateString(
                          "lt-LT"
                        )}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Atnaujinta
                      </dt>
                      <dd>
                        {new Date(exercise.updatedAt).toLocaleDateString(
                          "lt-LT"
                        )}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {exercise.imageUrl && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Nuotrauka</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={exercise.imageUrl || "/placeholder.svg"}
                      alt={exercise.name}
                      className="rounded-md w-full object-cover"
                    />
                  </CardContent>
                </Card>
              )}

              {exercise.videoUrl && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Video</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video">
                      <iframe
                        src={
                          exercise.videoUrl.includes("youtube.com")
                            ? exercise.videoUrl.replace("watch?v=", "embed/")
                            : exercise.videoUrl
                        }
                        className="w-full h-full rounded-md"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Naudojimas treniruotėse</CardTitle>
              <CardDescription>
                Treniruotės, kuriose naudojamas šis pratimas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exercise.workoutExercises &&
              exercise.workoutExercises.length > 0 ? (
                <div className="space-y-4">
                  {exercise.workoutExercises.map((we) => (
                    <div
                      key={we.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center">
                        <Dumbbell className="h-5 w-5 mr-3 text-gray-500" />
                        <span>{we.workout.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/admin/turinys/sportas/treniruotes/${we.workoutId}`}
                        >
                          Peržiūrėti treniruotę
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Šis pratimas dar nenaudojamas jokiose treniruotėse
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
