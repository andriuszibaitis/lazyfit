"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Check, X, ArrowLeft } from "lucide-react";
import Metadata from "@/app/components/seo/metadata";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    terms: false,
    newsletter: false,
  });

  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState({
    text: "",
    isError: false,
    show: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    match: false,
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm({
      ...registerForm,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "password") {
      checkPasswordRequirements(value, registerForm.passwordConfirm);
    }

    if (name === "passwordConfirm") {
      checkPasswordRequirements(registerForm.password, value);
    }

    if (name === "email") {
      validateEmail(value);
    }
  };

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

  const checkPasswordRequirements = (
    password: string,
    confirmPassword: string
  ) => {
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

    return hasLength && hasUppercase && hasLowercase && hasNumber;
  };

  const handleGoogleLogin = async () => {
    setIsGoogleSubmitting(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google login error:", error);
      showMessage(
        "Įvyko klaida prisijungiant per Google. Bandykite dar kartą.",
        true
      );
      setIsGoogleSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const passwordValid = checkPasswordRequirements(
      registerForm.password,
      registerForm.passwordConfirm
    );
    if (!passwordValid) {
      showMessage("Slaptažodis neatitinka reikalavimų.", true);
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(registerForm.email)) {
      showMessage("Neteisingas el. pašto formatas.", true);
      setIsSubmitting(false);
      return;
    }

    if (!registerForm.terms) {
      showMessage("Turite sutikti su paslaugų teikimo sąlygomis.", true);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post("/api/register", {
        email: registerForm.email,
        name: registerForm.username,
        password: registerForm.password,
      });

      showMessage(
        "Registracija sėkminga! Patikrinkite savo el. paštą patvirtinimui.",
        false
      );

      setTimeout(() => {
        router.push("/auth/prisijungti");
      }, 3000);
    } catch (error: any) {
      console.error("Registration error:", error);
      showMessage(
        error.response?.data ||
          "Įvyko klaida registruojantis. Bandykite dar kartą.",
        true
      );
      setIsSubmitting(false);
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
        title="Registracija"
        description="Užsiregistruokite LazyFit platformoje ir pradėkite savo kelionę link sveikesnio gyvenimo būdo."
        keywords={[
          "registracija",
          "signup",
          "lazyfit",
          "sporto klubas",
          "narystė",
        ]}
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
            aria-label="Registration background"
          ></div>
        </div>

        {}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-white p-8 rounded-lg">
            {}
            <div className="flex gap-2 mb-8 justify-center border border-[#d1d5dc] p-1 rounded-full w-fit mx-auto">
              <Link
                href="/auth/prisijungti"
                id="login-tab"
                className="px-6 py-2 rounded-full text-gray-700 border border-transparent font-medium transition"
              >
                Prisijungti
              </Link>
              <button
                id="register-tab"
                className="px-6 py-2 rounded-full bg-[#60988E] text-white font-medium transition"
              >
                Registracija
              </button>
            </div>

            {}
            <h1 className="text-[#101827] font-['mango'] text-3xl md:text-4xl font-bold text-center mb-6">
              Registracija
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
              id="ajax-register-form"
              className="flex flex-col space-y-6"
              onSubmit={handleRegisterSubmit}
            >
              <div>
                <label
                  htmlFor="user_login_reg"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Vardas<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="user_login_reg"
                  name="username"
                  value={registerForm.username}
                  onChange={handleRegisterChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60988E] bg-white"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="user_email"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  El. paštas<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60988E] bg-white ${
                    emailError ? "border-red-500 bg-red-50" : ""
                  }`}
                  required
                />
                {emailError && (
                  <span
                    id="email-error"
                    className="text-red-500 text-sm mt-1 block"
                  >
                    {emailError}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="user_pass_reg"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Slaptažodis<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? "text" : "password"}
                    id="user_pass_reg"
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60988E] bg-white pr-12"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    id="toggle-password-reg"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                  >
                    {showRegPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="user_pass_confirm"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Pakartokite slaptažodį<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="user_pass_confirm"
                    name="passwordConfirm"
                    value={registerForm.passwordConfirm}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#60988E] bg-white pr-12 ${
                      !passwordRequirements.match &&
                      registerForm.passwordConfirm
                        ? "border-red-500 bg-red-50"
                        : ""
                    }`}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    id="toggle-password-confirm"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {!passwordRequirements.match &&
                  registerForm.passwordConfirm && (
                    <span
                      id="password-match-error"
                      className="text-red-500 text-sm mt-1 block"
                    >
                      Slaptažodžiai nesutampa
                    </span>
                  )}
              </div>

              {}
              <div className="space-y-2 text-sm text-gray-600">
                <div
                  id="req-length"
                  className="password-requirement space-x-2 flex items-center"
                >
                  {passwordRequirements.length ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span>Minimum 8 simboliai</span>
                </div>
                <div
                  id="req-uppercase"
                  className="password-requirement space-x-2 flex items-center"
                >
                  {passwordRequirements.uppercase ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span>Bent 1 didžioji raidė</span>
                </div>
                <div
                  id="req-lowercase"
                  className="password-requirement space-x-2 flex items-center"
                >
                  {passwordRequirements.lowercase ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span>Bent 1 mažoji raidė</span>
                </div>
                <div
                  id="req-number"
                  className="password-requirement space-x-2 flex items-center"
                >
                  {passwordRequirements.number ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span>Skaitmuo</span>
                </div>
                <div
                  id="req-match"
                  className="password-requirement space-x-2 flex items-center"
                >
                  {passwordRequirements.match ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span>Slaptažodžiai sutampa</span>
                </div>
              </div>

              {}
              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={registerForm.terms}
                    onChange={handleRegisterChange}
                    required
                    className="mt-1 h-4 w-4 text-[#60988E] border-gray-300 rounded focus:ring-[#60988E]"
                  />
                  <span className="text-sm text-gray-600">
                    Sutinku su{" "}
                    <Link href="#" className="text-[#60988E] hover:underline">
                      Paslaugų teikimo sąlygomis
                    </Link>{" "}
                    ir
                    <Link href="#" className="text-[#60988E] hover:underline">
                      {" "}
                      Privatumo Politika
                    </Link>
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={registerForm.newsletter}
                    onChange={handleRegisterChange}
                    className="mt-1 h-4 w-4 text-[#60988E] border-gray-300 rounded focus:ring-[#60988E]"
                  />
                  <span className="text-sm text-gray-600">
                    Sutinku gauti Naujienlaiškius
                  </span>
                </label>
              </div>

              <button
                type="submit"
                id="register-btn"
                className="w-full bg-[#60988E] hover:bg-opacity-90 text-white font-semibold rounded-lg px-6 py-3 transition mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registruojama..." : "Registruotis"}
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
                    Registruotis su Google
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
