"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "./button";

interface PasswordSectionProps {
  onPasswordChange?: (currentPassword: string, newPassword: string) => Promise<boolean>;
  loading?: boolean;
  isOAuthUser?: boolean;
  className?: string;
}

export default function PasswordSection({
  onPasswordChange,
  loading = false,
  isOAuthUser = false,
  className = ""
}: PasswordSectionProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // For OAuth users, don't require current password
    if (!isOAuthUser && !currentPassword) {
      setError("Esamas slaptažodis yra privalomas");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Naujas slaptažodis ir patvirtinimas yra privalomi");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Naujas slaptažodis ir jo patvirtinimas nesutampa");
      return;
    }

    if (newPassword.length < 8) {
      setError("Naujas slaptažodis turi būti bent 8 simbolių");
      return;
    }

    const success = await onPasswordChange?.(isOAuthUser ? "" : currentPassword, newPassword);

    if (success) {
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const PasswordInput = ({
    label,
    value,
    onChange,
    placeholder,
    showPassword,
    onToggleShow,
    required = false
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    showPassword: boolean;
    onToggleShow: () => void;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#60988E] focus:border-transparent"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 font-outfit ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Pakeisti slaptažodį
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isOAuthUser && (
          <PasswordInput
            label="Esamas slaptažodis"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Įveskite esamą slaptažodį"
            showPassword={showCurrentPassword}
            onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
            required
          />
        )}

        <PasswordInput
          label="Naujas slaptažodis"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="Įveskite naują slaptažodį"
          showPassword={showNewPassword}
          onToggleShow={() => setShowNewPassword(!showNewPassword)}
          required
        />

        <PasswordInput
          label="Pakartokite slaptažodį"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Pakartokite naują slaptažodį"
          showPassword={showConfirmPassword}
          onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
          required
        />

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            size="lg"
          >
            {loading ? "Keičiamas slaptažodis..." : "Pakeisti slaptažodį"}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-sm text-gray-500">
        <p className="mb-1">Slaptažodžio reikalavimai:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Bent 8 simboliai</li>
          <li>Rekomenduojama naudoti didžiąsias ir mažąsias raides</li>
          <li>Rekomenduojama naudoti skaičius ir specialius simbolius</li>
        </ul>
      </div>
    </div>
  );
}