"use client";
import { useState } from "react";
import { useTypingEffect } from "../utils/typing-text";

export default function HeroSection() {
  const [mode] = useState<"starter" | "default">("default");
  const typingText = useTypingEffect();

  return (
    <>
      <h1 className="font-['mango'] text-[70px] mb-[8px] md:mb-[-50px] lg:mb-[-70px] sm:text-[100px] md:text-[130px] lg:text-[200px] mt-[-10px] mb-[-40px] font-bold text-center mx-auto max-w-5xl">
        <span id="typing-text" className="text-[#101827]">
          {typingText}
        </span>
      </h1>
      <div className="relative">
        <header
          className="relative bg-cover bg-center h-[600px] flex flex-col justify-between text-white"
          style={{ backgroundImage: "url('/images/header.png')" }}
        >
          <div className="absolute inset-0 bg-black opacity-30"></div>

          {}
          <div className="z-10 container mt-5 mx-auto flex flex-col justify-between h-full px-4">
            {}
            {mode === "starter" ? (
              <div className="text-center mt-8">
                <p className="text-[32px] md:text-[40px] font-['mango'] italic drop-shadow-lg max-w-[420px] mx-auto">
                  Sveikas atvykęs į Lazy Fit – tavo sporto bendruomenę!
                </p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full">
                <div className="mt-8 md:w-1/2 text-center md:text-left">
                  <p className="text-[32px] md:text-[40px] font-['mango'] italic drop-shadow-lg max-w-[420px] mx-auto md:mx-0">
                    Lazy Fit – tai tavo asmeninis sporto klubas internete,
                    suteikiantis prieigą prie treniruočių, mitybos ir mokymų bet
                    kur ir bet kada
                  </p>
                </div>
                {}
                <div className="mt-8 md:mt-0 md:w-auto flex flex-row md:flex-col items-center md:space-x-0 md:space-y-4 space-x-4 space-y-0 md:block hidden">
                  <div className="bg-[#505050]/70 backdrop-blur-sm rounded-md p-6 w-35 h-24 flex items-center shadow-lg md:w-60">
                    <p className="font-['mango'] font-bold mt-2 text-[32px] mr-4 md:text-4xl">
                      +1000
                    </p>
                    <p className="text-[#C0C2C3] text-[18px] font-medium text-left">
                      Sėkmingų
                      <br />
                      pokyčių
                    </p>
                  </div>

                  <div className="bg-[#505050]/70 backdrop-blur-sm rounded-md p-6 w-35 h-24 flex items-center shadow-lg md:w-60">
                    <div className="flex items-center space-x-2 mr-4">
                      <span className="text-[32px] text-white md:text-4xl">
                        ★
                      </span>
                      <p className="font-['mango'] text-[32px] mt-2 font-bold text-white md:text-4xl">
                        4.91
                      </p>
                    </div>
                    <p className="text-[#C0C2C3] font-medium text-[18px] text-left">
                      Vidutinis
                      <br />
                      įvertinimas
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {mode === "starter" ? (
            <div className="absolute bottom-0 left-0 w-full flex items-end justify-center h-screen">
              <div className="z-10 text-center mb-8">
                <p className="text-[32px] md:text-[40px] font-['mango'] italic drop-shadow-lg">
                  Prisijunk prie mūsų bendruomenės <br /> ir gauk 20% nuolaidą!
                </p>
                <form className="mt-6 flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <input
                    type="email"
                    placeholder="Jūsų el. paštas"
                    className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-[#60988E] w-96 shadow-md"
                  />
                  <button
                    type="button"
                    className="bg-[#60988E] font-bold font-['mango'] italic text-[28px] rounded-lg px-6 py-3 hover:bg-[#EFEFEF] hover:text-[#101827] transition shadow-md w-full md:w-auto"
                  >
                    Prisijungti
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-4 left-0 w-full flex flex-col items-center justify-center space-y-4">
              {}
              <div className="flex flex-row items-center space-x-4 md:hidden">
                <div className="bg-[#505050]/70 backdrop-blur-sm rounded-md p-6 w-auto h-24 flex items-center shadow-lg">
                  <p className="font-['mango'] font-bold mt-2 text-[32px] mr-4">
                    +1000
                  </p>
                  <p className="text-[#C0C2C3] text-[12px] font-medium text-left">
                    Sėkmingų
                    <br />
                    pokyčių
                  </p>
                </div>
                <div className="bg-[#505050]/70 backdrop-blur-sm rounded-md p-6 w-auto h-24 flex items-center shadow-lg">
                  <div className="flex items-center space-x-2 mr-4">
                    <span className="text-[20px] text-white md:text-3xl">
                      ★
                    </span>
                    <p className="font-['mango'] text-[32px] mt-2 font-bold text-white md:text-4xl">
                      4.91
                    </p>
                  </div>
                  <p className="text-[#C0C2C3] font-medium text-[12px] text-left">
                    Vidutinis
                    <br />
                    įvertinimas
                  </p>
                </div>
              </div>

              {}
              <button
                type="button"
                className="hidden md:flex bg-[#60988E] text-white font-['mango'] italic text-[32px] rounded-full w-[150px] h-[150px] items-center justify-center shadow-md transition hover:opacity-90"
              >
                Išbandyti
                <br />
                nemokamai
              </button>

              <div className="w-full max-w-[380px] mx-auto mt-4">
                <button
                  type="button"
                  className="bg-[#60988E] text-white font-['mango'] italic text-[32px] rounded-lg py-3 md:hidden shadow-md transition hover:opacity-90 w-full"
                >
                  Išbandyti nemokamai
                </button>
              </div>
            </div>
          )}
        </header>
      </div>
    </>
  );
}
