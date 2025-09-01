"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import Metadata from "@/app/components/seo/metadata";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    isError: false,
    show: false,
  });
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !regex.test(email)) {
      setEmailError("Neteisingas el. pašto formatas");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value) {
      validateEmail(e.target.value);
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setEmailError("El. paštas yra privalomas");
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("/api/auth/forgot-password", { email });

      setIsSubmitting(false);
      setResetSent(true);
      showMessage(
        "Slaptažodžio atkūrimo nuoroda išsiųsta į jūsų el. paštą.",
        false
      );
    } catch (error) {
      console.error("Password reset error:", error);
      showMessage("Įvyko klaida. Bandykite dar kartą.", true);
      setIsSubmitting(false);
    }
  };

  const showMessage = (text: string, isError: boolean) => {
    setMessage({ text, isError, show: true });

    if (isError) {
      setTimeout(() => {
        setMessage((prev) => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#60988E]"></div>
      </div>
    );
  }

  return (
    <>
      <Metadata
        title="Pamiršau slaptažodį"
        description="Atkurkite savo slaptažodį LazyFit platformoje ir vėl pradėkite naudotis visomis paslaugomis."
        keywords={[
          "pamiršau slaptažodį",
          "slaptažodžio atkūrimas",
          "lazyfit",
          "reset password",
        ]}
      />
      <main className="flex flex-col md:flex-row min-h-screen">
        {}
        <div className="w-full h-64 md:w-1/2 md:h-auto md:order-last bg-cover bg-center rounded-b-xl md:rounded-xl md:m-4 relative">
          {}
          <Link
            href="/auth/prisijungti"
            className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-[#101827]" />
            <span className="sr-only">Grįžti į prisijungimo puslapį</span>
          </Link>

          {}
          <Link
            href="/auth/prisijungti"
            className="absolute top-6 right-6 z-10 hidden md:flex items-center justify-center bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <X className="h-5 w-5 text-[#101827]" />
            <span className="sr-only">Uždaryti</span>
          </Link>

          {}
          <div
            className="absolute inset-0 md:rounded-xl rounded-b-xl"
            style={{
              backgroundColor: "#f5f5f5",
              backgroundImage: "url('/images/auth/login.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {}
          <div
            className="absolute inset-0 md:rounded-xl rounded-b-xl bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/auth/login.jpg?v=${Date.now()}')`,
            }}
            aria-label="Forgot password background"
          ></div>
        </div>

        {}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-white p-8 rounded-lg">
            <h1 className="text-[#101827] font-['mango'] text-3xl md:text-4xl font-bold text-center mb-6">
              Pamiršai slaptažodį?
            </h1>

            {}
            {message.show && (
              <div className="mb-6">
                <div
                  className={`p-4 rounded ${
                    message.isError
                      ? "bg-red-100 border border-red-400 text-red-700"
                      : "bg-green-100 border border-green-400 text-green-700"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            )}

            {!resetSent ? (
              <>
                <p className="text-gray-600 mb-6 text-center">
                  Įveskite savo el. pašto adresą ir mes atsiųsime jums nuorodą
                  slaptažodžio atkūrimui.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      El. paštas<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60988E] ${
                        emailError ? "border-red-500 bg-red-50" : ""
                      }`}
                      placeholder="vardas@pavyzdys.lt"
                      required
                    />
                    {emailError && (
                      <p className="mt-1 text-sm text-red-600">{emailError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#60988E] text-white font-['mango'] italic font-bold text-2xl rounded-lg px-6 py-3 hover:bg-opacity-90 transition"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Siunčiama..." : "Atkurti slaptažodį"}
                  </button>

                  <div className="text-center mt-4">
                    <Link
                      href="/auth/prisijungti"
                      className="text-[#60988E] hover:underline font-medium"
                    >
                      Grįžti į prisijungimo puslapį
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <p className="text-gray-600">
                  Patikrinkite savo el. paštą. Jei nurodytas el. paštas
                  egzistuoja mūsų sistemoje, netrukus gausite slaptažodžio
                  atkūrimo nuorodą.
                </p>

                <p className="text-gray-600 text-sm">
                  Negavote laiško? Patikrinkite šlamšto (spam) aplanką arba{" "}
                  <button
                    onClick={() => {
                      setResetSent(false);
                      setMessage({ text: "", isError: false, show: false });
                    }}
                    className="text-[#60988E] hover:underline font-medium"
                  >
                    bandykite dar kartą
                  </button>
                </p>

                <Link
                  href="/auth/prisijungti"
                  className="inline-block bg-[#60988E] text-white font-['mango'] italic font-bold text-xl rounded-lg px-6 py-2 hover:bg-opacity-90 transition mt-4"
                >
                  Grįžti į prisijungimą
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
