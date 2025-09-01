"use client";

import { useState, useEffect, useRef } from "react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: 'Kaip pradėti naudotis „Lazyfit" platforma?',
      answer:
        "Norėdami pradėti, tiesiog užsiregistruokite mūsų platformoje, pasirinkite narystės planą ir gaukite prieigą prie visų treniruočių, mitybos planų ir mokymų.",
    },
    {
      id: 2,
      question:
        'Ar galiu naudoti „Lazyfit" tiek su telefonu, tiek su kompiuteriu?',
      answer:
        "Platforma yra pritaikyta tiek telefonams, tiek kompiuteriams, kad galėtumėte pasiekti viską patogiai bet kur ir bet kada.",
    },
    {
      id: 3,
      question: "Ar galiu atšaukti narystę bet kada?",
      answer:
        "Taip, galite atšaukti narystę bet kuriuo metu be jokių papildomų mokesčių ar įsipareigojimų.",
    },
    {
      id: 4,
      question: "Kaip dažnai atnaujinamas turinys?",
      answer:
        "Naujas turinys – treniruotės, mitybos planai ir mokymai – pridedami reguliariai, kad visada turėtumėte naujų iššūkių ir informacijos.",
    },
    {
      id: 5,
      question: "Ar reikia turėti sporto įrangos?",
      answer:
        "Daugeliui treniruočių nereikia jokios specialios įrangos, tačiau kai kurioms gali prireikti bazinių priemonių, tokių kaip kilimėlis ar svareliai.",
    },
  ];

  const toggleQuestion = (id: number) => {
    if (openQuestion === id) {
      setOpenQuestion(null);
    } else {
      setOpenQuestion(id);
    }
  };

  useEffect(() => {
    if (!marqueeRef.current) return;

    const marqueeText = "DAŽNIAUSIAI UŽDUODAMI KLAUSIMAI";
    const marqueeElement = marqueeRef.current;

    const createMarqueeContent = () => {
      let content = "";
      for (let i = 0; i < 10; i++) {
        content += `<span class="mx-8">${marqueeText}</span>`;
      }
      marqueeElement.innerHTML = content;
    };

    createMarqueeContent();

    let position = 0;
    const speed = 1;

    const animate = () => {
      position -= speed;

      const firstElementWidth =
        marqueeElement.querySelector("span")?.offsetWidth || 0;
      if (position <= -firstElementWidth - 16) {
        position = 0;
      }

      marqueeElement.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="bg-white py-16 overflow-hidden m-5 md:m-0">
      <div className="relative w-full overflow-hidden">
        <div
          id="marquee"
          ref={marqueeRef}
          className="flex items-center whitespace-nowrap font-['mango'] text-[5rem] md:text-[10rem] font-bold uppercase text-white"
          style={{ textShadow: "4px 4px 0px #60988E" }}
        ></div>
      </div>

      <div className="mx-auto container mt-2">
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
          {faqItems.map((item) => (
            <div key={item.id} className="p-3 question">
              <button
                className="flex items-center w-full toggle-btn h-16"
                onClick={() => toggleQuestion(item.id)}
              >
                <span className="hidden text-[#101827] font-['mango'] font-bold text-2xl text-left flex-none w-10 text-center md:block">
                  {item.id}.
                </span>
                <h3 className="text-[#101827] font-bold font-['mango'] text-[28px] text-center flex-grow md:text-3xl">
                  {item.question}
                </h3>
                <svg
                  className={`transition-transform duration-300 h-6 w-6 flex-none ml-4 ${
                    openQuestion === item.id ? "rotate-180" : "rotate-0"
                  }`}
                  width="24"
                  height="23"
                  viewBox="0 0 24 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 20.75L20.5 3.25"
                    stroke="#101827"
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 2H21.75V18.25"
                    stroke="#101827"
                    strokeWidth="3"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
              <div
                className={`answer mx-auto text-gray-700 text-base overflow-hidden transition-all duration-300 text-center md:w-[600px] ${
                  openQuestion === item.id ? "max-h-96 py-4" : "max-h-0"
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
