"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dumbbell,
  Plus,
  ListOrdered,
  Activity,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SportsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("programs");
  const [programs, setPrograms] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (
      pathname.includes("/programos") ||
      pathname === "/admin/turinys/sportas"
    ) {
      setActiveTab("programs");
    } else if (pathname.includes("/treniruotes")) {
      setActiveTab("workouts");
    } else if (pathname.includes("/pratimai")) {
      setActiveTab("exercises");
    }
  }, [pathname]);

  const handleTabChange = (value) => {
    setActiveTab(value);

    let newPath = "/admin/turinys/sportas";
    if (value === "programs") {
      newPath = "/admin/turinys/sportas/programos";
    } else if (value === "workouts") {
      newPath = "/admin/turinys/sportas/treniruotes";
    } else if (value === "exercises") {
      newPath = "/admin/turinys/sportas/pratimai";
    }

    router.push(newPath);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, statusFilter]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      if (activeTab === "programs" || activeTab === "") {
        let url = "/api/admin/training-programs";
        if (statusFilter) {
          url += `?published=${statusFilter}`;
        }
        const programsResponse = await fetch(url);
        const programsData = await programsResponse.json();
        setPrograms(programsData.programs || []);
      }

      if (activeTab === "workouts") {
        let url = "/api/admin/workouts";
        if (statusFilter) {
          url += `?published=${statusFilter}`;
        }
        const workoutsResponse = await fetch(url);
        const workoutsData = await workoutsResponse.json();
        setWorkouts(workoutsData.workouts || []);
      }

      if (activeTab === "exercises") {
        let url = "/api/admin/exercises";
        if (statusFilter) {
          url += `?published=${statusFilter}`;
        }
        const exercisesResponse = await fetch(url);
        const exercisesData = await exercisesResponse.json();
        setExercises(exercisesData.exercises || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Klaida gaunant duomenis");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id, type) => {
    if (
      !confirm(
        `Ar tikrai norite ištrinti šį ${
          type === "program"
            ? "programą"
            : type === "workout"
            ? "treniruotę"
            : "pratimą"
        }?`
      )
    ) {
      return;
    }

    try {
      let endpoint = "";
      if (type === "program") {
        endpoint = `/api/admin/training-programs/${id}`;
      } else if (type === "workout") {
        endpoint = `/api/admin/workouts/${id}`;
      } else if (type === "exercise") {
        endpoint = `/api/admin/exercises/${id}`;
      }

      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`);
      }

      alert(
        `${
          type === "program"
            ? "Programa"
            : type === "workout"
            ? "Treniruotė"
            : "Pratimas"
        } sėkmingai ištrintas`
      );
      fetchData();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(
        `Klaida trinant ${
          type === "program"
            ? "programą"
            : type === "workout"
            ? "treniruotę"
            : "pratimą"
        }: ${error.message}`
      );
    }
  };

  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (program.description &&
        program.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredWorkouts = workouts.filter(
    (workout) =>
      workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (workout.description &&
        workout.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exercise.description &&
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "Lengvas";
      case "medium":
        return "Vidutinis";
      case "hard":
      case "advanced":
        return "Sunkus";
      default:
        return difficulty;
    }
  };

  const getMuscleGroupLabel = (muscleGroup) => {
    if (!muscleGroup) return "Neapibrėžta";

    const muscleGroups = {
      chest: "Krūtinė",
      back: "Nugara",
      shoulders: "Pečiai",
      biceps: "Bicepsai",
      triceps: "Tricepsai",
      forearms: "Dilbiai",
      abs: "Pilvo presas",
      quads: "Keturgalvis",
      hamstrings: "Dvigalvis",
      calves: "Blauzdos",
      glutes: "Sėdmenys",
      cardio: "Kardio",
      full_body: "Visas kūnas",
      arms: "Rankos",
      legs: "Kojos",
      core: "Korpusas",
      fullBody: "Visas kūnas",
    };

    return muscleGroups[muscleGroup] || muscleGroup;
  };

  const getEquipmentLabel = (equipment) => {
    if (!equipment) return "Nereikia įrangos";

    const equipmentTypes = {
      bodyweight: "Kūno svoris",
      dumbbells: "Hanteliai",
      barbell: "Štanga",
      kettlebell: "Girija",
      resistance_bands: "Pasipriešinimo gumos",
      cable_machine: "Trosas",
      smith_machine: "Smith mašina",
      bench: "Suoliukas",
      pull_up_bar: "Skersinis",
      medicine_ball: "Medicininis kamuolys",
      bosu_ball: "Bosu kamuolys",
    };

    return equipmentTypes[equipment] || equipment;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sporto valdymas</h1>
          <p className="text-gray-600">
            Valdykite treniruočių programas, treniruotes ir pratimus
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filtrai</CardTitle>
          <CardDescription>
            Filtruokite ir ieškokite sporto turinio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Ieškoti pagal pavadinimą ar aprašymą"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Publikavimo statusas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Visi</SelectItem>
                <SelectItem value="true">Publikuoti</SelectItem>
                <SelectItem value="false">Nepublikuoti</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="programs">Programos</TabsTrigger>
          <TabsTrigger value="workouts">Treniruotės</TabsTrigger>
          <TabsTrigger value="exercises">Pratimai</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Treniruočių programos</h2>
            <Button asChild>
              <Link href="/admin/turinys/sportas/programos/new">
                <Plus className="h-4 w-4 mr-2" />
                Nauja programa
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Kraunama...</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <ListOrdered className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  Nėra sukurtų programų
                </p>
                <p className="text-gray-500 mb-4 text-center">
                  Sukurkite pirmąją treniruočių programą
                </p>
                <Button asChild>
                  <Link href="/admin/turinys/sportas/programos/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Nauja programa
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pavadinimas</TableHead>
                    <TableHead>Sudėtingumas</TableHead>
                    <TableHead>Trukmė</TableHead>
                    <TableHead>Statusas</TableHead>
                    <TableHead className="text-right">Veiksmai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrograms.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell className="font-medium">
                        {program.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getDifficultyLabel(program.difficulty)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {program.duration ? `${program.duration} d.` : "-"}
                      </TableCell>
                      <TableCell>
                        {program.isPublished ? (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm">Publikuota</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-sm">Nepublikuota</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link
                              href={`/admin/turinys/sportas/programos/${program.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="icon" asChild>
                            <Link
                              href={`/admin/turinys/sportas/programos/${program.id}/edit`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleDeleteItem(program.id, "program")
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Treniruotės</h2>
            <Button asChild>
              <Link href="/admin/turinys/sportas/treniruotes/new">
                <Plus className="h-4 w-4 mr-2" />
                Nauja treniruotė
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Kraunama...</p>
            </div>
          ) : filteredWorkouts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Dumbbell className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  Nėra sukurtų treniruočių
                </p>
                <p className="text-gray-500 mb-4 text-center">
                  Sukurkite pirmąją treniruotę
                </p>
                <Button asChild>
                  <Link href="/admin/turinys/sportas/treniruotes/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Nauja treniruotė
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pavadinimas</TableHead>
                    <TableHead>Sudėtingumas</TableHead>
                    <TableHead>Trukmė</TableHead>
                    <TableHead>Pratimai</TableHead>
                    <TableHead>Statusas</TableHead>
                    <TableHead className="text-right">Veiksmai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkouts.map((workout) => (
                    <TableRow key={workout.id}>
                      <TableCell className="font-medium">
                        {workout.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getDifficultyLabel(workout.difficulty)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {workout.duration ? `${workout.duration} min.` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {workout.workoutExercises?.length || 0} pratimų
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {workout.isPublished ? (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm">Publikuota</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-sm">Nepublikuota</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link
                              href={`/admin/turinys/sportas/treniruotes/${workout.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="icon" asChild>
                            <Link
                              href={`/admin/turinys/sportas/treniruotes/${workout.id}/edit`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleDeleteItem(workout.id, "workout")
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pratimai</h2>
            <Button asChild>
              <Link href="/admin/turinys/sportas/pratimai/new">
                <Plus className="h-4 w-4 mr-2" />
                Naujas pratimas
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Kraunama...</p>
            </div>
          ) : filteredExercises.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Activity className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  Nėra sukurtų pratimų
                </p>
                <p className="text-gray-500 mb-4 text-center">
                  Sukurkite pirmąjį pratimą
                </p>
                <Button asChild>
                  <Link href="/admin/turinys/sportas/pratimai/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Naujas pratimas
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pavadinimas</TableHead>
                    <TableHead>Raumenų grupė</TableHead>
                    <TableHead>Sudėtingumas</TableHead>
                    <TableHead>Įranga</TableHead>
                    <TableHead>Statusas</TableHead>
                    <TableHead className="text-right">Veiksmai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExercises.map((exercise) => (
                    <TableRow key={exercise.id}>
                      <TableCell className="font-medium">
                        {exercise.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getMuscleGroupLabel(exercise.muscleGroup)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getDifficultyLabel(exercise.difficulty)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getEquipmentLabel(exercise.equipment)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {exercise.isPublished ? (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm">Publikuotas</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-sm">Nepublikuotas</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link
                              href={`/admin/turinys/sportas/pratimai/${exercise.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="icon" asChild>
                            <Link
                              href={`/admin/turinys/sportas/pratimai/${exercise.id}/edit`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleDeleteItem(exercise.id, "exercise")
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
