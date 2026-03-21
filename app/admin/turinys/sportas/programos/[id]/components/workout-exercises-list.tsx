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
  onExerciseRemoved?: () => void;
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
        onExerciseRemoved?.();
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko pašalinti pratimo");
      }
    } catch (error) {
      console.error("Error removing exercise:", error);
      alert("Įvyko klaida bandant pašalinti pratimą");
    }
  };

  // Build ordered list: interleave regular exercises and superset groups by order
  type ListItem =
    | { type: "regular"; exercise: WorkoutExercise; order: number }
    | { type: "superset"; group: string; exercises: WorkoutExercise[]; order: number };

  const supersetGroups: Record<string, WorkoutExercise[]> = {};
  const items: ListItem[] = [];
  const seenGroups = new Set<string>();

  // Sort all exercises by order first
  const sorted = [...workoutExercises].sort((a, b) => a.order - b.order);

  // Group superset exercises
  sorted.forEach((ex) => {
    if (ex.supersetGroup) {
      if (!supersetGroups[ex.supersetGroup]) {
        supersetGroups[ex.supersetGroup] = [];
      }
      supersetGroups[ex.supersetGroup].push(ex);
    }
  });

  // Sort within each superset group by supersetOrder
  Object.values(supersetGroups).forEach((group) => {
    group.sort((a, b) => (a.supersetOrder || 0) - (b.supersetOrder || 0));
  });

  // Build interleaved list
  sorted.forEach((ex) => {
    if (!ex.supersetGroup) {
      items.push({ type: "regular", exercise: ex, order: ex.order });
    } else if (!seenGroups.has(ex.supersetGroup)) {
      seenGroups.add(ex.supersetGroup);
      const groupExercises = supersetGroups[ex.supersetGroup];
      const minOrder = Math.min(...groupExercises.map((e) => e.order));
      items.push({
        type: "superset",
        group: ex.supersetGroup,
        exercises: groupExercises,
        order: minOrder,
      });
    }
  });

  items.sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {items.map((item) =>
        item.type === "regular" ? (
          <div
            key={item.exercise.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <div>
              <p className="font-medium">{item.exercise.exercise.name}</p>
              <p className="text-xs text-gray-500">
                {item.exercise.sets && `${item.exercise.sets} serijos`}
                {item.exercise.reps && ` • ${item.exercise.reps} pakartojimai`}
                {item.exercise.restTime && ` • ${item.exercise.restTime}s poilsis`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingExercise(item.exercise)}
              >
                <Pencil className="h-4 w-4 text-gray-500" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveExercise(item.exercise.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ) : (
          <div key={`superset-${item.group}`} className="border-l-2 border-blue-500 pl-3 space-y-2">
            <h4 className="text-sm font-medium">
              Superserija {item.group.toUpperCase()}
            </h4>
            {item.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">
                    {item.group.toUpperCase()}
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
        )
      )}

      {editingExercise && (
        <EditExerciseModal
          isOpen={!!editingExercise}
          onClose={() => setEditingExercise(null)}
          workoutExercise={editingExercise}
          onSave={onExerciseRemoved ?? (() => {})}
          programWorkoutId={programWorkoutId}
        />
      )}
    </div>
  );
}
