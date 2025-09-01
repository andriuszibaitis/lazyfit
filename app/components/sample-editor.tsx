"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface SimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SimpleEditor({ value, onChange }: SimpleEditorProps) {
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange(newValue);
  };

  return (
    <Textarea
      value={content}
      onChange={handleChange}
      className="min-h-[300px] font-mono text-sm"
      placeholder="Įveskite puslapio turinį čia..."
    />
  );
}
