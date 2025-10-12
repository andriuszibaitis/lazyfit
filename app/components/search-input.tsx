"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchInput({
  placeholder = "Placeholder",
  onSearch,
  className = ""
}: SearchInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Optional: trigger search on every keystroke
    // onSearch?.(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#60988E]" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-white border border-[#E6E6E6] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent transition-all duration-200"
        />
      </div>
    </form>
  );
}