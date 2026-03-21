"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteExerciseButtonProps {
  workoutExerciseId: string;
}

export default function DeleteExerciseButton({
  workoutExerciseId,
}: DeleteExerciseButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Ar tikrai norite pašalinti šį pratimą iš treniruotės?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/workout-exercises/${workoutExerciseId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Nepavyko pašalinti pratimo");
        return;
      }

      router.refresh();
    } catch {
      alert("Įvyko klaida šalinant pratimą");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 disabled:opacity-50"
      title="Pašalinti pratimą"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
