"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Check, X } from "lucide-react";

type Week = {
  id: string;
  periodId: string;
  weekNumber: number;
  isCompleted: boolean;
};

type ManagePeriodWeeksProps = {
  periodId: string;
  durationWeeks: number;
  onWeekAdded: () => void;
};

export function ManagePeriodWeeks({
  periodId,
  durationWeeks,
  onWeekAdded,
}: ManagePeriodWeeksProps) {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weekNumber, setWeekNumber] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWeeks();
  }, [periodId]);

  const fetchWeeks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/admin/period-weeks?periodId=${periodId}`
      );
      if (response.ok) {
        const data = await response.json();
        setWeeks(data.weeks || []);

        if (data.weeks && data.weeks.length > 0) {
          const existingWeekNumbers = data.weeks.map((w: Week) => w.weekNumber);
          for (let i = 1; i <= durationWeeks; i++) {
            if (!existingWeekNumbers.includes(i)) {
              setWeekNumber(String(i));
              break;
            }
          }
        } else {
          setWeekNumber("1");
        }
      }
    } catch (error) {
      console.error("Error fetching weeks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWeek = async () => {
    if (
      !weekNumber ||
      isNaN(Number(weekNumber)) ||
      Number(weekNumber) < 1 ||
      Number(weekNumber) > durationWeeks
    ) {
      alert(`Įveskite teisingą savaitės numerį (1-${durationWeeks})`);
      return;
    }

    if (weeks.some((w) => w.weekNumber === Number(weekNumber))) {
      alert(`Savaitė ${weekNumber} jau egzistuoja`);
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/admin/period-weeks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          periodId,
          weekNumber: Number(weekNumber),
          isCompleted: false,
        }),
      });

      if (response.ok) {
        fetchWeeks();

        onWeekAdded();

        alert("Savaitė sėkmingai pridėta");
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko pridėti savaitės");
      }
    } catch (error) {
      console.error("Error adding week:", error);
      alert("Įvyko klaida bandant pridėti savaitę");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleWeekCompletion = async (
    weekId: string,
    isCompleted: boolean
  ) => {
    try {
      const response = await fetch(`/api/admin/period-weeks/${weekId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isCompleted: !isCompleted,
        }),
      });

      if (response.ok) {
        fetchWeeks();
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko atnaujinti savaitės būsenos");
      }
    } catch (error) {
      console.error("Error updating week:", error);
      alert("Įvyko klaida bandant atnaujinti savaitės būseną");
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="weekNumber">Savaitės numeris</Label>
              <Input
                id="weekNumber"
                type="number"
                min="1"
                max={durationWeeks}
                value={weekNumber}
                onChange={(e) => setWeekNumber(e.target.value)}
                placeholder={`1-${durationWeeks}`}
              />
            </div>

            <Button
              onClick={handleAddWeek}
              disabled={isSubmitting || !weekNumber}
              className="mb-0.5"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Pridėti savaitę
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-2 mt-4">
              <Label>Esamos savaitės</Label>
              {weeks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                  {Array.from({ length: durationWeeks }).map((_, i) => {
                    const weekNum = i + 1;
                    const week = weeks.find((w) => w.weekNumber === weekNum);

                    return (
                      <div
                        key={weekNum}
                        className={`border rounded-md p-3 flex justify-between items-center ${
                          week
                            ? week.isCompleted
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50"
                            : "bg-gray-100 border-dashed opacity-50"
                        }`}
                      >
                        <span className="font-medium">Savaitė {weekNum}</span>
                        {week && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              handleToggleWeekCompletion(
                                week.id,
                                week.isCompleted
                              )
                            }
                          >
                            {week.isCompleted ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  Šiame laikotarpyje dar nėra sukurtų savaičių
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
