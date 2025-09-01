"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { EditExerciseModal } from "./edit-exerise-modal";

type Exercise = {
  id: string;
  name: string;
  description: string | null;
  targetMuscleGroup: string | null;
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

type WorkoutExercisesListProps = {
  workoutExercises: WorkoutExercise[];
  onExerciseRemoved: () => void;
  programWorkoutId?: string;
};

export default function WorkoutExercisesList({
  workoutExercises,
  onExerciseRemoved,
  programWorkoutId,
}: WorkoutExercisesListProps) {
  const [editingExercise, setEditingExercise] =
    useState<WorkoutExercise | null>(null);

  const handleRemoveExercise = async (id: string) => {
    if (!confirm("Ar tikrai norite pašalinti šį pratimą?")) {
      return;
    }

    try {
      const url = new URL(
        `/api/admin/workout-exercises/${id}`,
        window.location.origin
      );
      if (programWorkoutId) {
        url.searchParams.append("programWorkoutId", programWorkoutId);
      }

      const response = await fetch(url, {
        method: "DELETE",
      });

      if (response.ok) {
        onExerciseRemoved();
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko pašalinti pratimo");
      }
    } catch (error) {
      console.error("Error removing exercise:", error);
      alert("Įvyko klaida bandant pašalinti pratimą");
    }
  };

  const groupedExercises: Record<string, WorkoutExercise[]> = {};

  const nonSupersetExercises = workoutExercises.filter(
    (ex) => !ex.supersetGroup
  );

  const supersetExercises = workoutExercises.filter((ex) => ex.supersetGroup);

  supersetExercises.forEach((ex) => {
    const key = ex.supersetGroup || "none";
    if (!groupedExercises[key]) {
      groupedExercises[key] = [];
    }
    groupedExercises[key].push(ex);
  });

  Object.keys(groupedExercises).forEach((key) => {
    groupedExercises[key].sort((a, b) => {
      return (a.supersetOrder || 0) - (b.supersetOrder || 0);
    });
  });

  return (
    <div className="space-y-4">
      {}
      {nonSupersetExercises.length > 0 && (
        <div className="space-y-2">
          {nonSupersetExercises
            .sort((a, b) => a.order - b.order)
            .map((exercise) => (
              <div
                key={exercise.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{exercise.exercise.name}</p>
                  <p className="text-xs text-gray-500">
                    {exercise.sets && `${exercise.sets} serijos`}
                    {exercise.reps && ` • ${exercise.reps} pakartojimai`}
                    {exercise.restTime && ` • ${exercise.restTime}s poilsis`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingExercise(exercise)}
                  >
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveExercise(exercise.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}

      {}
      {Object.keys(groupedExercises).map((group) => (
        <div key={group} className="border-l-2 border-blue-500 pl-3 space-y-2">
          <h4 className="text-sm font-medium">
            Superserija {group.toUpperCase()}
          </h4>
          {groupedExercises[group].map((exercise) => (
            <div
              key={exercise.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <div>
                <p className="font-medium">
                  {group.toUpperCase()}
                  {exercise.supersetOrder}: {exercise.exercise.name}
                </p>
                <p className="text-xs text-gray-500">
                  {exercise.sets && `${exercise.sets} serijos`}
                  {exercise.reps && ` • ${exercise.reps} pakartojimai`}
                  {exercise.restTime && ` • ${exercise.restTime}s poilsis`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingExercise(exercise)}
                >
                  <Pencil className="h-4 w-4 text-gray-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveExercise(exercise.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {editingExercise && (
        <EditExerciseModal
          isOpen={!!editingExercise}
          onClose={() => setEditingExercise(null)}
          workoutExercise={editingExercise}
          onSave={onExerciseRemoved}
          programWorkoutId={programWorkoutId}
        />
      )}
    </div>
  );
}
