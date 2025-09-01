"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Check, X } from "lucide-react";
import Metadata from "@/app/components/seo/metadata";
import axios from "axios";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    match: false,
  });

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Trūksta atkūrimo kodo");
    }
  }, [token]);

  useEffect(() => {
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const passwordsMatch = password === confirmPassword && password !== "";

    setPasswordRequirements({
      length: hasLength,
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      number: hasNumber,
      match: passwordsMatch,
    });
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !passwordRequirements.length ||
      !passwordRequirements.uppercase ||
      !passwordRequirements.lowercase ||
      !passwordRequirements.number
    ) {
      setStatus("error");
      setErrorMessage("Slaptažodis neatitinka reikalavimų");
      return;
    }

    if (!passwordRequirements.match) {
      setStatus("error");
      setErrorMessage("Slaptažodžiai nesutampa");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");

    try {
      await axios.post("/api/auth/reset-password", {
        token,
        password,
      });
      setStatus("success");
    } catch (error: any) {
      console.error("Reset password error:", error);
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message || "Įvyko klaida keičiant slaptažodį"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Metadata
        title="Slaptažodžio atkūrimas"
        description="Atkurkite savo slaptažodį LazyFit platformoje"
        keywords={["slaptažodžio atkūrimas", "reset password", "lazyfit"]}
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Slaptažodžio atkūrimas
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Įveskite naują slaptažodį
            </p>
          </div>

          {status === "success" ? (
            <div className="mt-8">
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Slaptažodis pakeistas
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Jūsų slaptažodis buvo sėkmingai pakeistas. Dabar galite
                        prisijungti prie savo paskyros naudodami naują
                        slaptažodį.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/auth/prisijungti"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#60988E] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#60988E]"
                >
                  Prisijungti
                </Link>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {status === "error" && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Klaida
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{errorMessage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Naujas slaptažodis
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#60988E] focus:border-[#60988E] sm:text-sm"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pakartokite slaptažodį
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#60988E] focus:border-[#60988E] sm:text-sm"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="password-requirement space-x-2 flex items-center">
                  {passwordRequirements.length ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span>Minimum 8 simboliai</span>
                </div>
                <div className="password-requirement space-x-2 flex items-center">
                  {passwordRequirements.uppercase ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span>Bent 1 didžioji raidė</span>
                </div>
                <div className="password-requirement space-x-2 flex items-center">
                  {passwordRequirements.lowercase ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span>Bent 1 mažoji raidė</span>
                </div>
                <div className="password-requirement space-x-2 flex items-center">
                  {passwordRequirements.number ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span>Skaitmuo</span>
                </div>
                <div className="password-requirement space-x-2 flex items-center">
                  {passwordRequirements.match ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span>Slaptažodžiai sutampa</span>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !token}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#60988E] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#60988E] disabled:opacity-50"
                >
                  {isSubmitting ? "Keičiama..." : "Pakeisti slaptažodį"}
                </button>
              </div>

              <div className="text-center">
                <Link
                  href="/auth/prisijungti"
                  className="font-medium text-[#60988E] hover:text-opacity-90"
                >
                  Grįžti į prisijungimo puslapį
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
