"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Trash2,
  Edit,
  Video,
  FileText,
  GripVertical,
  ArrowLeft,
  X,
} from "lucide-react";
import { Modal, ModalFooter, SuccessModal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { ImageUpload } from "@/components/ui/image-upload";
import Link from "next/link";

interface CourseLesson {
  id: string;
  title: string;
  type: string;
  content: string | null;
  videoUrl: string | null;
  duration: number | null;
  order: number;
  isPublished: boolean;
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
  isPublished: boolean;
  lessons: CourseLesson[];
}

interface CourseFormProps {
  course?: Course;
}

export default function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const isEditing = !!course;

  // Form state
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [about, setAbout] = useState(course?.about || "");
  const [targetAudience, setTargetAudience] = useState(course?.targetAudience || "");
  const [whatYouLearn, setWhatYouLearn] = useState<string[]>(
    course?.whatYouLearn ? JSON.parse(course.whatYouLearn) : [""]
  );
  const [whatIsIncluded, setWhatIsIncluded] = useState<string[]>(
    course?.whatIsIncluded ? JSON.parse(course.whatIsIncluded) : [""]
  );
  const [imageUrl, setImageUrl] = useState(course?.imageUrl || "");
  const [gender, setGender] = useState(course?.gender || "all");
  const [difficulty, setDifficulty] = useState(course?.difficulty || "beginner");
  const [isPublished, setIsPublished] = useState(course?.isPublished || false);
  const [lessons, setLessons] = useState<CourseLesson[]>(course?.lessons || []);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Lesson modal state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<"video" | "text">("video");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");

  // Delete lesson state
  const [showDeleteLesson, setShowDeleteLesson] = useState(false);
  const [deletingLessonIndex, setDeletingLessonIndex] = useState<number | null>(null);

  // What you learn handlers
  const addWhatYouLearnItem = () => {
    setWhatYouLearn([...whatYouLearn, ""]);
  };

  const updateWhatYouLearnItem = (index: number, value: string) => {
    const updated = [...whatYouLearn];
    updated[index] = value;
    setWhatYouLearn(updated);
  };

  const removeWhatYouLearnItem = (index: number) => {
    if (whatYouLearn.length > 1) {
      setWhatYouLearn(whatYouLearn.filter((_, i) => i !== index));
    }
  };

  // What is included handlers
  const addWhatIsIncludedItem = () => {
    setWhatIsIncluded([...whatIsIncluded, ""]);
  };

  const updateWhatIsIncludedItem = (index: number, value: string) => {
    const updated = [...whatIsIncluded];
    updated[index] = value;
    setWhatIsIncluded(updated);
  };

  const removeWhatIsIncludedItem = (index: number) => {
    if (whatIsIncluded.length > 1) {
      setWhatIsIncluded(whatIsIncluded.filter((_, i) => i !== index));
    }
  };

  // Lesson handlers
  const handleAddLesson = () => {
    setEditingLesson(null);
    setEditingLessonIndex(null);
    setLessonTitle("");
    setLessonType("video");
    setLessonContent("");
    setLessonVideoUrl("");
    setLessonDuration("");
    setShowLessonModal(true);
  };

  const handleEditLesson = (lesson: CourseLesson, index: number) => {
    setEditingLesson(lesson);
    setEditingLessonIndex(index);
    setLessonTitle(lesson.title);
    setLessonType(lesson.type as "video" | "text");
    setLessonContent(lesson.content || "");
    setLessonVideoUrl(lesson.videoUrl || "");
    setLessonDuration(lesson.duration?.toString() || "");
    setShowLessonModal(true);
  };

  const handleSaveLesson = () => {
    if (!lessonTitle.trim()) return;

    const newLesson: CourseLesson = {
      id: editingLesson?.id || `temp-${Date.now()}`,
      title: lessonTitle.trim(),
      type: lessonType,
      content: lessonType === "text" ? lessonContent.trim() : null,
      videoUrl: lessonType === "video" ? lessonVideoUrl.trim() : null,
      duration: lessonDuration ? parseInt(lessonDuration) : null,
      order: editingLessonIndex !== null ? editingLessonIndex : lessons.length,
      isPublished: true,
    };

    if (editingLessonIndex !== null) {
      const updated = [...lessons];
      updated[editingLessonIndex] = newLesson;
      setLessons(updated);
    } else {
      setLessons([...lessons, newLesson]);
    }

    setShowLessonModal(false);
  };

  const handleDeleteLesson = () => {
    if (deletingLessonIndex === null) return;
    setLessons(lessons.filter((_, i) => i !== deletingLessonIndex));
    setShowDeleteLesson(false);
    setDeletingLessonIndex(null);
  };

  // Save course
  const handleSave = async () => {
    if (!title.trim()) return;

    setIsSaving(true);
    try {
      // Filter out empty items
      const filteredWhatYouLearn = whatYouLearn.filter((item) => item.trim());
      const filteredWhatIsIncluded = whatIsIncluded.filter((item) => item.trim());

      const courseData = {
        title: title.trim(),
        description: description.trim() || null,
        about: about.trim() || null,
        targetAudience: targetAudience.trim() || null,
        whatYouLearn: filteredWhatYouLearn.length > 0 ? JSON.stringify(filteredWhatYouLearn) : null,
        whatIsIncluded: filteredWhatIsIncluded.length > 0 ? JSON.stringify(filteredWhatIsIncluded) : null,
        imageUrl: imageUrl.trim() || null,
        gender,
        difficulty,
        isPublished,
      };

      let courseId = course?.id;

      if (isEditing) {
        // Update course
        const response = await fetch(`/api/admin/courses/${course.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        });

        if (!response.ok) throw new Error("Failed to update course");
      } else {
        // Create course
        const response = await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseData),
        });

        if (!response.ok) throw new Error("Failed to create course");
        const newCourse = await response.json();
        courseId = newCourse.id;
      }

      // Handle lessons
      if (courseId) {
        // For existing courses, we need to handle lesson updates
        if (isEditing) {
          // Delete removed lessons
          const existingLessonIds = course.lessons.map((l) => l.id);
          const currentLessonIds = lessons.filter((l) => !l.id.startsWith("temp-")).map((l) => l.id);
          const deletedLessonIds = existingLessonIds.filter((id) => !currentLessonIds.includes(id));

          for (const lessonId of deletedLessonIds) {
            await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}`, {
              method: "DELETE",
            });
          }

          // Update or create lessons
          for (let i = 0; i < lessons.length; i++) {
            const lesson = lessons[i];
            const lessonData = {
              title: lesson.title,
              type: lesson.type,
              content: lesson.content,
              videoUrl: lesson.videoUrl,
              duration: lesson.duration,
              order: i,
            };

            if (lesson.id.startsWith("temp-")) {
              // Create new lesson
              await fetch(`/api/admin/courses/${courseId}/lessons`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lessonData),
              });
            } else {
              // Update existing lesson
              await fetch(`/api/admin/courses/${courseId}/lessons/${lesson.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lessonData),
              });
            }
          }
        } else {
          // Create all lessons for new course
          for (let i = 0; i < lessons.length; i++) {
            const lesson = lessons[i];
            await fetch(`/api/admin/courses/${courseId}/lessons`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: lesson.title,
                type: lesson.type,
                content: lesson.content,
                videoUrl: lesson.videoUrl,
                duration: lesson.duration,
                order: i,
              }),
            });
          }
        }
      }

      setSuccessMessage(
        isEditing
          ? `Kursas "${title}" sėkmingai atnaujintas!`
          : `Kursas "${title}" sėkmingai sukurtas!`
      );
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving course:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Back button */}
      <Link
        href="/admin/turinys/mokymai"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Grįžti į sąrašą
      </Link>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
            Pagrindinė informacija
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pavadinimas *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Įveskite kurso pavadinimą"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trumpas aprašymas
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Trumpas kurso aprašymas..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nuotrauka
            </label>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              folder="courses"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lytis
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setGender("all")}
                className={`flex-1 py-2.5 px-4 rounded-lg border-2 transition-colors text-sm font-medium ${
                  gender === "all"
                    ? "border-[#60988E] bg-[#60988E]/10 text-[#60988E]"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                Visiems
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`flex-1 py-2.5 px-4 rounded-lg border-2 transition-colors text-sm font-medium ${
                  gender === "female"
                    ? "border-[#60988E] bg-[#60988E]/10 text-[#60988E]"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                Moterims
              </button>
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`flex-1 py-2.5 px-4 rounded-lg border-2 transition-colors text-sm font-medium ${
                  gender === "male"
                    ? "border-[#60988E] bg-[#60988E]/10 text-[#60988E]"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                Vyrams
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sudėtingumo lygis
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDifficulty("beginner")}
                className={`flex-1 py-2.5 px-4 rounded-lg border-2 transition-colors text-sm font-medium ${
                  difficulty === "beginner"
                    ? "border-[#60988E] bg-[#60988E]/10 text-[#60988E]"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                Pradedantiesiems
              </button>
              <button
                type="button"
                onClick={() => setDifficulty("intermediate")}
                className={`flex-1 py-2.5 px-4 rounded-lg border-2 transition-colors text-sm font-medium ${
                  difficulty === "intermediate"
                    ? "border-[#60988E] bg-[#60988E]/10 text-[#60988E]"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                Pažengusiems
              </button>
              <button
                type="button"
                onClick={() => setDifficulty("advanced")}
                className={`flex-1 py-2.5 px-4 rounded-lg border-2 transition-colors text-sm font-medium ${
                  difficulty === "advanced"
                    ? "border-[#60988E] bg-[#60988E]/10 text-[#60988E]"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                Profesionalams
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
            Apie mokymus
          </h2>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Detalus aprašymas apie šiuos mokymus..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent"
          />
        </div>

        {/* Target Audience */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
            Kam skirta
          </h2>
          <textarea
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="Kam skirti šie mokymai..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent"
          />
        </div>

        {/* What You Learn */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
            Ką išmoksi
          </h2>
          <div className="space-y-3">
            {whatYouLearn.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateWhatYouLearnItem(index, e.target.value)}
                  placeholder={`Punktas ${index + 1}`}
                  className="flex-1"
                />
                {whatYouLearn.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWhatYouLearnItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addWhatYouLearnItem}
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Pridėti punktą
            </Button>
          </div>
        </div>

        {/* What Is Included */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
            Kas įtraukta
          </h2>
          <div className="space-y-3">
            {whatIsIncluded.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateWhatIsIncludedItem(index, e.target.value)}
                  placeholder={`Punktas ${index + 1}`}
                  className="flex-1"
                />
                {whatIsIncluded.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWhatIsIncludedItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addWhatIsIncludedItem}
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Pridėti punktą
            </Button>
          </div>
        </div>

        {/* Lessons (Mokymosi programa) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Mokymosi programa
            </h2>
            <Button variant="outline" size="sm" onClick={handleAddLesson}>
              <PlusCircle className="w-4 h-4 mr-1" />
              Pridėti pamoką
            </Button>
          </div>

          {lessons.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 mb-3">Pamokų dar nėra</p>
              <Button variant="outline" size="sm" onClick={handleAddLesson}>
                <PlusCircle className="w-4 h-4 mr-1" />
                Pridėti pirmą pamoką
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                  <div className="flex items-center gap-2 flex-1">
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
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditLesson(lesson, index)}
                      className="p-1.5 hover:bg-gray-200 rounded text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingLessonIndex(index);
                        setShowDeleteLesson(true);
                      }}
                      className="p-1.5 hover:bg-red-100 rounded text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Publish Status */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
            Publikavimas
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-[#60988E] focus:ring-[#60988E]"
            />
            <span className="text-gray-700">
              Publikuoti kursą (bus matomas vartotojams)
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Link href="/admin/turinys/mokymai">
            <Button variant="outline">Atšaukti</Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || isSaving}
          >
            {isSaving ? "Saugoma..." : isEditing ? "Atnaujinti" : "Sukurti"}
          </Button>
        </div>
      </div>

      {/* Lesson Modal */}
      <Modal
        isOpen={showLessonModal}
        onClose={() => setShowLessonModal(false)}
        title={editingLesson ? "Redaguoti pamoką" : "Nauja pamoka"}
        footer={
          <ModalFooter
            onCancel={() => setShowLessonModal(false)}
            onConfirm={handleSaveLesson}
            cancelText="Atšaukti"
            confirmText="Išsaugoti"
            confirmDisabled={!lessonTitle.trim()}
          />
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[14px] text-[#6B7280] mb-2">
              Pavadinimas *
            </label>
            <Input
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Įveskite pamokos pavadinimą"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[14px] text-[#6B7280] mb-2">
              Tipas *
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setLessonType("video")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-colors ${
                  lessonType === "video"
                    ? "border-[#60988E] bg-[#60988E]/10 text-[#60988E]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Video className="w-5 h-5" />
                <span className="font-medium">Video</span>
              </button>
              <button
                type="button"
                onClick={() => setLessonType("text")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-colors ${
                  lessonType === "text"
                    ? "border-[#60988E] bg-[#60988E]/10 text-[#60988E]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Skaitinys</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[14px] text-[#6B7280] mb-2">
              Trukmė (minutėmis)
            </label>
            <Input
              type="number"
              value={lessonDuration}
              onChange={(e) => setLessonDuration(e.target.value)}
              placeholder="pvz. 11"
              min="1"
            />
          </div>

          {lessonType === "video" ? (
            <div>
              <label className="block text-[14px] text-[#6B7280] mb-2">
                Video URL
              </label>
              <Input
                value={lessonVideoUrl}
                onChange={(e) => setLessonVideoUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-[14px] text-[#6B7280] mb-2">
                Turinys
              </label>
              <textarea
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                placeholder="Įveskite pamokos turinį..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none h-40 focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent"
              />
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Lesson Confirmation */}
      <ConfirmModal
        isOpen={showDeleteLesson}
        onClose={() => {
          setShowDeleteLesson(false);
          setDeletingLessonIndex(null);
        }}
        onConfirm={handleDeleteLesson}
        title="Ištrinti pamoką"
        description="Ar tikrai norite ištrinti šią pamoką?"
        confirmText="Ištrinti"
        cancelText="Atšaukti"
        variant="danger"
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.push("/admin/turinys/mokymai");
        }}
        title={successMessage}
        buttonText="Grįžti į sąrašą"
        onButtonClick={() => {
          setShowSuccess(false);
          router.push("/admin/turinys/mokymai");
        }}
      />
    </div>
  );
}
