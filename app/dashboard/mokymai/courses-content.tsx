"use client";

import CourseCard from "./course-card";

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  gender: string;
  difficulty: string;
  lessonCount: number;
  totalDuration: number;
}

interface CoursesContentProps {
  courses: Course[];
  activeTab: string;
}

export default function CoursesContent({
  courses,
  activeTab,
}: CoursesContentProps) {
  // Filter courses based on tab
  const filteredCourses = courses.filter((course) => {
    if (activeTab === "all") return true;
    if (activeTab === "men") return course.gender === "male" || course.gender === "all";
    if (activeTab === "women") return course.gender === "female" || course.gender === "all";
    return true;
  });

  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-muted-foreground">Nėra prieinamų mokymų</p>
            <p className="text-sm text-gray-500 mt-2">
              Patikrinkite, ar turite aktyvią narystę arba ar yra sukurtų
              mokymų.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
