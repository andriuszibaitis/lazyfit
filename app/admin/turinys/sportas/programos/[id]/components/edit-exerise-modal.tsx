"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

type Exercise = {
  id: string;
  name: string;
  description: string | null;
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

type EditExerciseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workoutExercise: WorkoutExercise;
  onSave: () => void;
  programWorkoutId?: string;
};

export function EditExerciseModal({
  isOpen,
  onClose,
  workoutExercise,
  onSave,
  programWorkoutId,
}: EditExerciseModalProps) {
  const [sets, setSets] = useState<string>(
    workoutExercise.sets?.toString() || ""
  );
  const [reps, setReps] = useState<string>(workoutExercise.reps || "");
  const [restTime, setRestTime] = useState<string>(
    workoutExercise.restTime?.toString() || ""
  );
  const [tempo, setTempo] = useState<string>(workoutExercise.tempo || "");
  const [notes, setNotes] = useState<string>(workoutExercise.notes || "");
  const [supersetGroup, setSupersetGroup] = useState<string>(
    workoutExercise.supersetGroup || ""
  );
  const [supersetOrder, setSupersetOrder] = useState<string>(
    workoutExercise.supersetOrder?.toString() || ""
  );
  const [order, setOrder] = useState<string>(
    workoutExercise.order.toString() || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/workout-exercises", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: workoutExercise.id,
          sets: sets || null,
          reps: reps || null,
          restTime: restTime || null,
          tempo: tempo || null,
          supersetGroup: supersetGroup || null,
          supersetOrder: supersetOrder || null,
          notes: notes || null,
          order: order || null,
          programWorkoutId: programWorkoutId || null,
        }),
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko atnaujinti pratimo");
      }
    } catch (error) {
      console.error("Error updating exercise:", error);
      alert("Įvyko klaida bandant atnaujinti pratimą");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Redaguoti pratimą</DialogTitle>
            <DialogDescription>
              {workoutExercise.exercise.name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
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
                <label className="text-sm font-medium">Tempo</label>
                <Input
                  placeholder="Pvz. 2-0-2"
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Superserijos grupė
                </label>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Eilės numeris</label>
                <Input
                  type="number"
                  placeholder="Pvz. 1"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pastabos</label>
              <Textarea
                placeholder="Papildomos pastabos apie pratimą"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Atšaukti
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Išsaugoti
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
