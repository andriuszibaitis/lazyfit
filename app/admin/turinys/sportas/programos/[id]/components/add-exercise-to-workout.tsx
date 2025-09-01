"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

type Exercise = {
  id: string;
  name: string;
  description: string | null;
  targetMuscleGroup: string | null;
  equipment: string | null;
  difficulty: string | null;
};

type AddExerciseToWorkoutProps = {
  workoutId: string;
  exercises: Exercise[];
  onExerciseAdded: () => void;
  programWorkoutId?: string;
};

export function AddExerciseToWorkout({
  workoutId,
  exercises,
  onExerciseAdded,
  programWorkoutId,
}: AddExerciseToWorkoutProps) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [sets, setSets] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [restTime, setRestTime] = useState<string>("");
  const [supersetGroup, setSupersetGroup] = useState<string>("");
  const [supersetOrder, setSupersetOrder] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExerciseId) {
      alert("Pasirinkite pratimą");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/workout-exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workoutId,
          exerciseId: selectedExerciseId,
          sets: sets || null,
          reps: reps || null,
          restTime: restTime || null,
          supersetGroup: supersetGroup || null,
          supersetOrder: supersetOrder || null,
          programWorkoutId: programWorkoutId || null,
        }),
      });

      if (response.ok) {
        setSelectedExerciseId("");
        setSets("");
        setReps("");
        setRestTime("");
        setSupersetGroup("");
        setSupersetOrder("");

        onExerciseAdded();
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko pridėti pratimo");
      }
    } catch (error) {
      console.error("Error adding exercise:", error);
      alert("Įvyko klaida bandant pridėti pratimą");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Pratimas</label>
        <Select
          value={selectedExerciseId}
          onValueChange={setSelectedExerciseId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pasirinkite pratimą" />
          </SelectTrigger>
          <SelectContent>
            {exercises
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  {exercise.name}
                  {exercise.targetMuscleGroup &&
                    ` (${exercise.targetMuscleGroup})`}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Serijos</label>
          <Input
            type="number"
            placeholder="Pvz. 3"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Pakartojimai</label>
          <Input
            placeholder="Pvz. 8-12"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Poilsis (sek.)</label>
          <Input
            type="number"
            placeholder="Pvz. 60"
            value={restTime}
            onChange={(e) => setRestTime(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Superserijos grupė</label>
          <Input
            placeholder="Pvz. A"
            value={supersetGroup}
            onChange={(e) => setSupersetGroup(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Superserijos eilė</label>
          <Input
            type="number"
            placeholder="Pvz. 1"
            value={supersetOrder}
            onChange={(e) => setSupersetOrder(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting || !selectedExerciseId}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : null}
        Pridėti pratimą
      </Button>
    </form>
  );
}
