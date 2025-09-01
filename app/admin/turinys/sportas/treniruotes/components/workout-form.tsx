"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface WorkoutFormProps {
  workout?: {
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
  };
}

export default function WorkoutForm({ workout }: WorkoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!workout;

  const [formData, setFormData] = useState({
    name: workout?.name || "",
    description: workout?.description || "",
    duration: workout?.duration?.toString() || "",
    difficulty: workout?.difficulty || "medium",
    targetMuscleGroups: workout?.targetMuscleGroups?.join(", ") || "",
    equipment: workout?.equipment?.join(", ") || "",
    imageUrl: workout?.imageUrl || "",
    videoUrl: workout?.videoUrl || "",
    isPublished: workout?.isPublished || false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const processedData = {
        ...formData,
        targetMuscleGroups: formData.targetMuscleGroups
          ? formData.targetMuscleGroups.split(",").map((item) => item.trim())
          : [],
        equipment: formData.equipment
          ? formData.equipment.split(",").map((item) => item.trim())
          : [],
      };

      const url = isEditing
        ? `/api/admin/workouts/${workout.id}`
        : "/api/admin/workouts";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Įvyko klaida išsaugant treniruotę");
      }

      router.push("/admin/turinys/sportas/treniruotes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Įvyko klaida");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pavadinimas *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Aprašymas
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trukmė (minutėmis)
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sudėtingumas
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Lengvas</option>
            <option value="medium">Vidutinis</option>
            <option value="hard">Sunkus</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tikslinės raumenų grupės (atskirti kableliais)
        </label>
        <input
          type="text"
          name="targetMuscleGroups"
          value={formData.targetMuscleGroups}
          onChange={handleChange}
          placeholder="Pvz.: Krūtinė, Bicepsas, Tricepsas"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Įranga (atskirti kableliais)
        </label>
        <input
          type="text"
          name="equipment"
          value={formData.equipment}
          onChange={handleChange}
          placeholder="Pvz.: Hanteliai, Štanga, Suoliukas"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nuotraukos URL
          </label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video URL
          </label>
          <input
            type="text"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublished"
          name="isPublished"
          checked={formData.isPublished}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="isPublished"
          className="ml-2 block text-sm text-gray-700"
        >
          Publikuoti treniruotę
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {loading
            ? "Saugoma..."
            : isEditing
            ? "Atnaujinti treniruotę"
            : "Sukurti treniruotę"}
        </button>
      </div>
    </form>
  );
}
