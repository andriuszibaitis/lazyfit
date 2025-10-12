"use client";

import { useState } from "react";
import Button from "./button";

interface FormFieldProps {
  label: string;
  value: string;
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  disabled?: boolean;
  onSave?: (value: string) => void;
  showEditButton?: boolean;
  additionalContent?: React.ReactNode;
  className?: string;
}

export default function FormField({
  label,
  value,
  type = "text",
  placeholder,
  disabled = false,
  onSave,
  showEditButton = true,
  additionalContent,
  className = ""
}: FormFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || "");

  const handleEdit = () => {
    setCurrentValue(value || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(currentValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(value || "");
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className={`border border-gray-200 rounded-lg p-3 font-outfit ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {showEditButton && !isEditing && (
          <Button
            onClick={handleEdit}
            disabled={disabled}
            variant="outline"
            size="md"
          >
            Redaguoti
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center space-x-4">
          <input
            type={type}
            value={currentValue}
            onChange={(e) => {
              console.log("Input change:", e.target.value);
              setCurrentValue(e.target.value);
            }}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent"
            autoFocus
          />
          <Button
            onClick={handleCancel}
            variant="secondary"
            size="md"
          >
            Atšaukti
          </Button>
          <Button
            onClick={handleSave}
            variant="primary"
            size="md"
          >
            Išsaugoti
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-gray-900 break-words">
            {value || <span className="text-gray-400">Nėra duomenų</span>}
          </p>
          {additionalContent && (
            <div className="mt-2">{additionalContent}</div>
          )}
        </div>
      )}
    </div>
  );
}