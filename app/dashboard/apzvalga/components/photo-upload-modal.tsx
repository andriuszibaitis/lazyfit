"use client";

import { useState, useCallback, useRef } from "react";
import { X, Calendar, Loader2 } from "lucide-react";
import { FrontSilhouetteSvg, SideSilhouetteSvg, BackSilhouetteSvg } from "./icons/body-silhouette-svg";

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: { front?: File; side?: File; back?: File; date: string }) => void;
  onSuccess?: () => void;
}

export default function PhotoUploadModal({ isOpen, onClose, onSave, onSuccess }: PhotoUploadModalProps) {
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [sidePhoto, setSidePhoto] = useState<File | null>(null);
  const [backPhoto, setBackPhoto] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [sidePreview, setSidePreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<"front" | "side" | "back" | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const processFile = useCallback((file: File, type: "front" | "side" | "back") => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      if (type === "front") {
        setFrontPhoto(file);
        setFrontPreview(preview);
      } else if (type === "side") {
        setSidePhoto(file);
        setSidePreview(preview);
      } else {
        setBackPhoto(file);
        setBackPreview(preview);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "side" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, type);
    }
  };

  const handleDragOver = (e: React.DragEvent, type: "front" | "side" | "back") => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, type: "front" | "side" | "back") => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file, type);
    }
  };

  const handleSave = async () => {
    if (!frontPhoto && !sidePhoto && !backPhoto) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("date", date);
      if (frontPhoto) formData.append("front", frontPhoto);
      if (sidePhoto) formData.append("side", sidePhoto);
      if (backPhoto) formData.append("back", backPhoto);

      const response = await fetch("/api/progress-photos", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Nepavyko įkelti nuotraukų");
      }

      // Reset state
      setFrontPhoto(null);
      setSidePhoto(null);
      setBackPhoto(null);
      setFrontPreview(null);
      setSidePreview(null);
      setBackPreview(null);

      // Call callbacks
      if (onSave) {
        onSave({
          front: frontPhoto || undefined,
          side: sidePhoto || undefined,
          back: backPhoto || undefined,
          date,
        });
      }
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nepavyko įkelti nuotraukų");
    } finally {
      setIsUploading(false);
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-[700px] w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#9FA4B0] hover:text-[#101827] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2
          className="text-[32px] font-semibold text-[#101827] mb-4"
          style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
        >
          Nuotraukų įkėlimas
        </h2>

        {/* Description */}
        <p
          className="text-[14px] text-[#555B65] mb-6"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          Įkelkite savo nuotraukas iš visų trijų pusių: priekio, šono ir nugaros.
        </p>

        {/* Photo upload boxes */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Front photo */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "front")}
              className="hidden"
            />
            <div
              onDragOver={(e) => handleDragOver(e, "front")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "front")}
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center h-[200px] transition-colors ${
                dragOver === "front"
                  ? "border-[#60988E] bg-[#60988E]/5"
                  : "border-[#E6E6E6] hover:border-[#60988E]"
              }`}
            >
              {frontPreview ? (
                <img
                  src={frontPreview}
                  alt="Priekis"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <FrontSilhouetteSvg className="w-[52px] h-[120px] mb-4" />
                  <p
                    className="text-[13px] text-[#555B65] text-center"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    Įkelti nuotrauką
                    <br />
                    iš priekio
                  </p>
                </>
              )}
            </div>
          </label>

          {/* Side photo */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "side")}
              className="hidden"
            />
            <div
              onDragOver={(e) => handleDragOver(e, "side")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "side")}
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center h-[200px] transition-colors ${
                dragOver === "side"
                  ? "border-[#60988E] bg-[#60988E]/5"
                  : "border-[#E6E6E6] hover:border-[#60988E]"
              }`}
            >
              {sidePreview ? (
                <img
                  src={sidePreview}
                  alt="Šonas"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <SideSilhouetteSvg className="w-[33px] h-[120px] mb-4" />
                  <p
                    className="text-[13px] text-[#555B65] text-center"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    Įkelti nuotrauką
                    <br />
                    iš šono
                  </p>
                </>
              )}
            </div>
          </label>

          {/* Back photo */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "back")}
              className="hidden"
            />
            <div
              onDragOver={(e) => handleDragOver(e, "back")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "back")}
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center h-[200px] transition-colors ${
                dragOver === "back"
                  ? "border-[#60988E] bg-[#60988E]/5"
                  : "border-[#E6E6E6] hover:border-[#60988E]"
              }`}
            >
              {backPreview ? (
                <img
                  src={backPreview}
                  alt="Nugara"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <BackSilhouetteSvg className="w-[52px] h-[120px] mb-4" />
                  <p
                    className="text-[13px] text-[#555B65] text-center"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    Įkelti nuotrauką
                    <br />
                    iš galo
                  </p>
                </>
              )}
            </div>
          </label>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[14px] text-red-600"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {error}
          </div>
        )}

        {/* Date and Save button row */}
        <div className="flex items-end gap-4">
          {/* Date picker */}
          <div className="flex-1">
            <p
              className="text-[13px] text-[#555B65] mb-2"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Data
            </p>
            <div
              onClick={() => dateInputRef.current?.showPicker()}
              className="relative flex items-center border border-[#E6E6E6] rounded-lg px-4 py-3 w-full cursor-pointer hover:border-[#60988E] transition-colors"
            >
              <Calendar className="w-5 h-5 text-[#9FA4B0] mr-3" />
              <span
                className="text-[14px] text-[#101827] flex-1"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {formatDisplayDate(date)}
              </span>
              <input
                ref={dateInputRef}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="sr-only"
              />
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={isUploading || (!frontPhoto && !sidePhoto && !backPhoto)}
            className="px-10 py-3 bg-[#60988E] rounded-lg text-[14px] font-medium text-white hover:bg-[#4d7a72] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUploading ? "Įkeliama..." : "Išsaugoti"}
          </button>
        </div>
      </div>
    </div>
  );
}
