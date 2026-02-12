"use client";

import React, { use } from "react";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, ChevronDown, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import PageTitleBar from "../../components/page-title-bar";
import dynamic from "next/dynamic";
import { getCache, setCache } from "@/app/lib/cache-utils";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface Exercise {
  id: string;
  name: string;
  description?: string | null;
  sets?: number | null;
  reps?: string | null;
  tempo?: string | null;
  restTime?: number | null;
  notes?: string | null;
  instructions?: any;
  videoUrl?: string | null;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
}

interface WorkoutExercise {
  id: string;
  order: number;
  sets?: number | null;
  reps?: string | null;
  tempo?: string | null;
  restTime?: number | null;
  notes?: string | null;
  exercise: Exercise;
  supersetGroup?: string | null;
  supersetOrder?: number | null;
}

interface Workout {
  id: string;
  name: string;
  description?: string | null;
  duration?: number | null;
  difficulty: string;
  targetMuscleGroups?: any;
  equipment?: any;
  imageUrl?: string | null;
  videoUrl?: string | null;
  workoutExercises: WorkoutExercise[];
  membershipId?: string | null;
}

export default function TrainingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState({
    benefits: true,
    equipment: false,
    technique: true,
  });
  const [expandedExercises, setExpandedExercises] = useState<
    Record<string, boolean>
  >({});
  const [mainVideoPlaying, setMainVideoPlaying] = useState(false);
  const [exerciseVideoPlaying, setExerciseVideoPlaying] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/auth/prisijungti?callbackUrl=/dashboard");
        return;
      }

      setUser(session.user);
      console.log("User session:", {
        id: session.user.id,
        membershipId: session.user.membershipId,
        membershipStatus: session.user.membershipStatus,
      });

      try {
        if (!id || id === "undefined") {
          throw new Error("Invalid workout ID");
        }

        const cacheKey = `workout_${id}`;
        const cachedWorkout = getCache<Workout>(cacheKey);

        if (cachedWorkout) {
          console.log("Naudojami cache duomenys treniruotei:", id);
          setWorkout(cachedWorkout);

          initializeStates(cachedWorkout);
          setLoading(false);
          return;
        }

        console.log("Kraunami duomenys iš API treniruotei:", id);
        const res = await fetch(`/api/workouts/${id}`);
        if (!res.ok) {
          console.error("API response not OK:", res.status, res.statusText);
          throw new Error("Failed to fetch workout");
        }
        const data = await res.json();
        console.log("Gauti treniruotės duomenys:", {
          id: data.id,
          name: data.name,
          hasMainVideo: !!data.videoUrl,
          exerciseCount: data.workoutExercises?.length || 0,
          membershipId: data.membershipId,
        });

        setCache(cacheKey, data);
        setWorkout(data);

        initializeStates(data);
      } catch (err) {
        setError("Nepavyko užkrauti treniruotės duomenų");
        console.error("Error loading workout data:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [id, router]);

  const initializeStates = (data: Workout) => {
    const exerciseStates: Record<string, boolean> = {};
    const videoPlayingStates: Record<string, boolean> = {};

    data.workoutExercises.forEach((ex: WorkoutExercise, index: number) => {
      exerciseStates[ex.id] = index === 0;
      videoPlayingStates[ex.exercise.id] = false;
    });

    setExpandedExercises(exerciseStates);
    setExerciseVideoPlaying(videoPlayingStates);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleExercise = (id: string) => {
    setExpandedExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleExerciseVideoPlay = (
    exerciseId: string,
    e?: React.MouseEvent
  ) => {
    if (e) {
      e.stopPropagation();
    }
    setExerciseVideoPlaying((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const toggleMainVideoPlay = () => {
    setMainVideoPlaying(!mainVideoPlaying);
  };

  const renderVideo = (
    videoUrl: string | null | undefined,
    imageUrl: string | null | undefined,
    title: string,
    isPlaying: boolean,
    onTogglePlay: () => void
  ) => {
    console.log("Rendering video:", { videoUrl, title, isPlaying });

    if (!videoUrl) {
      console.log("No video URL provided, showing image only");
      return (
        <div className="relative w-full h-full">
          <Image
            src={imageUrl || "/placeholder.svg?height=600&width=1200"}
            alt={title}
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 p-3 rounded-lg">
              <p className="text-white text-center">Video nepasiekiamas</p>
            </div>
          </div>
        </div>
      );
    }

    if (videoUrl === "restricted") {
      console.log("Video is restricted due to membership");
      return (
        <div className="relative w-full h-full">
          <Image
            src={imageUrl || "/placeholder.svg?height=600&width=1200"}
            alt={title}
            fill
            className="object-cover rounded-lg opacity-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-lg">
            <div className="text-white text-center p-6">
              <h3 className="text-xl font-bold mb-2">Narystės apribojimas</h3>
              <p className="mb-4">
                Šis turinys prieinamas tik su atitinkama naryste.
              </p>
              <Button
                onClick={() => router.push("/components/membership-pricing")}
                className="bg-green-600 hover:bg-green-700"
              >
                Atnaujinti narystę
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (
      videoUrl.includes("b-cdn.net") ||
      videoUrl.includes("iframe.mediadelivery.net") ||
      videoUrl.includes("bunny")
    ) {
      console.log("Rendering Bunny.net video with iframe");

      let embedUrl = videoUrl;
      if (videoUrl.includes("/play/")) {
        console.log("Converting play URL to embed URL");
        embedUrl = videoUrl.replace("/play/", "/embed/");
      }

      if (isPlaying) {
        embedUrl =
          embedUrl + (embedUrl.includes("?") ? "&" : "?") + "autoplay=true";
      } else {
        embedUrl =
          embedUrl + (embedUrl.includes("?") ? "&" : "?") + "autoplay=false";
      }

      if (!embedUrl.includes("responsive=")) {
        embedUrl = embedUrl + "&responsive=true";
      }

      console.log("Final embed URL:", embedUrl);

      return (
        <div className="relative w-full h-full bg-[#001021] rounded-lg overflow-hidden">
          <div
            style={{
              position: "relative",
              paddingTop: "56.25%",
              width: "100%",
              height: "0",
            }}
          >
            <iframe
              src={embedUrl}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "0.5rem",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={(e) => console.error("iframe loading error:", e)}
            ></iframe>
          </div>
        </div>
      );
    }

    console.log("Rendering non-Bunny video with ReactPlayer");
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <ReactPlayer
          url={videoUrl}
          width="100%"
          height="100%"
          playing={isPlaying}
          controls={true}
          style={{ borderRadius: "0.5rem", overflow: "hidden" }}
          onError={(e) => console.error("ReactPlayer error:", e)}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <>
        <PageTitleBar title="Klaida" />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Klaida</h1>
              <p className="mb-6">{error || "Treniruotė nerasta"}</p>
              <Button onClick={() => router.push("/dashboard")}>
                Grįžti į treniruotes
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const difficultyMap: Record<string, { label: string; level: number }> = {
    easy: { label: "Pradedantiesiems", level: 1 },
    medium: { label: "Pažengusiems", level: 2 },
    hard: { label: "Profesionalams", level: 3 },
  };

  const difficultyInfo = difficultyMap[workout.difficulty] || {
    label: "Vidutinis",
    level: 2,
  };

  return (
    <>
      <PageTitleBar workoutId={workout.id} workoutTitle={workout.name} />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                {renderVideo(
                  workout.videoUrl,
                  workout.imageUrl,
                  workout.name,
                  mainVideoPlaying,
                  toggleMainVideoPlay
                )}

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full z-20"
                >
                  <Heart size={20} className="text-white" />
                </Button>
              </div>

              <div className="mt-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold p-4">Pratimų technika</h2>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedSections.technique
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className={`p-4 ${
                      expandedSections.technique ? "block" : "hidden"
                    }`}
                  >
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-2 font-outfit text-sm text-[#60988E] w-[40%]">
                            Pratimas
                          </th>
                          <th className="text-center pb-2 font-outfit text-sm text-[#60988E] w-[15%]">
                            Serijos
                          </th>
                          <th className="text-center pb-2 font-outfit text-sm text-[#60988E] w-[15%]">
                            Pakartojimai
                          </th>
                          <th className="text-center pb-2 font-outfit text-sm text-[#60988E] w-[15%]">
                            Tempas
                          </th>
                          <th className="text-center pb-2 font-outfit text-sm text-[#60988E] w-[15%]">
                            Poilsis
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {workout.workoutExercises.map(
                          (workoutExercise, index) => (
                            <React.Fragment key={workoutExercise.id}>
                              <tr
                                className="border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() =>
                                  toggleExercise(workoutExercise.id)
                                }
                              >
                                <td className="py-3">
                                  <div className="flex items-center">
                                    <span className="inline-block w-6 text-gray-500">
                                      {workoutExercise.supersetGroup
                                        ? `${workoutExercise.supersetGroup}${
                                            workoutExercise.supersetOrder || ""
                                          }`
                                        : String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="font-medium">
                                      {workoutExercise.exercise.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="text-center py-3">
                                  {workoutExercise.sets || "12"}
                                </td>
                                <td className="text-center py-3">
                                  {workoutExercise.reps || "22"}
                                </td>
                                <td className="text-center py-3">
                                  {workoutExercise.tempo || "2-0 2-0"}
                                </td>
                                <td className="text-center py-3 relative">
                                  {workoutExercise.restTime
                                    ? workoutExercise.restTime >= 60
                                      ? `${Math.round(
                                          workoutExercise.restTime / 60
                                        )} min.`
                                      : `${workoutExercise.restTime}s.`
                                    : "120s"}
                                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2">
                                    <ChevronDown
                                      size={16}
                                      className={`transition-transform duration-300 ${
                                        expandedExercises[workoutExercise.id]
                                          ? "rotate-180"
                                          : "rotate-0"
                                      }`}
                                    />
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={5} className="bg-gray-50 p-0">
                                  <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                      expandedExercises[workoutExercise.id]
                                        ? "max-h-[1000px] opacity-100 p-4"
                                        : "max-h-0 opacity-0 p-0"
                                    }`}
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                                        {renderVideo(
                                          workoutExercise.exercise.videoUrl,
                                          workoutExercise.exercise.imageUrl,
                                          workoutExercise.exercise.name,
                                          exerciseVideoPlaying[
                                            workoutExercise.exercise.id
                                          ] || false,
                                          () =>
                                            toggleExerciseVideoPlay(
                                              workoutExercise.exercise.id
                                            )
                                        )}
                                      </div>

                                      <div>
                                        {workoutExercise.exercise
                                          .instructions &&
                                        Array.isArray(
                                          workoutExercise.exercise.instructions
                                        ) ? (
                                          <div className="space-y-2">
                                            <h4 className="font-medium">
                                              Atlikimo žingsniai:
                                            </h4>
                                            <ol className="list-decimal pl-5 space-y-1 text-sm">
                                              {workoutExercise.exercise.instructions.map(
                                                (
                                                  step: string,
                                                  index: number
                                                ) => (
                                                  <li key={index}>{step}</li>
                                                )
                                              )}
                                            </ol>
                                          </div>
                                        ) : (
                                          <ol className="list-decimal pl-5 space-y-2 text-sm">
                                            <li>
                                              Atsisėskite ant kilimėlio, šiek
                                              tiek sulenkite kelius ir pakeltike
                                              pėdas nuo žemės.
                                            </li>
                                            <li>
                                              Laikykite tiesią nugarą, įtempkite
                                              pilvo raumenis.
                                            </li>
                                            <li>
                                              Rankas laikykite arti kūno arba
                                              priešais save.
                                            </li>
                                            <li>
                                              Sukite liemenį į vieną pusę, tada
                                              – į kitą, išlaikydami pusiausvyrą.
                                            </li>
                                          </ol>
                                        )}

                                        {workoutExercise.notes && (
                                          <div className="mt-3">
                                            <h4 className="font-medium">
                                              Pastabos:
                                            </h4>
                                            <p className="text-sm text-gray-700">
                                              {workoutExercise.notes}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </React.Fragment>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="ext-sm font-bold text-[#60988E] mb-1">Laikas</p>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {workout.duration || 15} min.
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#60988E] mb-1">
                    Intensyvumas
                  </p>
                  <div className="flex items-center">
                    <span className="font-medium">1000 Kcal</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#60988E] mb-1">
                    Sudėtingumas
                  </p>
                  <div className="flex items-center">
                    <span className="font-medium">{difficultyInfo.label}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-800">
                  {workout.description ||
                    "Ši treniruotė yra puikus būdas pradėti sveiką gyvenimo būdą, nes ji nereikalauja specialios įrangos, gali būti atliekama bet kur ir lengvai pritaikoma pagal individualius poreikius bei galimybes."}
                </p>
              </div>

              <div className="border rounded-md mb-4">
                <button
                  className="w-full flex justify-between items-center p-4"
                  onClick={() => toggleSection("benefits")}
                >
                  <h2 className="text-lg font-semibold">Nauda</h2>
                  {expandedSections.benefits ? (
                    <Minus
                      size={20}
                      className="transition-opacity duration-300"
                    />
                  ) : (
                    <Plus
                      size={20}
                      className="transition-opacity duration-300"
                    />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedSections.benefits
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className={`p-4 pt-0 ${
                      expandedSections.benefits ? "block" : "hidden"
                    }`}
                  >
                    <Separator className="mb-4" />
                    <div className="space-y-3 text-gray-700">
                      <p>
                        Treniruotė turi daugybę privalumų: jėgos pratimai
                        stiprina raumenis, kurie kūnui suteikia raumeninio
                        tonuso, kūnas atrodo gražesnis.
                      </p>
                      <p>
                        Pratimus, per kuriuos eina laikas (sekundės), geriau
                        išlaikyti ir atlikti taisyklingai, vengiant staigių
                        trūkčiojimų, gerima stuburo sveikatą, labai aktualu
                        žmonėms, kuriems skauda nugarą, ypač, jei dirba sėdimą
                        darbą.
                      </p>
                      <p>
                        Taip pat ši treniruotė gerina kraujotaką, stimuliuoja
                        medžiagų apykaitą ir padeda deginti kalorijas.
                      </p>
                      <p>
                        Be to, fizinė veikla mažina stresą, gerina nuotaiką,
                        didina energijos lygį ir skatina geresnį miegą, taip pat
                        mažina įvairių ligų riziką ir stiprina imuninę sistemą.
                      </p>
                      <p>
                        Ši treniruotė yra puikus būdas pradėti sveiką gyvenimo
                        būdą, nes ji nereikalauja specialios įrangos, gali būti
                        atliekama bet kur ir lengvai pritaikoma pagal
                        individualius poreikius bei galimybes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-md mb-4">
                <button
                  className="w-full flex justify-between items-center p-4"
                  onClick={() => toggleSection("equipment")}
                >
                  <h2 className="text-lg font-semibold">Įranga</h2>
                  {expandedSections.equipment ? (
                    <Minus
                      size={20}
                      className="transition-opacity duration-300"
                    />
                  ) : (
                    <Plus
                      size={20}
                      className="transition-opacity duration-300"
                    />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedSections.equipment
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className={`p-4 pt-0 ${
                      expandedSections.equipment ? "block" : "hidden"
                    }`}
                  >
                    <Separator className="mb-4" />
                    <div className="space-y-2">
                      {workout.equipment && Array.isArray(workout.equipment) ? (
                        workout.equipment.map((item: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                            <span>{item}</span>
                          </div>
                        ))
                      ) : (
                        <p>Nereikalinga papildoma įranga</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
