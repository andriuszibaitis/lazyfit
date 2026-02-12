"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  Search,
  Pencil,
  Trash2,
  Trophy,
} from "lucide-react";
import DeleteAchievementModal from "./delete-achievement-modal";

type Achievement = {
  id: string;
  code: string;
  title: string;
  description: string;
  iconUrl: string | null;
  iconSvg: string | null;
  trigger: string | null;
  triggerValue: number | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

const triggerLabels: Record<string, string> = {
  first_measurement: "Pirmas matavimas",
  first_workout: "Pirma treniruotė",
  first_photo: "Pirma nuotrauka",
  workout_streak: "Treniruočių serija",
  total_workouts: "Iš viso treniruočių",
  nutrition_streak: "Mitybos dienoraščio serija",
  half_goal: "Pusė tikslo",
  plan_completed: "Planas užbaigtas",
  weekend_workout: "Savaitgalio treniruotė",
  social_action: "Socialinis veiksmas",
};

export default function AchievementsList() {
  const router = useRouter();

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement | null>(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/achievements");
      if (!response.ok) {
        throw new Error("Failed to fetch achievements");
      }
      const data = await response.json();
      setAchievements(data.achievements || []);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (achievement: Achievement) => {
    setAchievementToDelete(achievement);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!achievementToDelete) return;

    try {
      const response = await fetch(`/api/admin/achievements/${achievementToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete achievement");
      }

      fetchAchievements();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };

  const filteredAchievements = achievements.filter((achievement) => {
    return achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getTriggerLabel = (trigger: string | null, value: number | null) => {
    if (!trigger) return "Nenustatyta";
    const label = triggerLabels[trigger] || trigger;
    if (value) {
      return `${label} (${value})`;
    }
    return label;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Ieškoti pasiekimų..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-[#60988E]" />
            <p>Kraunama...</p>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "Nerasta pasiekimų pagal pasirinktus filtrus"
                : "Nėra sukurtų pasiekimų"}
            </p>
            <Button
              onClick={() => router.push("/admin/turinys/pasiekimai/new")}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Pridėti pirmą pasiekimą
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ikona</TableHead>
                  <TableHead>Pavadinimas</TableHead>
                  <TableHead>Kodas</TableHead>
                  <TableHead>Tikslas</TableHead>
                  <TableHead>Tvarka</TableHead>
                  <TableHead>Statusas</TableHead>
                  <TableHead className="text-right">Veiksmai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAchievements.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell>
                      {achievement.iconSvg ? (
                        <div
                          className="w-8 h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                          dangerouslySetInnerHTML={{ __html: achievement.iconSvg }}
                        />
                      ) : achievement.iconUrl ? (
                        <Image
                          src={achievement.iconUrl}
                          alt={achievement.title}
                          width={32}
                          height={32}
                        />
                      ) : (
                        <Trophy className="h-8 w-8 text-[#60988E]" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {achievement.title}
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {achievement.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      {getTriggerLabel(achievement.trigger, achievement.triggerValue)}
                    </TableCell>
                    <TableCell>
                      {achievement.order}
                    </TableCell>
                    <TableCell>
                      {achievement.isActive ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Aktyvus
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100">
                          Neaktyvus
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(
                              `/admin/turinys/pasiekimai/${achievement.id}/edit`
                            )
                          }
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Redaguoti</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(achievement)}
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Ištrinti</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <DeleteAchievementModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        achievementName={achievementToDelete?.title || ""}
      />
    </div>
  );
}
