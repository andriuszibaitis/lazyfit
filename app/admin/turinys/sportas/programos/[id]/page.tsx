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
import {
  ArrowLeft,
  Edit,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { AddWorkoutToProgram } from "../components/add-workout-to-program";
import WorkoutExercisesList from "./components/workout-exercises-list";
import { AddExerciseToWorkout } from "./components/add-exercise-to-workout";
import { AddPeriodToProgram } from "../components/add-period-to-program";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Membership = {
  id: string;
  name: string;
  planId: string;
};

type Workout = {
  id: string;
  name: string;
  description: string | null;
  duration: number | null;
  difficulty: string;
  targetMuscleGroups: string[] | null;
  equipment: string[] | null;
  imageUrl: string | null;
  videoUrl: string | null;
  isPublished: boolean;
  workoutExercises?: WorkoutExercise[];
};

type WorkoutExercise = {
  id: string;
  workoutId: string;
  exerciseId: string;
  order: number;
  sets: number | null;
  reps: string | null;
  restTime: number | null;
  tempo: string | null;
  supersetGroup: string | null;
  supersetOrder: number | null;
  notes: string | null;
  exercise: Exercise;
};

type Exercise = {
  id: string;
  name: string;
  description: string | null;
  targetMuscleGroup: string | null;
  equipment: string | null;
  difficulty: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  instructions: string | null;
};

type Period = {
  id: string;
  programId: string;
  name: string;
  description: string | null;
  startWeek: number;
  endWeek: number;
  order: number;
};

type ProgramWorkout = {
  id: string;
  programId: string;
  periodId: string | null;
  workoutId: string;
  weekNumber: number;
  dayNumber: number;
  order: number;
  workout: Workout;
  period?: Period;
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
  programWorkouts: ProgramWorkout[];
  periods?: Period[];
  createdAt: string;
  updatedAt: string;
};

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [program, setProgram] = useState<TrainingProgram | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedPeriods, setExpandedPeriods] = useState<
    Record<string, boolean>
  >({});
  const [addingWorkoutToDay, setAddingWorkoutToDay] = useState<{
    periodId: string;
    weekNumber: number;
    dayNumber: number;
  } | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const programResponse = await fetch(
          `/api/admin/training-programs/${id}`
        );
        if (programResponse.ok) {
          const programData = await programResponse.json();
          setProgram(programData.program);
        }

        const workoutsResponse = await fetch("/api/admin/workouts");
        if (workoutsResponse.ok) {
          const workoutsData = await workoutsResponse.json();
          setWorkouts(workoutsData.workouts || []);
        }

        const exercisesResponse = await fetch("/api/admin/exercises");
        if (exercisesResponse.ok) {
          const exercisesData = await exercisesResponse.json();
          setExercises(exercisesData.exercises || []);
        }

        const periodsResponse = await fetch(
          `/api/admin/program-periods?programId=${id}`
        );
        if (periodsResponse.ok) {
          const periodsData = await periodsResponse.json();
          setPeriods(periodsData.periods || []);

          const initialExpandedPeriods: Record<string, boolean> = {};
          periodsData.periods.forEach((period: Period) => {
            initialExpandedPeriods[period.id] = true;
          });
          setExpandedPeriods(initialExpandedPeriods);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Įvyko klaida bandant gauti duomenis");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteProgram = async () => {
    if (
      !confirm(
        "Ar tikrai norite ištrinti šią programą? Šio veiksmo negalima atšaukti."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/admin/training-programs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Programa sėkmingai ištrinta");
        router.push("/admin/turinys/sportas");
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko ištrinti programos");
      }
    } catch (error) {
      console.error("Error deleting program:", error);
      alert("Įvyko klaida bandant ištrinti programą");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleWorkoutAdded = async () => {
    try {
      const response = await fetch(`/api/admin/training-programs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProgram(data.program);
      }
    } catch (error) {
      console.error("Error refreshing program data:", error);
    }
  };

  const handlePeriodAdded = async () => {
    try {
      const response = await fetch(
        `/api/admin/program-periods?programId=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setPeriods(data.periods || []);

        const newExpandedPeriods = { ...expandedPeriods };
        data.periods.forEach((period: Period) => {
          if (newExpandedPeriods[period.id] === undefined) {
            newExpandedPeriods[period.id] = true;
          }
        });
        setExpandedPeriods(newExpandedPeriods);
      }
    } catch (error) {
      console.error("Error refreshing periods data:", error);
    }
  };

  const handleRemoveWorkout = async (programWorkoutId: string) => {
    if (!confirm("Ar tikrai norite pašalinti šią treniruotę iš programos?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/program-workouts/${programWorkoutId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        handleWorkoutAdded();
        alert("Treniruotė sėkmingai pašalinta iš programos");
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko pašalinti treniruotės");
      }
    } catch (error) {
      console.error("Error removing workout:", error);
      alert("Įvyko klaida bandant pašalinti treniruotę");
    }
  };

  const handleRemovePeriod = async (periodId: string) => {
    if (
      !confirm(
        "Ar tikrai norite pašalinti šį laikotarpį? Visi susiję treniruočių įrašai bus pašalinti."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/program-periods/${periodId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        handlePeriodAdded();

        handleWorkoutAdded();
        alert("Laikotarpis sėkmingai pašalintas");
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko pašalinti laikotarpio");
      }
    } catch (error) {
      console.error("Error removing period:", error);
      alert("Įvyko klaida bandant pašalinti laikotarpį");
    }
  };

  const handleExerciseAdded = async (
    workoutId: string,
    programWorkoutId: string
  ) => {
    try {
      const response = await fetch(`/api/admin/workouts/${workoutId}`);
      if (response.ok) {
        const data = await response.json();

        if (program) {
          const updatedProgramWorkouts = program.programWorkouts.map((pw) => {
            if (pw.id === programWorkoutId) {
              return {
                ...pw,
                workout: data.workout,
              };
            }
            return pw;
          });

          setProgram({
            ...program,
            programWorkouts: updatedProgramWorkouts,
          });
        }
      }
    } catch (error) {
      console.error("Error refreshing workout data:", error);
    }
  };

  const toggleWeekExpanded = (weekKey: string) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekKey]: !prev[weekKey],
    }));
  };

  const togglePeriodExpanded = (periodId: string) => {
    setExpandedPeriods((prev) => ({
      ...prev,
      [periodId]: !prev[periodId],
    }));
  };

  const handleAddWorkoutToDay = async () => {
    if (!addingWorkoutToDay || !selectedWorkoutId || !program) return;

    setIsAddingWorkout(true);

    try {
      const { periodId, weekNumber, dayNumber } = addingWorkoutToDay;

      const existingWorkoutsInDay = program.programWorkouts.filter(
        (pw) => pw.weekNumber === weekNumber && pw.dayNumber === dayNumber
      );
      const nextOrder =
        existingWorkoutsInDay.length > 0
          ? Math.max(...existingWorkoutsInDay.map((pw) => pw.order)) + 1
          : 1;

      const workoutResponse = await fetch(
        `/api/admin/workouts/${selectedWorkoutId}`
      );
      if (!workoutResponse.ok) {
        const error = await workoutResponse.json();
        alert(error.error || "Nepavyko gauti treniruotės duomenų");
        return;
      }
      const workoutData = await workoutResponse.json();

      const createWorkoutCopyResponse = await fetch(
        "/api/admin/workouts/copy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workoutId: selectedWorkoutId,
            name: `${workoutData.workout.name} (Copy)`,
          }),
        }
      );

      if (!createWorkoutCopyResponse.ok) {
        const error = await createWorkoutCopyResponse.json();
        alert(error.error || "Nepavyko sukurti treniruotės kopijos");
        return;
      }

      const workoutCopyData = await createWorkoutCopyResponse.json();
      const newWorkoutId = workoutCopyData.workout.id;

      const response = await fetch("/api/admin/program-workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programId: id,
          periodId: periodId === "noPeriod" ? null : periodId,
          workoutId: newWorkoutId,
          weekNumber,
          dayNumber,
          order: nextOrder,
        }),
      });

      if (response.ok) {
        await handleWorkoutAdded();
        setAddingWorkoutToDay(null);
        setSelectedWorkoutId("");
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko pridėti treniruotės");
      }
    } catch (error) {
      console.error("Error adding workout to day:", error);
      alert("Įvyko klaida bandant pridėti treniruotę");
    } finally {
      setIsAddingWorkout(false);
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

  if (!program) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/admin/turinys/sportas">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Grįžti
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Programa nerasta</h1>
          <p className="text-gray-600">
            Programa su nurodytu ID neegzistuoja arba buvo ištrinta.
          </p>
        </div>
      </div>
    );
  }

  const workoutsByPeriodWeekAndDay = program.programWorkouts.reduce(
    (acc, pw) => {
      const periodId = pw.periodId || "noPeriod";

      if (!acc[periodId]) {
        acc[periodId] = {};
      }
      if (!acc[periodId][pw.weekNumber]) {
        acc[periodId][pw.weekNumber] = {};
      }
      if (!acc[periodId][pw.weekNumber][pw.dayNumber]) {
        acc[periodId][pw.weekNumber][pw.dayNumber] = [];
      }
      acc[periodId][pw.weekNumber][pw.dayNumber].push(pw);
      return acc;
    },
    {} as Record<string, Record<number, Record<number, ProgramWorkout[]>>>
  );

  const allWeeks = program.programWorkouts
    .reduce((acc, pw) => {
      if (!acc.includes(pw.weekNumber)) {
        acc.push(pw.weekNumber);
      }
      return acc;
    }, [] as number[])
    .sort((a, b) => a - b);

  const maxWeekFromPeriods = periods.reduce((max, period) => {
    return Math.max(max, period.endWeek);
  }, 0);

  const completeWeeksList = Array.from(
    { length: Math.max(...allWeeks, maxWeekFromPeriods) },
    (_, i) => i + 1
  );

  const weekToPeriod = completeWeeksList.reduce((acc, week) => {
    const period = periods.find(
      (p) => week >= p.startWeek && week <= p.endWeek
    );
    acc[week] = period || null;
    return acc;
  }, {} as Record<number, Period | null>);

  const getAvailableWorkoutsForDay = (
    periodId: string,
    weekNumber: number,
    dayNumber: number
  ) => {
    const existingWorkoutIds =
      workoutsByPeriodWeekAndDay[periodId]?.[weekNumber]?.[dayNumber]?.map(
        (pw) => pw.workoutId
      ) || [];

    return workouts.filter(
      (workout) => !existingWorkoutIds.includes(workout.id)
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{program.name}</h1>
            <p className="text-gray-600">
              {program.difficulty === "easy" && "Lengva"}
              {program.difficulty === "medium" && "Vidutinė"}
              {program.difficulty === "hard" && "Sunki"}
              {program.duration && ` • ${program.duration} dienų`}
              {program.membership && ` • ${program.membership.name}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/turinys/sportas/programos/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Redaguoti
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProgram}
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="details">Informacija</TabsTrigger>
          <TabsTrigger value="periods">Laikotarpiai</TabsTrigger>
          <TabsTrigger value="workouts">Treniruotės</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Programos informacija</CardTitle>
              <CardDescription>
                Pagrindinė informacija apie treniruočių programą
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {program.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Aprašymas
                  </h3>
                  <p className="mt-1">{program.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Sudėtingumas
                  </h3>
                  <p className="mt-1">
                    {program.difficulty === "easy" && "Lengvas"}
                    {program.difficulty === "medium" && "Vidutinis"}
                    {program.difficulty === "hard" && "Sunkus"}
                  </p>
                </div>

                {program.duration && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Trukmė
                    </h3>
                    <p className="mt-1">{program.duration} dienų</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Lytis</h3>
                  <p className="mt-1">
                    {program.gender === "all" && "Visiems"}
                    {program.gender === "male" && "Vyrams"}
                    {program.gender === "female" && "Moterims"}
                  </p>
                </div>

                {program.goal && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Tikslas
                    </h3>
                    <p className="mt-1">{program.goal}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Narystė</h3>
                  <p className="mt-1">
                    {program.membership
                      ? program.membership.name
                      : "Visos narystės"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Publikuota
                  </h3>
                  <p className="mt-1">{program.isPublished ? "Taip" : "Ne"}</p>
                </div>
              </div>

              {(program.imageUrl || program.videoUrl) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {program.imageUrl && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Nuotrauka
                      </h3>
                      <img
                        src={program.imageUrl || "/placeholder.svg"}
                        alt={program.name}
                        className="rounded-md max-h-64 object-cover"
                      />
                    </div>
                  )}

                  {program.videoUrl && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Video
                      </h3>
                      <div className="aspect-video">
                        <iframe
                          src={program.videoUrl.replace("watch?v=", "embed/")}
                          className="w-full h-full rounded-md"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="periods">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pridėti laikotarpį</CardTitle>
                <CardDescription>
                  Pridėkite naują laikotarpį į programą
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddPeriodToProgram
                  programId={id}
                  onPeriodAdded={handlePeriodAdded}
                />
              </CardContent>
            </Card>

            {periods.length > 0 ? (
              <div className="space-y-6">
                {periods
                  .sort((a, b) => a.startWeek - b.startWeek)
                  .map((period) => (
                    <Card key={period.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>{period.name}</CardTitle>
                            <CardDescription>
                              Savaitės {period.startWeek}-{period.endWeek}
                            </CardDescription>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemovePeriod(period.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      {period.description && (
                        <CardContent>
                          <p className="text-sm text-gray-600">
                            {period.description}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <p className="text-gray-500">
                      Šioje programoje dar nėra laikotarpių
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Pridėkite laikotarpius naudodami formą aukščiau
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="workouts">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pridėti treniruotę</CardTitle>
                <CardDescription>
                  Pridėkite treniruotę į programą
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddWorkoutToProgram
                  programId={id}
                  workouts={workouts}
                  periods={periods}
                  onWorkoutAdded={handleWorkoutAdded}
                />
              </CardContent>
            </Card>

            {program.programWorkouts.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Programos laikotarpiai ir treniruotės</CardTitle>
                  <CardDescription>
                    Treniruotės suskirstytos pagal laikotarpius ir savaites
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {periods.length > 0 ? (
                      periods
                        .sort((a, b) => a.startWeek - b.startWeek)
                        .map((period) => (
                          <div
                            key={period.id}
                            className="border rounded-lg overflow-hidden"
                          >
                            <div
                              className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                              onClick={() => togglePeriodExpanded(period.id)}
                            >
                              <div>
                                <h3 className="font-medium">{period.name}</h3>
                                <p className="text-xs text-gray-500">
                                  Savaitės {period.startWeek}-{period.endWeek}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm">
                                {expandedPeriods[period.id] !== false ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            <Collapsible
                              open={expandedPeriods[period.id] !== false}
                            >
                              <CollapsibleContent>
                                <div className="p-4">
                                  {completeWeeksList
                                    .filter(
                                      (weekNumber) =>
                                        weekNumber >= period.startWeek &&
                                        weekNumber <= period.endWeek
                                    )
                                    .map((weekNumber) => {
                                      const weekKey = `week-${weekNumber}`;
                                      const hasWorkouts = Object.values(
                                        workoutsByPeriodWeekAndDay
                                      ).some(
                                        (weekData) => weekData[weekNumber]
                                      );

                                      return (
                                        <div
                                          key={weekKey}
                                          className="border rounded-lg overflow-hidden mb-4"
                                        >
                                          <div
                                            className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                                            onClick={() =>
                                              toggleWeekExpanded(weekKey)
                                            }
                                          >
                                            <div>
                                              <h3 className="font-medium">
                                                Savaitė {weekNumber}
                                              </h3>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                              {expandedWeeks[weekKey] !==
                                              false ? (
                                                <ChevronUp className="h-4 w-4" />
                                              ) : (
                                                <ChevronDown className="h-4 w-4" />
                                              )}
                                            </Button>
                                          </div>

                                          <Collapsible
                                            open={
                                              expandedWeeks[weekKey] !== false
                                            }
                                          >
                                            <CollapsibleContent>
                                              <div className="p-4">
                                                <div className="space-y-4">
                                                  {Object.entries(
                                                    workoutsByPeriodWeekAndDay
                                                  ).flatMap(
                                                    ([periodId, weekData]) => {
                                                      if (!weekData[weekNumber])
                                                        return [];

                                                      const days = Object.keys(
                                                        weekData[weekNumber]
                                                      )
                                                        .map(Number)
                                                        .sort((a, b) => a - b);

                                                      const allDays =
                                                        Array.from(
                                                          { length: 7 },
                                                          (_, i) => i + 1
                                                        );

                                                      return allDays.map(
                                                        (dayNumber) => {
                                                          const hasWorkoutsForDay =
                                                            days.includes(
                                                              dayNumber
                                                            );

                                                          return (
                                                            <div
                                                              key={`day-${dayNumber}`}
                                                              className="border-l-2 border-primary pl-3"
                                                            >
                                                              <div className="flex justify-between items-center mb-2">
                                                                <h4 className="font-medium text-sm">
                                                                  Diena{" "}
                                                                  {dayNumber}
                                                                </h4>
                                                                {addingWorkoutToDay &&
                                                                addingWorkoutToDay.periodId ===
                                                                  period.id &&
                                                                addingWorkoutToDay.weekNumber ===
                                                                  weekNumber &&
                                                                addingWorkoutToDay.dayNumber ===
                                                                  dayNumber ? (
                                                                  <div className="flex items-center gap-2">
                                                                    <Select
                                                                      value={
                                                                        selectedWorkoutId
                                                                      }
                                                                      onValueChange={
                                                                        setSelectedWorkoutId
                                                                      }
                                                                    >
                                                                      <SelectTrigger className="w-[180px]">
                                                                        <SelectValue placeholder="Pasirinkite treniruotę" />
                                                                      </SelectTrigger>
                                                                      <SelectContent>
                                                                        {getAvailableWorkoutsForDay(
                                                                          period.id,
                                                                          weekNumber,
                                                                          dayNumber
                                                                        ).map(
                                                                          (
                                                                            workout
                                                                          ) => (
                                                                            <SelectItem
                                                                              key={
                                                                                workout.id
                                                                              }
                                                                              value={
                                                                                workout.id
                                                                              }
                                                                            >
                                                                              {
                                                                                workout.name
                                                                              }
                                                                            </SelectItem>
                                                                          )
                                                                        )}
                                                                      </SelectContent>
                                                                    </Select>
                                                                    <Button
                                                                      size="sm"
                                                                      onClick={
                                                                        handleAddWorkoutToDay
                                                                      }
                                                                      disabled={
                                                                        !selectedWorkoutId ||
                                                                        isAddingWorkout
                                                                      }
                                                                    >
                                                                      {isAddingWorkout ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                      ) : (
                                                                        "Pridėti"
                                                                      )}
                                                                    </Button>
                                                                    <Button
                                                                      variant="ghost"
                                                                      size="sm"
                                                                      onClick={() => {
                                                                        setAddingWorkoutToDay(
                                                                          null
                                                                        );
                                                                        setSelectedWorkoutId(
                                                                          ""
                                                                        );
                                                                      }}
                                                                    >
                                                                      Atšaukti
                                                                    </Button>
                                                                  </div>
                                                                ) : (
                                                                  <></>
                                                                )}
                                                              </div>

                                                              <div className="space-y-2">
                                                                {hasWorkoutsForDay ? (
                                                                  weekData[
                                                                    weekNumber
                                                                  ][dayNumber]
                                                                    .sort(
                                                                      (a, b) =>
                                                                        a.order -
                                                                        b.order
                                                                    )
                                                                    .map(
                                                                      (
                                                                        programWorkout
                                                                      ) => (
                                                                        <div
                                                                          key={
                                                                            programWorkout.id
                                                                          }
                                                                          className="mb-3"
                                                                        >
                                                                          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                                            <div>
                                                                              <p className="font-medium">
                                                                                {
                                                                                  programWorkout
                                                                                    .workout
                                                                                    .name
                                                                                }
                                                                              </p>
                                                                              <p className="text-xs text-gray-500">
                                                                                {programWorkout
                                                                                  .workout
                                                                                  .difficulty ===
                                                                                  "easy" &&
                                                                                  "Lengva"}
                                                                                {programWorkout
                                                                                  .workout
                                                                                  .difficulty ===
                                                                                  "medium" &&
                                                                                  "Vidutinė"}
                                                                                {programWorkout
                                                                                  .workout
                                                                                  .difficulty ===
                                                                                  "hard" &&
                                                                                  "Sunki"}
                                                                                {programWorkout
                                                                                  .workout
                                                                                  .duration &&
                                                                                  ` • ${programWorkout.workout.duration} min.`}
                                                                              </p>
                                                                            </div>
                                                                            <div className="flex gap-2">
                                                                              <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                  const key = `workout-${programWorkout.id}`;
                                                                                  setExpandedWeeks(
                                                                                    (
                                                                                      prev
                                                                                    ) => ({
                                                                                      ...prev,
                                                                                      [key]:
                                                                                        !prev[
                                                                                          key
                                                                                        ],
                                                                                    })
                                                                                  );
                                                                                }}
                                                                              >
                                                                                {expandedWeeks[
                                                                                  `workout-${programWorkout.id}`
                                                                                ]
                                                                                  ? "Uždaryti"
                                                                                  : "Pratimai"}
                                                                              </Button>
                                                                              <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                  handleRemoveWorkout(
                                                                                    programWorkout.id
                                                                                  )
                                                                                }
                                                                              >
                                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                                              </Button>
                                                                            </div>
                                                                          </div>

                                                                          {expandedWeeks[
                                                                            `workout-${programWorkout.id}`
                                                                          ] && (
                                                                            <div className="mt-2 pl-4 border-l-2 border-gray-200">
                                                                              <div className="mb-4">
                                                                                <h4 className="text-md font-semibold mb-2">
                                                                                  Pratimai
                                                                                </h4>

                                                                                {programWorkout
                                                                                  .workout
                                                                                  .workoutExercises &&
                                                                                programWorkout
                                                                                  .workout
                                                                                  .workoutExercises
                                                                                  .length >
                                                                                  0 ? (
                                                                                  <WorkoutExercisesList
                                                                                    workoutExercises={
                                                                                      programWorkout
                                                                                        .workout
                                                                                        .workoutExercises
                                                                                    }
                                                                                    onExerciseRemoved={() =>
                                                                                      handleExerciseAdded(
                                                                                        programWorkout.workoutId,
                                                                                        programWorkout.id
                                                                                      )
                                                                                    }
                                                                                    programWorkoutId={
                                                                                      programWorkout.id
                                                                                    }
                                                                                  />
                                                                                ) : (
                                                                                  <p className="text-sm text-gray-500">
                                                                                    Nėra
                                                                                    pridėtų
                                                                                    pratimų
                                                                                  </p>
                                                                                )}
                                                                              </div>

                                                                              <div className="mt-4 border-t pt-4">
                                                                                <h4 className="text-md font-semibold mb-2">
                                                                                  Pridėti
                                                                                  pratimą
                                                                                </h4>
                                                                                <AddExerciseToWorkout
                                                                                  workoutId={
                                                                                    programWorkout.workoutId
                                                                                  }
                                                                                  exercises={
                                                                                    exercises
                                                                                  }
                                                                                  onExerciseAdded={() =>
                                                                                    handleExerciseAdded(
                                                                                      programWorkout.workoutId,
                                                                                      programWorkout.id
                                                                                    )
                                                                                  }
                                                                                  programWorkoutId={
                                                                                    programWorkout.id
                                                                                  }
                                                                                />
                                                                              </div>
                                                                            </div>
                                                                          )}
                                                                        </div>
                                                                      )
                                                                    )
                                                                ) : (
                                                                  <p className="text-sm text-gray-500 italic">
                                                                    Nėra pridėtų
                                                                    treniruočių
                                                                  </p>
                                                                )}
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </div>
                                            </CollapsibleContent>
                                          </Collapsible>
                                        </div>
                                      );
                                    })}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">
                          Šioje programoje dar nėra laikotarpių
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Pridėkite laikotarpius naudodami formą aukščiau
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <p className="text-gray-500">
                      Šioje programoje dar nėra treniruočių
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Pridėkite treniruotes naudodami formą aukščiau
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
