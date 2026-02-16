"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Users,
  CreditCard,
  BookOpen,
  Dumbbell,
  UtensilsCrossed,
  Trophy,
  TrendingUp,
  UserCheck,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  activeMembers: number;
  totalCourses: number;
  totalWorkouts: number;
  totalPrograms: number;
  totalRecipes: number;
  totalFoodProducts: number;
  totalAchievements: number;
  totalNutritionPlans: number;
  totalExercises: number;
  membershipBreakdown: { planId: string; name: string; count: number }[];
  recentUsers: { id: string; name: string; email: string; createdAt: string; membershipStatus: string }[];
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/statistics");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Statistika</h1>
        <div className="py-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#60988E] border-r-transparent"></div>
          <p className="mt-2 text-gray-500">Kraunama statistika...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Viso vartotojų", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500" },
    { title: "Aktyvios narystės", value: stats?.activeMembers || 0, icon: UserCheck, color: "text-green-500" },
    { title: "Kursai", value: stats?.totalCourses || 0, icon: BookOpen, color: "text-purple-500" },
    { title: "Treniruotės", value: stats?.totalWorkouts || 0, icon: Dumbbell, color: "text-orange-500" },
    { title: "Sporto programos", value: stats?.totalPrograms || 0, icon: TrendingUp, color: "text-indigo-500" },
    { title: "Receptai", value: stats?.totalRecipes || 0, icon: UtensilsCrossed, color: "text-pink-500" },
    { title: "Maisto produktai", value: stats?.totalFoodProducts || 0, icon: UtensilsCrossed, color: "text-yellow-600" },
    { title: "Mitybos planai", value: stats?.totalNutritionPlans || 0, icon: UtensilsCrossed, color: "text-teal-500" },
    { title: "Pratimai", value: stats?.totalExercises || 0, icon: Dumbbell, color: "text-red-500" },
    { title: "Pasiekimai", value: stats?.totalAchievements || 0, icon: Trophy, color: "text-amber-500" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Statistika</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#60988E]" />
            Narystės pasiskirstymas
          </h2>
          {stats?.membershipBreakdown && stats.membershipBreakdown.length > 0 ? (
            <div className="space-y-3">
              {stats.membershipBreakdown.map((item) => (
                <div key={item.planId} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#60988E] h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (item.count / (stats?.totalUsers || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium text-gray-500">Be narystės</span>
                <span className="text-sm text-gray-600">
                  {(stats?.totalUsers || 0) - stats.membershipBreakdown.reduce((a, b) => a + b.count, 0)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nėra narystės duomenų</p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#60988E]" />
            Naujausi vartotojai
          </h2>
          {stats?.recentUsers && stats.recentUsers.length > 0 ? (
            <div className="space-y-3">
              {stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{user.name || "Be vardo"}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                        user.membershipStatus === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.membershipStatus === "active" ? "Aktyvus" : "Neaktyvus"}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(user.createdAt).toLocaleDateString("lt-LT")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nėra vartotojų</p>
          )}
        </Card>
      </div>
    </div>
  );
}
