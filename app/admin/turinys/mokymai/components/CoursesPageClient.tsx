"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Trash2, Edit, ChevronDown, ChevronUp, Video, FileText } from "lucide-react";
import { SuccessModal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface CourseLesson {
  id: string;
  title: string;
  type: "video" | "text";
  duration: number | null;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  order: number;
  lessons: CourseLesson[];
}

export default function CoursesPageClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Delete state
  const [showDeleteCourse, setShowDeleteCourse] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  // Success modal state
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Expanded courses
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/admin/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;

    try {
      const response = await fetch(`/api/admin/courses/${deletingCourse.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCourses();
        setShowDeleteCourse(false);
        setSuccessMessage(`Kursas "${deletingCourse.title}" sėkmingai ištrintas!`);
        setDeletingCourse(null);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const toggleCourseExpanded = (courseId: string) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total duration for a course
  const getTotalDuration = (lessons: CourseLesson[]) => {
    return lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#60988E]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mokymai</h1>
        <Link href="/admin/turinys/mokymai/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Naujas kursas
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Ieškoti pagal pavadinimą..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">
            {searchQuery ? "Kursų nerasta" : "Kursų dar nėra"}
          </p>
          {!searchQuery && (
            <Link href="/admin/turinys/mokymai/new">
              <Button className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Sukurti pirmą kursą
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
            >
              {/* Course Header */}
              <div className="p-4 flex items-center justify-between bg-gray-50 border-b">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleCourseExpanded(course.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {expandedCourses.has(course.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {course.lessons.length} pamokų • {getTotalDuration(course.lessons)} min •
                      {course.isPublished ? (
                        <span className="text-green-600 ml-1">Publikuota</span>
                      ) : (
                        <span className="text-yellow-600 ml-1">Juodraštis</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/turinys/mokymai/${course.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Redaguoti
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeletingCourse(course);
                      setShowDeleteCourse(true);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Course Lessons Preview */}
              {expandedCourses.has(course.id) && (
                <div className="p-4">
                  {course.lessons.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <p>Pamokų dar nėra</p>
                      <Link href={`/admin/turinys/mokymai/${course.id}/edit`}>
                        <Button variant="outline" size="sm" className="mt-2">
                          <PlusCircle className="mr-1 h-4 w-4" />
                          Pridėti pamoką
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 mb-3">
                        Kurso turinys
                      </div>
                      {course.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          {lesson.type === "video" ? (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                              <Video className="w-4 h-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                                {lesson.type === "video" ? "Video" : "Skaitinys"}
                              </span>
                              <span className="font-medium text-gray-900">
                                {lesson.title}
                              </span>
                            </div>
                            {lesson.duration && (
                              <span className="text-xs text-gray-500">
                                {lesson.duration} min
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Course Confirmation */}
      <ConfirmModal
        isOpen={showDeleteCourse}
        onClose={() => {
          setShowDeleteCourse(false);
          setDeletingCourse(null);
        }}
        onConfirm={handleDeleteCourse}
        title="Ištrinti kursą"
        description={`Ar tikrai norite ištrinti kursą "${deletingCourse?.title}"? Visos pamokos taip pat bus ištrintos.`}
        confirmText="Ištrinti"
        cancelText="Atšaukti"
        variant="danger"
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={successMessage}
        buttonText="Gerai"
        onButtonClick={() => setShowSuccess(false)}
        variant="delete"
      />
    </div>
  );
}
