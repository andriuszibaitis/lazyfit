import type React from "react";
import { Card } from "@/components/ui/card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth-options";
import { PrismaClient } from "@prisma/client";
import {
  Users,
  Mail,
  ShieldCheck,
  Activity,
  Calendar,
  SettingsIcon,
} from "lucide-react";

const prisma = new PrismaClient();

async function getStats() {
  try {
    const totalUsers = await prisma.user.count();
    const unverifiedUsers = await prisma.user.count({
      where: {
        emailVerified: null,
      },
    });
    const adminUsers = await prisma.user.count({
      where: {
        role: "admin",
      },
    });

    return {
      totalUsers,
      unverifiedUsers,
      adminUsers,

      activeUsers: 0,
      newUsersToday: 0,
    };
  } catch (error) {
    console.error("Failed to get stats:", error);
    return {
      totalUsers: 0,
      unverifiedUsers: 0,
      adminUsers: 0,
      activeUsers: 0,
      newUsersToday: 0,
    };
  } finally {
    await prisma.$disconnect();
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const stats = await getStats();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Administravimo skydelis
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Prisijungęs kaip:</span>
          <span className="font-medium">{session?.user.name}</span>
          <span className="inline-flex items-center text-xs bg-[#60988E] text-white px-2 py-0.5 rounded-full">
            <ShieldCheck size={12} className="mr-1" /> Admin
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Vartotojai"
          value={stats.totalUsers}
          icon={<Users className="h-8 w-8 text-blue-500" />}
          description="Bendras vartotojų skaičius"
        />
        <StatCard
          title="Nepatvirtinti el. paštai"
          value={stats.unverifiedUsers}
          icon={<Mail className="h-8 w-8 text-yellow-500" />}
          description="Vartotojai be patvirtinto el. pašto"
        />
        <StatCard
          title="Administratoriai"
          value={stats.adminUsers}
          icon={<ShieldCheck className="h-8 w-8 text-[#60988E]" />}
          description="Vartotojai su admin teisėmis"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-[#60988E]" />
            Naujausi veiksmai
          </h2>
          <div className="space-y-4">
            <p className="text-gray-500 text-sm italic">
              Nėra naujausių veiksmų
            </p>
            {}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-[#60988E]" />
            Greitos nuorodos
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickLinkButton
              href="/admin/users"
              icon={<Users className="h-5 w-5" />}
              label="Vartotojų valdymas"
            />
            <QuickLinkButton
              href="/admin/settings"
              icon={<SettingsIcon className="h-5 w-5" />}
              label="Sistemos nustatymai"
            />
            <QuickLinkButton
              href="/admin/emails"
              icon={<Mail className="h-5 w-5" />}
              label="El. pašto šablonai"
            />
            <QuickLinkButton
              href="/admin/roles"
              icon={<ShieldCheck className="h-5 w-5" />}
              label="Rolių valdymas"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
      </div>
    </Card>
  );
}

function QuickLinkButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      <div className="mr-3 text-[#60988E]">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}
