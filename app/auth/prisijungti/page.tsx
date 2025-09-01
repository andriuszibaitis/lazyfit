"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, X } from "lucide-react";
import Metadata from "@/app/components/seo/metadata";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const timestamp = useMemo(() => Date.now(), []);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    isError: false,
    show: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  useEffect(() => {
    if (error) {
      showMessage(
        error === "CredentialsSignin"
          ? "Neteisingas el. paštas arba slaptažodis"
          : "Įvyko klaida. Bandykite dar kartą.",
        true
      );
    }
  }, [error]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: loginForm.email,
        password: loginForm.password,
      });

      if (result?.error) {
        if (result.error.includes("patvirtinti savo el. paštą")) {
          showMessage(
            "Prašome patvirtinti savo el. paštą prieš prisijungiant. Patikrinkite savo el. paštą arba gaukite naują patvirtinimo laišką.",
            true
          );

          setTimeout(() => {
            router.push("/auth/resend-verification");
          }, 3000);
        } else {
          showMessage(result.error, true);
        }
        setIsSubmitting(false);
      } else {
        showMessage("Sėkmingai prisijungta! Nukreipiama...", false);
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Login error:", error);
      showMessage("Įvyko klaida. Bandykite dar kartą.", true);
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleSubmitting(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Google login error:", error);
      showMessage(
        "Įvyko klaida prisijungiant per Google. Bandykite dar kartą.",
        true
      );
      setIsGoogleSubmitting(false);
    }
  };

  const showMessage = (text: string, isError: boolean) => {
    setMessage({ text, isError, show: true });

    setTimeout(() => {
      setMessage((prev) => ({ ...prev, show: false }));
    }, 5000);
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
        title="Prisijungimas"
        description="Prisijunkite prie LazyFit platformos ir gaukite prieigą prie visų treniruočių, mitybos planų ir mokymų."
        keywords={["prisijungimas", "login", "lazyfit", "sporto klubas"]}
      />
      <main className="flex flex-col md:flex-row min-h-screen">
        {}
        <div className="w-full h-64 md:w-1/2 md:h-auto md:order-last bg-cover bg-center rounded-b-xl md:rounded-xl md:m-4 relative">
          {}
          <Link
            href="/"
            className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-[#101827]" />
            <span className="sr-only">Grįžti į pagrindinį puslapį</span>
          </Link>

          {}
          <Link
            href="/"
            className="absolute top-6 right-6 z-10 hidden md:flex items-center justify-center bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <X className="h-5 w-5 text-[#101827]" />
            <span className="sr-only">Uždaryti</span>
          </Link>

          {}
          <div
            className="absolute inset-0 md:rounded-xl rounded-b-xl bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/auth/login.jpg?v=${timestamp}')`,
            }}
            aria-label="Login background"
          ></div>
        </div>

        {}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-white p-8 rounded-lg">
            {}
            <div className="flex gap-2 mb-8 justify-center border border-[#d1d5dc] p-1 rounded-full w-fit mx-auto">
              <button
                id="login-tab"
                className="px-6 py-2 rounded-full bg-[#60988E] text-white font-medium transition"
              >
                Prisijungti
              </button>
              <Link
                href="/auth/registracija"
                id="register-tab"
                className="px-6 py-2 rounded-full text-gray-700 border border-transparent font-medium transition"
              >
                Registracija
              </Link>
            </div>

            {}
            <h1 className="text-[#101827] font-['mango'] text-3xl md:text-4xl font-bold text-center mb-6">
              Prisijungti
            </h1>

            {}
            {message.show && (
              <div id="message-container" className="mb-4">
                <div
                  id="message"
                  className={`p-3 rounded ${
                    message.isError
                      ? "bg-red-100 border border-red-400 text-red-700"
                      : "bg-green-100 border border-green-400 text-green-700"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            )}

            <form
              id="ajax-login-form"
              className="flex flex-col space-y-4"
              onSubmit={handleLoginSubmit}
            >
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  El. paštas<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60988E]"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Slaptažodis<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60988E]"
                    required
                  />
                  <span
                    id="toggle-password"
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberme"
                    name="remember"
                    checked={loginForm.remember}
                    onChange={handleLoginChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Prisiminti mane</span>
                </label>
                <Link
                  href="/auth/pamirsau-slaptazodi"
                  className="font-['mango'] font-bold text-xl italic underline text-gray-500 hover:text-[#60988E]"
                >
                  Pamiršai slaptažodį?
                </Link>
              </div>

              <button
                id="login-btn"
                type="submit"
                className="bg-[#60988E] text-white font-['mango'] italic font-bold text-2xl rounded-lg px-6 py-3 transition w-full mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Jungiamasi..." : "Prisijungti"}
              </button>

              {}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">arba</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleSubmitting}
                className="flex items-center justify-center w-full border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                {isGoogleSubmitting ? (
                  "Jungiamasi..."
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Prisijungti su Google
                  </>
                )}
              </button>

              <Link
                href="/auth/registracija"
                id="show-register"
                className="block text-center border-2 border-[#60988E] text-[#60988E] font-['mango'] italic font-bold text-2xl rounded-lg px-6 py-3 hover:bg-[#EFEFEF] transition w-full"
              >
                Tapti nariu
              </Link>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
