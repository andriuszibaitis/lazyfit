"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Metadata from "@/app/components/seo/metadata";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Trūksta patvirtinimo kodo");
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then(async (response) => {
        if (response.redirected) {
          router.push(response.url);
          return;
        }

        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            data.message || "Įvyko klaida patvirtinant el. paštą"
          );
        }

        setStatus("success");
      })
      .catch((error) => {
        console.error("Verification error:", error);
        setStatus("error");
        setErrorMessage(error.message || "Įvyko klaida patvirtinant el. paštą");
      });
  }, [token, router]);

  return (
    <>
      <Metadata
        title="El. pašto patvirtinimas"
        description="Patvirtinkite savo el. paštą LazyFit platformoje"
        keywords={["el. pašto patvirtinimas", "email verification", "lazyfit"]}
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              El. pašto patvirtinimas
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {status === "loading" &&
                "Tikrinamas jūsų el. pašto patvirtinimo kodas..."}
              {status === "success" &&
                "Jūsų el. paštas sėkmingai patvirtintas!"}
              {status === "error" && errorMessage}
            </p>
          </div>

          {status === "loading" && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#60988E]"></div>
            </div>
          )}

          {status === "success" && (
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
                      El. paštas patvirtintas
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Jūsų el. paštas buvo sėkmingai patvirtintas. Dabar
                        galite prisijungti prie savo paskyros.
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
          )}

          {status === "error" && (
            <div className="mt-8">
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
                      Klaida patvirtinant el. paštą
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col space-y-4">
                <Link
                  href="/auth/resend-verification"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#60988E] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#60988E]"
                >
                  Siųsti naują patvirtinimo laišką
                </Link>
                <Link
                  href="/auth/prisijungti"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#60988E]"
                >
                  Grįžti į prisijungimo puslapį
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
