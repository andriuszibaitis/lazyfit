"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Video, FileText, ChevronDown, ChevronUp } from "lucide-react";
import {
  ClockIcon,
  DifficultyLevel1Icon,
  DifficultyLevel2Icon,
  DifficultyLevel3Icon,
  HeartIcon,
} from "@/components/icons";
import { usePageTitle } from "@/app/dashboard/contexts/page-title-context";
import { Tag } from "@/components/ui/tag";

interface CourseLesson {
  id: string;
  title: string;
  type: string;
  content: string | null;
  videoUrl: string | null;
  duration: number | null;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  about: string | null;
  targetAudience: string | null;
  whatYouLearn: string | null;
  whatIsIncluded: string | null;
  imageUrl: string | null;
  gender: string;
  difficulty: string;
  lessons: CourseLesson[];
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const { setPageTitle, setShowBackButton, setBackUrl } = usePageTitle();

  useEffect(() => {
    setShowBackButton(true);
    setBackUrl("/dashboard/mokymai");

    return () => {
      setShowBackButton(false);
      setBackUrl(null);
      setPageTitle("");
    };
  }, [setShowBackButton, setBackUrl, setPageTitle]);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`/api/courses/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
          setPageTitle(data.title);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [id, setPageTitle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B7280]">Mokymas nerastas</p>
        <Link
          href="/dashboard/mokymai"
          className="text-brand-green hover:underline mt-2 inline-block"
        >
          Grįžti į mokymus
        </Link>
      </div>
    );
  }

  const totalDuration = course.lessons.reduce(
    (sum, lesson) => sum + (lesson.duration || 0),
    0
  );

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Pradedantiesiems";
      case "intermediate":
        return "Pažengusiems";
      case "advanced":
        return "Profesionalams";
      default:
        return "Pradedantiesiems";
    }
  };

  const DifficultyIcon = ({ difficulty }: { difficulty: string }) => {
    switch (difficulty) {
      case "beginner":
        return <DifficultyLevel1Icon size={16} className="text-[#9FA4B0]" />;
      case "intermediate":
        return <DifficultyLevel2Icon size={16} className="text-[#9FA4B0]" />;
      case "advanced":
        return <DifficultyLevel3Icon size={16} className="text-[#9FA4B0]" />;
      default:
        return <DifficultyLevel1Icon size={16} className="text-[#9FA4B0]" />;
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "female":
        return "Moterims";
      case "male":
        return "Vyrams";
      default:
        return null;
    }
  };

  // Parse JSON arrays
  const whatYouLearnList: string[] = course.whatYouLearn
    ? JSON.parse(course.whatYouLearn)
    : [];
  const whatIsIncludedList: string[] = course.whatIsIncluded
    ? JSON.parse(course.whatIsIncluded)
    : [];

  const genderLabel = getGenderLabel(course.gender);

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  return (
    <div className="font-[Outfit] mt-3">
      {/* Top section with image and info */}
      <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative">
            <Image
              src={
                imageError || !course.imageUrl
                  ? "/placeholder.svg?height=400&width=600"
                  : course.imageUrl
              }
              alt={course.title}
              width={600}
              height={400}
              className="w-full h-[400px] object-cover rounded-2xl"
              onError={() => setImageError(true)}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-end">
            {/* Tags and favorite */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {genderLabel && <Tag>{genderLabel}</Tag>}
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="rounded-full p-2 bg-[#F7F7F7] hover:bg-gray-200 transition-colors"
              >
                <HeartIcon
                  size={18}
                  className={isFavorite ? "text-red-500" : "text-[#9FA4B0]"}
                />
              </button>
            </div>

            {/* Title */}
            <h1
              className="text-[36px] font-semibold text-[#101827] mb-4 leading-[90%]"
              style={{ fontFamily: "mango, sans-serif" }}
            >
              {course.title}
            </h1>

            {/* Description */}
            {course.description && (
              <p className="text-[#6B7280] text-sm mb-6 leading-relaxed">
                {course.description}
              </p>
            )}

            {/* Meta info */}
            <div className="flex items-center gap-6 text-sm text-[#9FA4B0] mb-6">
              <div className="flex items-center gap-1.5">
                <Video size={18} className="text-[#CCCED3]" />
                <span>{course.lessons.length} pamokų</span>
              </div>
              {totalDuration > 0 && (
                <div className="flex items-center gap-1.5">
                  <ClockIcon size={18} className="text-[#CCCED3]" />
                  <span>{totalDuration} min</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <DifficultyIcon difficulty={course.difficulty} />
                <span>{getDifficultyLabel(course.difficulty)}</span>
              </div>
            </div>

            {/* Start course button */}
            <button className="self-start bg-[#60988E] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#34786C] transition-colors">
              Pradėti mokymus
            </button>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - About and Learning Program */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          {course.about && (
            <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
              <h2
                className="text-[30px] font-semibold text-[#101827] mb-4 leading-[90%]"
                style={{ fontFamily: "mango, sans-serif" }}
              >
                Apie mokymus
              </h2>
              <p className="text-[#6B7280] text-sm leading-relaxed whitespace-pre-line">
                {course.about}
              </p>
            </div>
          )}

          {/* Learning Program */}
          <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
            <h2
              className="text-[30px] font-semibold text-[#101827] mb-4 leading-[90%]"
              style={{ fontFamily: "mango, sans-serif" }}
            >
              {course.title} mokymosi programa
            </h2>

            {/* Table header */}
            <div className="grid grid-cols-2 gap-4 py-3 border-b border-[#E6E6E6] text-sm font-medium text-[#9FA4B0]">
              <span>Temos pavadinimas</span>
              <span>Temos prašymas</span>
            </div>

            {/* Lessons */}
            <div className="divide-y divide-[#E6E6E6]">
              {course.lessons.map((lesson, index) => (
                <div key={lesson.id} className="py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-medium text-[#101827]">
                        {index + 1} savaitė:
                      </span>
                      <span className="text-sm text-[#101827]">
                        {lesson.title}
                      </span>
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      {lesson.content && (
                        <ul className="list-disc list-inside space-y-1">
                          {lesson.content.split("\n").filter(Boolean).map((item, i) => (
                            <li key={i}>{item.replace(/^[-•]\s*/, "")}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Target Audience */}
          {course.targetAudience && (
            <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
              <h2
                className="text-[30px] font-semibold text-[#101827] mb-4 leading-[90%]"
                style={{ fontFamily: "mango, sans-serif" }}
              >
                Kam skirta?
              </h2>
              <ul className="space-y-2">
                {course.targetAudience.split("\n").filter(Boolean).map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-[#6B7280]"
                  >
                    <span className="text-[#9FA4B0]">•</span>
                    <span>{item.replace(/^[-•]\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What You'll Learn */}
          {whatYouLearnList.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
              <h2
                className="text-[30px] font-semibold text-[#101827] mb-4 leading-[90%]"
                style={{ fontFamily: "mango, sans-serif" }}
              >
                Ką išmoksi?
              </h2>
              <ul className="space-y-2">
                {whatYouLearnList.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-[#6B7280]"
                  >
                    <span className="text-[#9FA4B0]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What's Included */}
          {whatIsIncludedList.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#EFEFEF] p-6">
              <h2
                className="text-[30px] font-semibold text-[#101827] mb-4 leading-[90%]"
                style={{ fontFamily: "mango, sans-serif" }}
              >
                Kas įtraukta?
              </h2>
              <ul className="space-y-2">
                {whatIsIncludedList.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-[#6B7280]"
                  >
                    <span className="text-[#9FA4B0]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
