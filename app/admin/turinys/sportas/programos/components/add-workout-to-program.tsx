"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Search } from "lucide-react";

type Workout = {
  id: string;
  name: string;
  difficulty: string;
  duration: number | null;
  description: string | null;
  targetMuscleGroups: string[] | null;
  equipment: string[] | null;
  imageUrl: string | null;
  videoUrl: string | null;
  isPublished: boolean;
};

type Period = {
  id: string;
  name: string;
  startWeek: number;
  endWeek: number;
  order: number;
};

type AddWorkoutToProgramProps = {
  programId: string;
  workouts: Workout[];
  periods: Period[];
  onWorkoutAdded: () => void;
};

export function AddWorkoutToProgram({
  programId,
  workouts,
  periods,
  onWorkoutAdded,
}: AddWorkoutToProgramProps) {
  const [workoutId, setWorkoutId] = useState("");
  const [periodId, setPeriodId] = useState("");
  const [dayNumber, setDayNumber] = useState("1");
  const [order, setOrder] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyToAllWeeks, setApplyToAllWeeks] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [weekNumber, setWeekNumber] = useState("1");
  const [workoutSearch, setWorkoutSearch] = useState("");

  useEffect(() => {
    if (periodId && periodId !== "no_period") {
      const period = periods.find((p) => p.id === periodId);
      if (period) {
        setSelectedPeriod(period);
        setWeekNumber(String(period.startWeek));
      } else {
        setSelectedPeriod(null);
      }
    } else {
      setSelectedPeriod(null);
    }
  }, [periodId, periods]);

  const handleAddWorkout = async () => {
    if (!workoutId) {
      alert("Pasirinkite treniruotę");
      return;
    }

    if (!dayNumber || isNaN(Number(dayNumber)) || Number(dayNumber) < 1) {
      alert("Įveskite teisingą dienos numerį");
      return;
    }

    try {
      setIsSubmitting(true);

      if (periodId && applyToAllWeeks && selectedPeriod) {
        const promises = [];
        for (
          let week = selectedPeriod.startWeek;
          week <= selectedPeriod.endWeek;
          week++
        ) {
          promises.push(
            fetch("/api/admin/program-workouts", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                programId,
                periodId,
                workoutId,
                weekNumber: week,
                dayNumber: Number(dayNumber),
                order: Number(order),
              }),
            })
          );
        }

        const results = await Promise.all(promises);
        const allSuccessful = results.every((res) => res.ok);

        if (allSuccessful) {
          setWorkoutId("");
          setDayNumber("1");
          setOrder((prev) => String(Number(prev) + 1));

          onWorkoutAdded();

          alert("Treniruotė sėkmingai pridėta į visas laikotarpio savaites");
        } else {
          alert(
            "Kai kurios treniruotės nebuvo pridėtos. Patikrinkite ir bandykite dar kartą."
          );
        }
      } else {
        const weekToUse = periodId && periodId !== "no_period" && selectedPeriod ? Number(weekNumber) : 1;

        const response = await fetch("/api/admin/program-workouts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            programId,
            periodId: periodId && periodId !== "no_period" ? periodId : null,
            workoutId,
            weekNumber: weekToUse,
            dayNumber: Number(dayNumber),
            order: Number(order),
          }),
        });

        if (response.ok) {
          setWorkoutId("");
          setDayNumber("1");
          setOrder((prev) => String(Number(prev) + 1));

          onWorkoutAdded();

          alert("Treniruotė sėkmingai pridėta į programą");
        } else {
          const error = await response.json();
          alert(error.error || "Nepavyko pridėti treniruotės");
        }
      }
    } catch (error) {
      console.error("Error adding workout to program:", error);
      alert("Įvyko klaida bandant pridėti treniruotę");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(workoutSearch.toLowerCase())
  );

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workout">Treniruotė</Label>
            <Select value={workoutId} onValueChange={setWorkoutId}>
              <SelectTrigger id="workout">
                <SelectValue placeholder="Pasirinkite treniruotę" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 pb-2">
                  <div className="flex items-center border rounded-md px-2">
                    <Search className="h-4 w-4 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Ieškoti treniruotės..."
                      value={workoutSearch}
                      onChange={(e) => setWorkoutSearch(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm outline-none"
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                {filteredWorkouts.length > 0 ? (
                  filteredWorkouts.map((workout) => (
                    <SelectItem key={workout.id} value={workout.id}>
                      {workout.name}{" "}
                      {workout.difficulty === "easy" && "(Lengva)"}
                      {workout.difficulty === "medium" && "(Vidutinė)"}
                      {workout.difficulty === "hard" && "(Sunki)"}
                      {workout.duration && ` - ${workout.duration} min.`}
                      {!workout.isPublished && " [Nepublikuota]"}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Treniruočių nerasta
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Laikotarpis (neprivaloma)</Label>
            <Select value={periodId} onValueChange={setPeriodId}>
              <SelectTrigger id="period">
                <SelectValue placeholder="Pasirinkite laikotarpį" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_period">Be laikotarpio</SelectItem>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.name} (Savaitės {period.startWeek}-{period.endWeek})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {periodId && periodId !== "no_period" && selectedPeriod && (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="applyToAllWeeks"
                  checked={applyToAllWeeks}
                  onCheckedChange={(checked) =>
                    setApplyToAllWeeks(checked as boolean)
                  }
                />
                <Label htmlFor="applyToAllWeeks" className="cursor-pointer">
                  Pridėti treniruotę į visas laikotarpio savaites (
                  {selectedPeriod.startWeek}-{selectedPeriod.endWeek})
                </Label>
              </div>

              {!applyToAllWeeks && (
                <div className="space-y-2">
                  <Label htmlFor="weekNumber">Savaitės numeris</Label>
                  <Select value={weekNumber} onValueChange={setWeekNumber}>
                    <SelectTrigger id="weekNumber">
                      <SelectValue placeholder="Pasirinkite savaitę" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        {
                          length:
                            selectedPeriod.endWeek -
                            selectedPeriod.startWeek +
                            1,
                        },
                        (_, i) => selectedPeriod.startWeek + i
                      ).map((week) => (
                        <SelectItem key={week} value={String(week)}>
                          Savaitė {week}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dayNumber">Dienos numeris</Label>
              <Input
                id="dayNumber"
                type="number"
                min="1"
                value={dayNumber}
                onChange={(e) => setDayNumber(e.target.value)}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Eilės numeris</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="1"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleAddWorkout}
              disabled={isSubmitting || !workoutId}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Pridėti treniruotę
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
