"use client";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import { redirect } from "next/navigation";
import PageTitleBar from "../components/page-title-bar";
import prisma from "@/lib/prisma";
import { PlusCircle } from "lucide-react";

export default async function ManoMitybaPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/prisijungti?callbackUrl=/dashboard/mano-mityba");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { membership: true },
  });

  const membershipPlans = await prisma.nutritionPlan.findMany({
    where: {
      OR: [{ membershipId: user?.planId }, { membershipId: null }],
      isPublished: true,

      NOT: {
        createdBy: session.user.id,
      },
    },
    include: {
      days: {
        include: {
          meals: {
            include: {
              items: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const userPlans = await prisma.nutritionPlan.findMany({
    where: {
      createdBy: session.user.id,
    },
    include: {
      days: {
        include: {
          meals: {
            include: {
              items: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageTitleBar title="Mano mityba" />
      <div className="flex-1 p-6">
        <div className="mx-auto">
          {}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                Mano sukurti mitybos planai
              </h1>
              <a
                href="/dashboard/mano-mityba/naujas-planas"
                className="flex items-center gap-2 px-4 py-2 bg-[#60988e] text-white rounded-md hover:bg-[#4e7d74] transition-colors"
              >
                <PlusCircle size={18} />
                <span>Sukurti naują planą</span>
              </a>
            </div>

            {userPlans.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">
                  Dar nesukūrėte mitybos planų
                </h2>
                <p className="text-gray-600 mb-6">
                  Sukurkite savo asmeninį mitybos planą pagal savo poreikius ir
                  tikslus.
                </p>
                <a
                  href="/dashboard/mano-mityba/naujas-planas"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#60988e] text-white rounded-md hover:bg-[#4e7d74] transition-colors"
                >
                  <PlusCircle size={18} />
                  <span>Sukurti naują planą</span>
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Pavadinimas
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Aprašymas
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dienų skaičius
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Veiksmai
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {plan.name}
                          </div>
                          <div className="text-xs text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-full mt-1">
                            Mano planas
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {plan.description || "Nėra aprašymo"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {plan.days.length} dienų
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <a
                              href={`/dashboard/mano-mityba/redaguoti/${plan.id}`}
                              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                            >
                              Redaguoti
                            </a>
                            <a
                              href={`/dashboard/mano-mityba/planas/${plan.id}`}
                              className="px-3 py-1.5 bg-[#60988e] text-white text-sm rounded hover:bg-[#4e7d74] transition-colors"
                            >
                              Peržiūrėti
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Narystės mitybos planai</h2>

            {membershipPlans.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">
                  Nėra aktyvių mitybos planų
                </h2>
                <p className="text-gray-600 mb-6">
                  Šiuo metu jums nėra priskirta jokių mitybos planų.
                  Atnaujinkite savo narystę, kad gautumėte prieigą prie išsamių
                  mitybos planų.
                </p>
                <a
                  href="/narystes"
                  className="inline-block px-6 py-3 bg-[#60988e] text-white rounded-md hover:bg-[#4e7d74] transition-colors"
                >
                  Peržiūrėti narystes
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Pavadinimas
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Aprašymas
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dienų skaičius
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Veiksmai
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {membershipPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {plan.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {plan.description || "Nėra aprašymo"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {plan.days.length} dienų
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            href={`/dashboard/mano-mityba/planas/${plan.id}`}
                            className="px-3 py-1.5 bg-[#60988e] text-white text-sm rounded hover:bg-[#4e7d74] transition-colors"
                          >
                            Peržiūrėti
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
