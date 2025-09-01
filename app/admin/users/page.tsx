import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { lt } from "date-fns/locale";
import Image from "next/image";
import UserEditModal from "./components/user-edit-modal";
import AddUserModal from "./components/add-user-modal";
import DeleteUserModal from "./components/delete-user-modal";
import { Calendar, User, Mail, Shield, Clock } from "lucide-react";

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    return users;
  } catch (error) {
    console.error("Failed to get users:", error);
    return [];
  }
}

export default async function UsersPage() {
  const users = await getUsers();

  const membershipStatusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    expired: "bg-red-100 text-red-800",
  };

  const membershipStatusText = {
    active: "Aktyvi",
    inactive: "Neaktyvi",
    pending: "Laukiama",
    expired: "Pasibaigusi",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Vartotojų valdymas
        </h1>
        <AddUserModal />
      </div>

      {}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vartotojas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    El. paštas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rolė
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Narystė
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Galiojimas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registracija
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veiksmai
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  const isGoogleUser =
                    user.provider === "google" ||
                    user.accounts.some(
                      (account) => account.provider === "google"
                    );

                  const isEmailVerified = user.emailVerified || isGoogleUser;

                  const statusColor =
                    membershipStatusColors[
                      user.membershipStatus as keyof typeof membershipStatusColors
                    ] || "bg-gray-100 text-gray-800";
                  const statusText =
                    membershipStatusText[
                      user.membershipStatus as keyof typeof membershipStatusText
                    ] || "Nenustatyta";

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-[#60988E] flex items-center justify-center text-white">
                            {user.image ? (
                              <Image
                                src={user.image || "/placeholder.svg"}
                                alt={user.name || "User"}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : user.name ? (
                              user.name[0].toUpperCase()
                            ) : (
                              "?"
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {user.name || "Nenurodyta"}
                              {isGoogleUser && (
                                <span className="ml-2">
                                  <Image
                                    src="/images/google-icon.png"
                                    alt="Google"
                                    width={16}
                                    height={16}
                                    className="inline-block"
                                  />
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {user.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {isEmailVerified ? "Patvirtintas" : "Nepatvirtintas"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-[#60988E] text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}
                          >
                            {statusText}
                          </span>
                        </div>
                        {user.planId && (
                          <div className="text-xs text-gray-500 mt-1">
                            Planas: {user.planId}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.membershipExpiry
                          ? format(
                              new Date(user.membershipExpiry),
                              "yyyy-MM-dd",
                              { locale: lt }
                            )
                          : "Nenustatyta"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(user.createdAt), "yyyy-MM-dd", {
                          locale: lt,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <UserEditModal user={user} />
                          <DeleteUserModal user={user} />
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Nerasta vartotojų
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
        {users.map((user) => {
          const isGoogleUser =
            user.provider === "google" ||
            user.accounts.some((account) => account.provider === "google");

          const isEmailVerified = user.emailVerified || isGoogleUser;

          const statusColor =
            membershipStatusColors[
              user.membershipStatus as keyof typeof membershipStatusColors
            ] || "bg-gray-100 text-gray-800";
          const statusText =
            membershipStatusText[
              user.membershipStatus as keyof typeof membershipStatusText
            ] || "Nenustatyta";

          return (
            <Card key={user.id} className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-[#60988E] flex items-center justify-center text-white">
                    {user.image ? (
                      <Image
                        src={user.image || "/placeholder.svg"}
                        alt={user.name || "User"}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : user.name ? (
                      user.name[0].toUpperCase()
                    ) : (
                      "?"
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-900 flex items-center">
                      {user.name || "Nenurodyta"}
                      {isGoogleUser && (
                        <span className="ml-2">
                          <Image
                            src="/images/google-icon.png"
                            alt="Google"
                            width={16}
                            height={16}
                            className="inline-block"
                          />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {user.id.substring(0, 8)}...
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === "admin"
                      ? "bg-[#60988E] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 mb-4">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-900">{user.email}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({isEmailVerified ? "Patvirtintas" : "Nepatvirtintas"})
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 mr-2 text-gray-500" />
                  <span
                    className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}
                  >
                    {statusText}
                  </span>
                  {user.planId && (
                    <span className="ml-2 text-xs text-gray-500">
                      Planas: {user.planId}
                    </span>
                  )}
                </div>

                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-900">
                    {user.membershipExpiry
                      ? format(new Date(user.membershipExpiry), "yyyy-MM-dd", {
                          locale: lt,
                        })
                      : "Nenustatyta"}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-500">
                    Registracija:{" "}
                    {format(new Date(user.createdAt), "yyyy-MM-dd", {
                      locale: lt,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 border-t pt-3">
                <UserEditModal user={user} />
                <DeleteUserModal user={user} />
              </div>
            </Card>
          );
        })}

        {users.length === 0 && (
          <Card className="p-8 text-center">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nerasta vartotojų</p>
          </Card>
        )}
      </div>
    </div>
  );
}
