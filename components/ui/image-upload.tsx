"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  folder?: string;
}

export function ImageUpload({ value, onChange, disabled, folder = "uploads" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState(value || "");

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null);
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Upload failed");
        }

        const data = await response.json();
        onChange(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, folder]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInputValue("");
  };

  const handleUrlSubmit = () => {
    if (urlInputValue.trim()) {
      onChange(urlInputValue.trim());
      setShowUrlInput(false);
    }
  };

  if (value) {
    return (
      <div className="relative">
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 truncate">{value}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${isDragging ? "border-[#34786C] bg-[#34786C]/5" : "border-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-400"}
        `}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center text-center">
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-[#34786C] animate-spin mb-2" />
              <p className="text-sm text-gray-600">Įkeliama...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Vilkite nuotrauką čia arba paspauskite
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, WebP, GIF (maks. 5MB)
              </p>
            </>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">arba</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleUrlSubmit}
            disabled={disabled || !urlInputValue.trim()}
          >
            Pridėti
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowUrlInput(false)}
          >
            Atšaukti
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowUrlInput(true)}
          disabled={disabled}
          className="w-full"
        >
          Įvesti URL adresą
        </Button>
      )}
    </div>
  );
}
