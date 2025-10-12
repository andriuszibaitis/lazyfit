"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import Button from "./button";

interface ProfileAvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  userName?: string;
  onImageChange?: (file: File) => void;
  onImageRemove?: () => void;
  loading?: boolean;
  showUpload?: boolean;
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "VR";
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function ProfileAvatar({
  src,
  alt = "Profile",
  size = "lg",
  userName,
  onImageChange,
  onImageRemove,
  loading = false,
  showUpload = true
}: ProfileAvatarProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange?.(file);
    }
  };

  const displayImage = previewImage || src;

  return (
    <div className="flex flex-col items-center space-y-6 font-outfit">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 text-center">
        Profilio nuotrauka
      </h3>

      {/* Avatar */}
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-[#60988E] flex items-center justify-center border-0`}>
        {displayImage ? (
          <img
            src={displayImage}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-semibold text-xl">
            {getInitials(userName)}
          </span>
        )}
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="text-center space-y-3">
          <label className={loading ? "cursor-not-allowed" : "cursor-pointer"}>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Įkeliama..." : "Įkelti kitą nuotrauką"}
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
          </label>

          {displayImage && (
            <Button
              variant="ghost-green"
              size="sm"
              disabled={loading}
              onClick={onImageRemove}
            >
              {loading ? "Šalinama..." : "Pašalinti nuotrauką"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}