import { Card } from "@/components/ui/card";
import { CreditCard, Users, Calendar, Tag, Percent } from "lucide-react";
import AddMembershipModal from "./components/add-membership-modal";
import EditMembershipModal from "./components/edit-membership-modal";
import DeleteMembershipModal from "./components/delete-membership-modal";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import { redirect } from "next/navigation";

import { PrismaClient } from "@prisma/client";

async function getMemberships() {
  const prisma = new PrismaClient();

  try {
    const memberships = await prisma.membership.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const membershipWithCounts = await Promise.all(
      memberships.map(async (membership) => {
        const userCount = await prisma.user.count({
          where: {
            planId: membership.planId,
          },
        });

        return {
          ...membership,
          price: Number(membership.price), // Convert Decimal to number
          _count: {
            users: userCount,
          },
        };
      })
    );

    return membershipWithCounts;
  } catch (error) {
    console.error("Failed to get memberships:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

export default async function MembershipsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/prisijungti?callbackUrl=/admin/memberships");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const memberships = await getMemberships();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Narysčių valdymas
        </h1>
        <AddMembershipModal />
      </div>

      {}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Narystė
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kaina
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nuolaida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trukmė
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vartotojai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Būsena
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veiksmai
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {memberships.map((membership) => (
                  <tr key={membership.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#60988E] rounded-full flex items-center justify-center text-white">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {membership.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {membership.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {membership.planId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Number(membership.price).toFixed(2)} €
                      </div>
                      {membership.discountPercentage > 0 && (
                        <div className="text-xs text-green-600">
                          {Number(
                            membership.price *
                              (1 - membership.discountPercentage / 100)
                          ).toFixed(2)}{" "}
                          € su nuolaida
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {membership.discountPercentage > 0 ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {membership.discountPercentage}%
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Nėra</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {membership.duration}{" "}
                      {getDurationText(membership.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {membership._count?.users || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {membership.isActive ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Aktyvi
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Neaktyvi
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <EditMembershipModal membership={membership} />
                        <DeleteMembershipModal membership={membership} />
                      </div>
                    </td>
                  </tr>
                ))}

                {memberships.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Nerasta narysčių
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {}
      <div className="md:hidden space-y-4">
        {memberships.map((membership) => (
          <Card key={membership.id} className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-[#60988E] rounded-full flex items-center justify-center text-white">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-900">
                    {membership.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {membership.id.substring(0, 8)}...
                  </div>
                </div>
              </div>
              {membership.isActive ? (
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Aktyvi
                </span>
              ) : (
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  Neaktyvi
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 mb-4">
              <div className="flex items-center text-sm">
                <Tag className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-900">
                  Plano ID: {membership.planId}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-900">
                  Kaina: {Number(membership.price).toFixed(2)} €
                  {membership.discountPercentage > 0 && (
                    <span className="ml-2 text-green-600">
                      (
                      {Number(
                        membership.price *
                          (1 - membership.discountPercentage / 100)
                      ).toFixed(2)}{" "}
                      € su nuolaida)
                    </span>
                  )}
                </span>
              </div>

              {membership.discountPercentage > 0 && (
                <div className="flex items-center text-sm">
                  <Percent className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-900">
                    Nuolaida: {membership.discountPercentage}%
                  </span>
                </div>
              )}

              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-900">
                  Trukmė: {membership.duration}{" "}
                  {getDurationText(membership.duration)}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-900">
                  Vartotojų skaičius: {membership._count?.users || 0}
                </span>
              </div>

              {membership.description && (
                <div className="text-sm text-gray-700 mt-2">
                  <p className="font-medium">Aprašymas:</p>
                  <p className="mt-1">{membership.description}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 border-t pt-3">
              <EditMembershipModal membership={membership} />
              <DeleteMembershipModal membership={membership} />
            </div>
          </Card>
        ))}

        {memberships.length === 0 && (
          <Card className="p-8 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nerasta narysčių</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function getDurationText(days: number): string {
  if (days % 365 === 0) {
    const years = days / 365;
    return `${years} ${years === 1 ? "metai" : "metai"}`;
  } else if (days % 30 === 0) {
    const months = days / 30;
    return `${months} ${
      months === 1 ? "mėnuo" : months < 5 ? "mėnesiai" : "mėnesių"
    }`;
  } else {
    return `${days} ${days === 1 ? "diena" : days < 10 ? "dienos" : "dienų"}`;
  }
}
