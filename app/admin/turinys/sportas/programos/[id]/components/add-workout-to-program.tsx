"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import WorkoutExercisesList from "./workout-exercises-list";

interface Workout {
  id: string;
  name: string;
  description: string | null;
  duration: number | null;
  difficulty: string;
  targetMuscleGroups: string[] | null;
  equipment: string[] | null;
  isPublished: boolean;
  workoutExercises?: WorkoutExercise[];
}

interface Exercise {
  id: string;
  name: string;
}

interface WorkoutExercise {
  id: string;
  order: number;
  sets: number | null;
  reps: string | null;
  restTime: number | null;
  tempo: string | null;
  supersetGroup: string | null;
  supersetOrder: number | null;
  notes: string | null;
  exercise: Exercise;
}

interface ProgramWorkout {
  id: string;
  programId: string;
  workoutId: string;
  periodId: string | null;
  weekId: string | null;
  day: number;
  order: number;
  workout: Workout;
}

interface AddWorkoutToProgramProps {
  programId: string;
  periodId?: string;
  weekId?: string;
  programWorkouts: ProgramWorkout[];
}

export default function AddWorkoutToProgram({
  programId,
  periodId,
  weekId,
  programWorkouts,
}: AddWorkoutToProgramProps) {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedWorkouts, setExpandedWorkouts] = useState<
    Record<string, boolean>
  >({});

  const [formData, setFormData] = useState({
    workoutId: "",
    day: "1",
    order: "1",
  });

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("/api/admin/workouts");
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
        const data = await response.json();
        setWorkouts(data.workouts);
      } catch (err) {
        console.error("Error fetching workouts:", err);
        setError("Failed to load workouts");
      }
    };

    fetchWorkouts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/program-workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programId,
          periodId: periodId || null,
          weekId: weekId || null,
          workoutId: formData.workoutId,
          day: Number.parseInt(formData.day),
          order: Number.parseInt(formData.order),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add workout to program");
      }

      setSuccess("Workout successfully added to program!");
      setFormData({
        workoutId: "",
        day: "1",
        order: "1",
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkoutExpand = (workoutId: string) => {
    setExpandedWorkouts((prev) => ({
      ...prev,
      [workoutId]: !prev[workoutId],
    }));
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded-lg shadow"
      >
        <h3 className="text-lg font-medium">Pridėti treniruotę</h3>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Treniruotė *
            </label>
            <select
              name="workoutId"
              value={formData.workoutId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pasirinkite treniruotę</option>
              {workouts.map((workout) => (
                <option key={workout.id} value={workout.id}>
                  {workout.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diena *
            </label>
            <input
              type="number"
              name="day"
              value={formData.day}
              onChange={handleChange}
              min="1"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Eilė *
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="1"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? "Pridedama..." : "Pridėti treniruotę"}
          </button>
        </div>
      </form>

      {programWorkouts.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Programos treniruotės</h3>
          <div className="space-y-4">
            {programWorkouts.map((pw) => (
              <div key={pw.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">
                      {pw.workout.name} (Diena {pw.day}, Eilė {pw.order})
                    </h4>
                    <p className="text-sm text-gray-500">
                      {pw.workout.description || "Nėra aprašymo"}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleWorkoutExpand(pw.id)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                    aria-label={
                      expandedWorkouts[pw.id] ? "Suskleisti" : "Išskleisti"
                    }
                  >
                    {expandedWorkouts[pw.id] ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>

                {expandedWorkouts[pw.id] && (
                  <div className="mt-4 border-t pt-4">
                    <h5 className="text-sm font-medium mb-2">Pratimai</h5>
                    {pw.workout.workoutExercises &&
                    pw.workout.workoutExercises.length > 0 ? (
                      <WorkoutExercisesList
                        workoutExercises={pw.workout.workoutExercises}
                      />
                    ) : (
                      <p className="text-sm text-gray-500">
                        Šioje treniruotėje nėra pratimų
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
