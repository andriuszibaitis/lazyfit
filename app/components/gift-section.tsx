"use client";

import { useState } from "react";
import Image from "next/image";

export default function GiftSection() {
  const [mode] = useState<"starter" | "default">("default");

  return (
    <section className="bg-white pb-[250px] py-16 overflow-hidden">
      {}
      <div className="relative container mx-auto">
        {}
        <div className="absolute top-10 bottom-[-20px] left-0 w-32 h-32 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/images/ready/image_01.png"
            alt="Lazyfit"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute top-[-20px] right-1/4 bottom-20 w-32 h-32 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/images/ready/image_02.png"
            alt="Lazyfit 2"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute bottom-[-155px] left-1/4 w-32 h-32 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/images/ready/image_03.png"
            alt="Lazyfit 3"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute bottom-[20px] right-10 w-32 h-32 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/images/ready/image_04.png"
            alt="Lazyfit 4"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute top-[-30px] left-1/4 w-32 h-32 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/images/ready/image_05.png"
            alt="Lazyfit 5"
            fill
            className="object-cover"
          />
        </div>

        {}
        <div className="relative flex flex-col justify-center items-center text-center mt-[100px] z-10 min-h-[300px]">
          {mode === "starter" ? (
            <>
              <h2 className="text-[48px] md:text-5xl text-[#101827] font-bold font-['mango'] uppercase mb-6 leading-[1]">
                Pasiruošk
                <br />
                Startui <span className="text-[#60988E] italic">Pirmas!</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-[350px] md:max-w-[600px]">
                Įrašyk savo el. pašto adresą ir būk tarp pirmųjų, gavusių
                prieigą prie LazyFit platformos. Mes informuosime tave vos
                startuosime, o kaip ačiū – suteiksime 20% nuolaidą bet kuriam
                narystės planui. Prisijunk prie naujos kartos sporto ir sveikos
                gyvensenos jau dabar!
              </p>
              <form className="mt-6 flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <input
                  type="email"
                  placeholder="Jūsų el. paštas"
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-[#60988E] w-96 shadow-md"
                />
                <button
                  type="button"
                  className="bg-[#60988E] font-bold font-['mango'] italic text-white text-[28px] rounded-lg px-6 py-3 hover:bg-[#EFEFEF] hover:text-[#101827] transition shadow-md"
                >
                  Prisijungti
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-[48px] md:text-5xl text-[#101827] font-bold font-['mango'] uppercase mb-6 leading-[1]">
                Dovana, kuri
                <br />{" "}
                <span className="text-[#60988E] italic">keičia gyvenimą</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-[600px]">
                Ieškai prasmingos dovanos artimam žmogui? „Lazyfit" dovanų
                kuponas – tai galimybė ne tik pradėti kelionę į sveikesnį
                gyvenimą, bet ir išmokti tvarių mitybos bei sporto principų.
                Padovanok narystę ir leisk išbandyti patogią platformą,
                prieinamą tiek telefone, tiek kompiuteryje – už vieną kainą, su
                visais reikalingais įrankiais geresnei savijautai!
              </p>
              <a
                href="#"
                className="bg-[#60988E] font-bold font-['mango'] italic text-white text-[28px] rounded-lg px-6 py-3 hover:bg-[#EFEFEF] hover:text-[#101827] transition shadow-md"
              >
                Įsigyti dovanų kuponą
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
