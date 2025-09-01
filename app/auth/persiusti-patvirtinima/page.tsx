"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Metadata from "@/app/components/seo/metadata";
import axios from "axios";

export default function ResendVerificationPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setErrorMessage("El. paštas yra privalomas");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");

    try {
      await axios.post("/api/auth/resend-verification", { email });
      setStatus("success");
    } catch (error: any) {
      console.error("Resend verification error:", error);
      setStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
          "Įvyko klaida siunčiant patvirtinimo laišką"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Metadata
        title="Pakartotinis patvirtinimo laiško siuntimas"
        description="Gaukite naują el. pašto patvirtinimo laišką LazyFit platformoje"
        keywords={["el. pašto patvirtinimas", "email verification", "lazyfit"]}
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Pakartotinis patvirtinimo laiško siuntimas
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Įveskite savo el. paštą, kad gautumėte naują patvirtinimo laišką
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
                      Patvirtinimo laiškas išsiųstas
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Jei nurodytas el. paštas egzistuoja mūsų sistemoje,
                        netrukus gausite naują patvirtinimo laišką. Patikrinkite
                        savo el. paštą ir sekite instrukcijas.
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
                  Grįžti į prisijungimo puslapį
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
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  El. paštas
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#60988E] focus:border-[#60988E] sm:text-sm"
                    placeholder="vardas@pavyzdys.lt"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#60988E] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#60988E] disabled:opacity-50"
                >
                  {isSubmitting ? "Siunčiama..." : "Siųsti patvirtinimo laišką"}
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
