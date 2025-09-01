"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";

type AddPeriodToProgramProps = {
  programId: string;
  onPeriodAdded: () => void;
};

export function AddPeriodToProgram({
  programId,
  onPeriodAdded,
}: AddPeriodToProgramProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startWeek, setStartWeek] = useState("1");
  const [endWeek, setEndWeek] = useState("4");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPeriod = async () => {
    if (!name) {
      alert("Įveskite laikotarpio pavadinimą");
      return;
    }

    if (!startWeek || isNaN(Number(startWeek)) || Number(startWeek) < 1) {
      alert("Įveskite teisingą pradžios savaitės numerį");
      return;
    }

    if (
      !endWeek ||
      isNaN(Number(endWeek)) ||
      Number(endWeek) < Number(startWeek)
    ) {
      alert(
        "Įveskite teisingą pabaigos savaitės numerį (turi būti didesnis arba lygus pradžios savaitei)"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/admin/program-periods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programId,
          name,
          description,
          startWeek: Number(startWeek),
          endWeek: Number(endWeek),
        }),
      });

      if (response.ok) {
        setName("");
        setDescription("");
        setStartWeek("1");
        setEndWeek("4");

        onPeriodAdded();

        alert("Laikotarpis sėkmingai pridėtas");
      } else {
        const error = await response.json();
        alert(error.error || "Nepavyko pridėti laikotarpio");
      }
    } catch (error) {
      console.error("Error adding period:", error);
      alert("Įvyko klaida bandant pridėti laikotarpį");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Pavadinimas</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pvz., Adaptacinis laikotarpis"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Aprašymas (neprivaloma)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Trumpas laikotarpio aprašymas"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startWeek">Pradžios savaitė</Label>
              <Input
                id="startWeek"
                type="number"
                min="1"
                value={startWeek}
                onChange={(e) => {
                  setStartWeek(e.target.value);

                  if (Number(e.target.value) > Number(endWeek)) {
                    setEndWeek(e.target.value);
                  }
                }}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endWeek">Pabaigos savaitė</Label>
              <Input
                id="endWeek"
                type="number"
                min={startWeek}
                value={endWeek}
                onChange={(e) => setEndWeek(e.target.value)}
                placeholder="4"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleAddPeriod}
              disabled={isSubmitting || !name || !startWeek || !endWeek}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Pridėti laikotarpį
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
