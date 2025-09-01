import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mokymai - LazyFit Admin",
  description: "Mokymų turinio valdymas",
};

export default function TrainingPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mokymų turinys</h1>
        <p className="text-gray-600">
          Valdykite mokymų turinį, kursus ir pamokas
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Mokymų kursai</h2>
          <button className="bg-[#60988E] text-white px-4 py-2 rounded-md hover:bg-[#4e7d75] transition-colors">
            Pridėti naują
          </button>
        </div>

        <div className="bg-gray-50 p-8 rounded-md text-center">
          <p className="text-gray-500">
            Mokymų turinio valdymo funkcionalumas bus įgyvendintas netrukus.
          </p>
          <p className="text-gray-400 mt-2">
            Čia bus galima pridėti, redaguoti ir trinti mokymų kursus ir
            pamokas.
          </p>
        </div>
      </div>
    </div>
  );
}
