import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import AddExerciseToWorkout from "./components/add-exercise-to-workout";

async function getWorkout(id: string) {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        workoutExercises: {
          include: {
            exercise: true,
          },
          orderBy: { order: "asc" },
        },
        programWorkouts: {
          include: {
            program: true,
          },
        },
      },
    });
    return workout;
  } catch (error) {
    console.error("Error fetching workout:", error);
    return null;
  }
}

async function getExercises() {
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: { name: "asc" },
    });
    return exercises;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
}

export default async function WorkoutDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/auth/prisijungti");
  }

  const workout = await getWorkout(params.id);
  const exercises = await getExercises();

  if (!workout) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Treniruotė nerasta</h1>
        <Link
          href="/admin/turinys/sportas/treniruotes"
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Grįžti į treniruočių sąrašą
        </Link>
      </div>
    );
  }

  const groupedExercises: Record<string, any[]> = {};

  workout.workoutExercises.forEach((we) => {
    const key = we.supersetGroup || "regular";
    if (!groupedExercises[key]) {
      groupedExercises[key] = [];
    }
    groupedExercises[key].push(we);
  });

  Object.keys(groupedExercises).forEach((key) => {
    if (key !== "regular") {
      groupedExercises[key].sort(
        (a, b) => (a.supersetOrder || 0) - (b.supersetOrder || 0)
      );
    }
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{workout.name}</h1>
        <div className="flex gap-2">
          <Link
            href={`/admin/turinys/sportas/treniruotes/${params.id}/edit`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" /> Redaguoti
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <Link
          href="/admin/turinys/sportas/treniruotes"
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Grįžti į treniruočių sąrašą
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Treniruotės informacija
          </h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Pavadinimas:</span> {workout.name}
            </div>
            <div>
              <span className="font-medium">Aprašymas:</span>{" "}
              {workout.description || "Nėra aprašymo"}
            </div>
            <div>
              <span className="font-medium">Trukmė:</span>{" "}
              {workout.duration ? `${workout.duration} min.` : "Nenurodyta"}
            </div>
            <div>
              <span className="font-medium">Sudėtingumas:</span>{" "}
              {workout.difficulty === "easy"
                ? "Lengvas"
                : workout.difficulty === "medium"
                ? "Vidutinis"
                : "Sunkus"}
            </div>
            <div>
              <span className="font-medium">Tikslinės raumenų grupės:</span>{" "}
              {workout.targetMuscleGroups &&
              workout.targetMuscleGroups.length > 0
                ? workout.targetMuscleGroups.join(", ")
                : "Nenurodyta"}
            </div>
            <div>
              <span className="font-medium">Įranga:</span>{" "}
              {workout.equipment && workout.equipment.length > 0
                ? workout.equipment.join(", ")
                : "Nereikalinga"}
            </div>
            <div>
              <span className="font-medium">Publikuota:</span>{" "}
              {workout.isPublished ? "Taip" : "Ne"}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Programos</h2>
          {workout.programWorkouts.length > 0 ? (
            <ul className="space-y-2">
              {workout.programWorkouts.map((pw) => (
                <li key={pw.id} className="flex justify-between items-center">
                  <Link
                    href={`/admin/turinys/sportas/programos/${pw.programId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {pw.program.name} (Diena {pw.day}, Eilė {pw.order})
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              Ši treniruotė nepriskirta jokiai programai
            </p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Pratimai</h2>
        </div>

        {Object.keys(groupedExercises).length > 0 ? (
          <div className="space-y-6">
            {Object.keys(groupedExercises).map((key) => (
              <div
                key={key}
                className={`${
                  key !== "regular"
                    ? "border p-4 rounded-md border-blue-200 bg-blue-50"
                    : ""
                }`}
              >
                {key !== "regular" && (
                  <h3 className="text-lg font-medium mb-3">
                    Superserija: {key}
                  </h3>
                )}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Eilė
                        </th>
                        {key !== "regular" && (
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Superserijos eilė
                          </th>
                        )}
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pratimas
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Serijos
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pakartojimai
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Poilsis
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tempas
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pastabos
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Veiksmai
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupedExercises[key].map((we) => (
                        <tr key={we.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {we.order}
                          </td>
                          {key !== "regular" && (
                            <td className="px-4 py-3 whitespace-nowrap">
                              {we.supersetOrder}
                            </td>
                          )}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {we.exercise.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {we.sets || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {we.reps || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {we.restTime ? `${we.restTime} s` : "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {we.tempo || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {we.notes || "-"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <form
                              action={`/api/admin/workout-exercises/${we.id}`}
                              method="DELETE"
                            >
                              <button
                                type="submit"
                                className="text-red-600 hover:text-red-800"
                                title="Pašalinti pratimą"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Šioje treniruotėje nėra pratimų</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Pridėti pratimą</h2>
        <AddExerciseToWorkout workoutId={params.id} exercises={exercises} />
      </div>
    </div>
  );
}
