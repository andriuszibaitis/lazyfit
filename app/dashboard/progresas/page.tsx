"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePageTitle } from "@/app/dashboard/contexts/page-title-context";
import Image from "next/image";
import { Calendar, Loader2, X, ChevronDown } from "lucide-react";
import { FrontSilhouetteSvg, SideSilhouetteSvg, BackSilhouetteSvg } from "@/app/dashboard/apzvalga/components/icons/body-silhouette-svg";

interface ProgressPhoto {
  id: string;
  date: string;
  frontUrl: string | null;
  sideUrl: string | null;
  backUrl: string | null;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export default function ProgresasPage() {
  const { setPageTitle, setShowBackButton, setBackUrl } = usePageTitle();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload form state
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

  // Compare modal state
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareBeforeId, setCompareBeforeId] = useState<string | null>(null);
  const [compareAfterId, setCompareAfterId] = useState<string | null>(null);
  const [compareView, setCompareView] = useState<"front" | "side" | "back">("front");
  const [isBeforeDropdownOpen, setIsBeforeDropdownOpen] = useState(false);
  const [isAfterDropdownOpen, setIsAfterDropdownOpen] = useState(false);

  useEffect(() => {
    setPageTitle("Progreso istorija");
    setShowBackButton(true);
    setBackUrl("/dashboard/apzvalga");
  }, [setPageTitle, setShowBackButton, setBackUrl]);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/progress-photos");
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos || []);
      }
    } catch (error) {
      console.error("Error fetching progress photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

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

  const formatDisplayDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
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
      setDate(new Date().toISOString().split("T")[0]);

      // Refresh photos
      fetchPhotos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nepavyko įkelti nuotraukų");
    } finally {
      setIsUploading(false);
    }
  };

  const openCompareModal = (photoId: string) => {
    setCompareBeforeId(photoId);
    // Set "after" to the most recent photo by default
    if (photos.length > 0) {
      setCompareAfterId(photos[0].id);
    }
    setCompareView("front");
    setIsCompareModalOpen(true);
  };

  const getPhotoById = (id: string | null) => {
    return photos.find(p => p.id === id) || null;
  };

  const getPhotoUrl = (photo: ProgressPhoto | null, view: "front" | "side" | "back") => {
    if (!photo) return null;
    if (view === "front") return photo.frontUrl;
    if (view === "side") return photo.sideUrl;
    return photo.backUrl;
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#60988E]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left side - Progress history */}
          <div className="bg-white rounded-2xl p-8 border border-[#E6E6E6]">
            <h1
              className="text-[36px] font-semibold text-[#101827] mb-8"
              style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
            >
              Progreso istorija
            </h1>

            {photos.length === 0 ? (
              <div className="text-center py-12">
                <p
                  className="text-[16px] text-[#555B65]"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Dar neturite įkeltų progreso nuotraukų.
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[10px] top-[22px] bottom-0 w-[1px] bg-[#E6E6E6]" />

                {/* Timeline items */}
                <div className="space-y-6">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative flex items-start gap-4">
                      {/* Timeline dot */}
                      <svg className="relative z-10 flex-shrink-0" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <rect width="21" height="21" rx="10.5" fill="#60988E"/>
                        <circle cx="10.5" cy="10.5" r="4" fill="#EFEFEF"/>
                      </svg>

                      {/* Content */}
                      <div className="flex-1">
                        {/* Container with bg */}
                        <div className="bg-[#EFEFEF] rounded-xl p-4">
                          {/* Date and compare button */}
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className="text-[16px] font-normal text-[#101827] leading-[130%] tracking-[-0.02em]"
                              style={{ fontFamily: "Outfit, sans-serif" }}
                            >
                              {formatDate(photo.date)}
                            </span>
                            <button
                              onClick={() => openCompareModal(photo.id)}
                              className="px-4 py-1.5 bg-[#60988E] text-white text-[12px] font-medium rounded-md hover:bg-[#4d7a72] transition-colors"
                              style={{ fontFamily: "Outfit, sans-serif" }}
                            >
                              Palyginti
                            </button>
                          </div>

                          {/* Photos grid */}
                          <div className="grid grid-cols-3 gap-3">
                            {/* Front photo */}
                            <div className="aspect-[3/4] bg-white rounded-xl overflow-hidden relative">
                              {photo.frontUrl ? (
                                <Image
                                  src={photo.frontUrl}
                                  alt="Priekis"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-[12px] text-[#9FA4B0]">—</span>
                                </div>
                              )}
                            </div>

                            {/* Side photo */}
                            <div className="aspect-[3/4] bg-white rounded-xl overflow-hidden relative">
                              {photo.sideUrl ? (
                                <Image
                                  src={photo.sideUrl}
                                  alt="Šonas"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-[12px] text-[#9FA4B0]">—</span>
                                </div>
                              )}
                            </div>

                            {/* Back photo */}
                            <div className="aspect-[3/4] bg-white rounded-xl overflow-hidden relative">
                              {photo.backUrl ? (
                                <Image
                                  src={photo.backUrl}
                                  alt="Nugara"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-[12px] text-[#9FA4B0]">—</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right side - Upload form */}
          <div className="bg-white rounded-2xl p-6 border border-[#E6E6E6]">
            <h2
              className="text-[36px] font-semibold text-[#101827] mb-4"
              style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
            >
              Nuotraukų įkėlimas
            </h2>

            <p
              className="text-[14px] text-[#555B65] mb-6"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Įkelkite savo nuotraukas iš visų trijų pusių: priekio, šono ir nugaros.
            </p>

            {/* Photo upload boxes */}
            <div className="grid grid-cols-3 gap-3 mb-6">
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
                  className={`border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center h-[160px] transition-colors ${
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
                      <FrontSilhouetteSvg className="w-[40px] h-[90px] mb-2" />
                      <p
                        className="text-[11px] text-[#555B65] text-center"
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
                  className={`border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center h-[160px] transition-colors ${
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
                      <SideSilhouetteSvg className="w-[25px] h-[90px] mb-2" />
                      <p
                        className="text-[11px] text-[#555B65] text-center"
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
                  className={`border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center h-[160px] transition-colors ${
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
                      <BackSilhouetteSvg className="w-[40px] h-[90px] mb-2" />
                      <p
                        className="text-[11px] text-[#555B65] text-center"
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

            {/* Date picker */}
            <div className="mb-4">
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
              className="w-full py-3 bg-[#60988E] rounded-lg text-[14px] font-medium text-white hover:bg-[#4d7a72] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUploading ? "Įkeliama..." : "Išsaugoti"}
            </button>
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsCompareModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[700px] w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="absolute top-6 right-6 text-[#9FA4B0] hover:text-[#101827] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title */}
            <h2
              className="text-[32px] font-semibold text-[#101827] mb-6 text-center"
              style={{ fontFamily: "mango, sans-serif", lineHeight: "90%" }}
            >
              Palyginti
            </h2>

            {/* Photo comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Before */}
              <div>
                <p
                  className="text-[20px] font-semibold text-[#101827] mb-2"
                  style={{ fontFamily: "mango, sans-serif" }}
                >
                  Prieš
                </p>
                <p
                  className="text-[13px] text-[#555B65] mb-2"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Data
                </p>
                {/* Date dropdown */}
                <div className="relative mb-4">
                  <button
                    onClick={() => {
                      setIsBeforeDropdownOpen(!isBeforeDropdownOpen);
                      setIsAfterDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between border border-[#E6E6E6] rounded-lg px-4 py-3 hover:border-[#60988E] transition-colors"
                  >
                    <span
                      className="text-[14px] text-[#101827]"
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      {compareBeforeId ? formatDate(getPhotoById(compareBeforeId)?.date || "") : "Pasirinkti"}
                    </span>
                    <ChevronDown className="w-5 h-5 text-[#9FA4B0]" />
                  </button>
                  {isBeforeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E6E6E6] rounded-lg shadow-lg z-10 max-h-[200px] overflow-y-auto">
                      {photos.map((photo) => (
                        <button
                          key={photo.id}
                          onClick={() => {
                            setCompareBeforeId(photo.id);
                            setIsBeforeDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-[14px] text-[#101827] hover:bg-[#F5F5F5] transition-colors"
                          style={{ fontFamily: "Outfit, sans-serif" }}
                        >
                          {formatDate(photo.date)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Before photo */}
                <div className="aspect-[3/4] bg-[#F5F5F5] rounded-xl overflow-hidden relative">
                  {getPhotoUrl(getPhotoById(compareBeforeId), compareView) ? (
                    <Image
                      src={getPhotoUrl(getPhotoById(compareBeforeId), compareView)!}
                      alt="Prieš"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[14px] text-[#9FA4B0]">Nėra nuotraukos</span>
                    </div>
                  )}
                </div>
              </div>

              {/* After */}
              <div>
                <p
                  className="text-[20px] font-semibold text-[#101827] mb-2"
                  style={{ fontFamily: "mango, sans-serif" }}
                >
                  Po
                </p>
                <p
                  className="text-[13px] text-[#555B65] mb-2"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Data
                </p>
                {/* Date dropdown */}
                <div className="relative mb-4">
                  <button
                    onClick={() => {
                      setIsAfterDropdownOpen(!isAfterDropdownOpen);
                      setIsBeforeDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between border border-[#E6E6E6] rounded-lg px-4 py-3 hover:border-[#60988E] transition-colors"
                  >
                    <span
                      className="text-[14px] text-[#101827]"
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      {compareAfterId ? formatDate(getPhotoById(compareAfterId)?.date || "") : "Pasirinkti"}
                    </span>
                    <ChevronDown className="w-5 h-5 text-[#9FA4B0]" />
                  </button>
                  {isAfterDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E6E6E6] rounded-lg shadow-lg z-10 max-h-[200px] overflow-y-auto">
                      {photos.map((photo) => (
                        <button
                          key={photo.id}
                          onClick={() => {
                            setCompareAfterId(photo.id);
                            setIsAfterDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-[14px] text-[#101827] hover:bg-[#F5F5F5] transition-colors"
                          style={{ fontFamily: "Outfit, sans-serif" }}
                        >
                          {formatDate(photo.date)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* After photo */}
                <div className="aspect-[3/4] bg-[#F5F5F5] rounded-xl overflow-hidden relative">
                  {getPhotoUrl(getPhotoById(compareAfterId), compareView) ? (
                    <Image
                      src={getPhotoUrl(getPhotoById(compareAfterId), compareView)!}
                      alt="Po"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[14px] text-[#9FA4B0]">Nėra nuotraukos</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* View toggle buttons */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCompareView("front")}
                className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${
                  compareView === "front"
                    ? "bg-[#FFF4D6] text-[#101827] border border-[#E6D9A8]"
                    : "bg-white text-[#555B65] border border-[#E6E6E6] hover:border-[#60988E]"
                }`}
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Iš priekio
              </button>
              <button
                onClick={() => setCompareView("side")}
                className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${
                  compareView === "side"
                    ? "bg-[#FFF4D6] text-[#101827] border border-[#E6D9A8]"
                    : "bg-white text-[#555B65] border border-[#E6E6E6] hover:border-[#60988E]"
                }`}
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Iš šono
              </button>
              <button
                onClick={() => setCompareView("back")}
                className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${
                  compareView === "back"
                    ? "bg-[#FFF4D6] text-[#101827] border border-[#E6D9A8]"
                    : "bg-white text-[#555B65] border border-[#E6E6E6] hover:border-[#60988E]"
                }`}
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Iš galo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
