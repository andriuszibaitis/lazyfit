"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Card {
  title: string;
  description: string;
  image: string;
}

export default function CardSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const cards: Card[] = [
    {
      title: "Prieiga bet kur\n ir bet kada",
      description:
        "Nesvarbu, kur esi – namuose, sporto salėje ar kelionėje, platforma pritaikyta tavo gyvenimo ritmui. Gali naudotis tiek kompiuteriu, tiek telefonu, todėl ji visada bus po ranka. Tu pats galėsi spręsti, kada ir kaip pritaikyti įrankius, kad jie geriausiai atitiktų tavo dienos planus. Lankstumas ir patogumas leidžia sklandžiai įtraukti sveikos gyvensenos sprendimus į kasdienybę.",
      image: "/images/allinone/image_01.png",
    },
    {
      title: "Viskas, ko reikia,\nvienoje vietoje",
      description:
        'Pamiršk atskiras platformas ar konsultacijas – su „Lazyfit" gausi viską, ko reikia, kad pasiektum savo sveikatingumo tikslų. Viena narystė suteikia tau pilną paketą: galėsi rasti tiek sporto pratimus, tiek mitybos idėjas, tiek edukacinius mokymus. Tavo kelionė į sveikesnį gyvenimą bus ne tik paprasta, bet ir struktūruota – kiekvienas žingsnis bus aiškus ir lengvai įgyvendinamas.',
      image: "/images/allinone/image_02.png",
    },
    {
      title: "Ilgalaikiai įgūdžiai ir\nrezultatai",
      description:
        'Platforma ne tik siūlo sprendimus, bet ir moko, kaip juos integruoti į savo gyvenimą. Tu išmoksi savarankiškai planuoti savo mitybą, keisti pratimus ir pritaikyti sveikos gyvensenos principus pagal savo poreikius. Tai reiškia, kad ne tik pasieksi rezultatų, bet ir išmoksi juos išlaikyti ilgą laiką. Su „Lazyfit" tu tapsi savo sveikatos ekspertu.',
      image: "/images/allinone/image_03.png",
    },
    {
      title: "Lengvas ir draugiškas\nnaudojimas",
      description:
        '„Lazyfit" sukurta tam, kad tau būtų patogu ir aišku nuo pirmos minutės. Intuityvus ir patrauklus dizainas leidžia lengvai rasti tai, ko reikia, o aiškiai pateikiama informacija padeda greitai įsitraukti į procesą. Jokių sudėtingų meniu ar painių nurodymų – tiesiog greitas startas ir įkvepianti patirtis, kuri motyvuos siekti daugiau.',
      image: "/images/allinone/image_04.png",
    },
  ];

  const scrollToSlide = (index: number) => {
    if (sliderRef.current) {
      const slideWidth = isMobile ? sliderRef.current.clientWidth : 900;
      sliderRef.current.scrollTo({
        left: index * (slideWidth + 8),
        behavior: "smooth",
      });
      setCurrentSlide(index);
    }
  };

  const scrollLeft = () => {
    const newIndex = Math.max(0, currentSlide - 1);
    scrollToSlide(newIndex);
  };

  const scrollRight = () => {
    const newIndex = Math.min(cards.length - 1, currentSlide + 1);
    scrollToSlide(newIndex);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        const slideWidth = isMobile ? sliderRef.current.clientWidth : 900;
        const index = Math.round(
          sliderRef.current.scrollLeft / (slideWidth + 8)
        );
        setCurrentSlide(index);
      }
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      return () => {
        slider.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isMobile]);

  return (
    <section className="bg-white py-16 relative">
      <div className="container mx-auto relative text-center mb-4">
        {}
        <h2 className="text-[#101827] font-['mango'] font-bold text-[48px] md:text-5xl uppercase">
          Viskas <span className="text-[#60988E] italic">vienoje vietoje</span>
        </h2>
        {}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 gap-4 hidden md:flex">
          <button
            onClick={scrollLeft}
            className="w-12 h-12 bg-white border border-[#101827] rounded-lg shadow-[5px_5px_0px_0px_rgba(16,_24,_39,_1)] flex items-center justify-center hover:bg-gray-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={scrollRight}
            className="w-12 h-12 bg-white border border-[#101827] rounded-lg shadow-[5px_5px_0px_0px_rgba(16,_24,_39,_1)] flex items-center justify-center hover:bg-gray-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      </div>

      {}
      <div
        ref={sliderRef}
        className="container mx-auto overflow-x-auto snap-x snap-mandatory flex gap-2 scroll-smooth hide-scrollbar"
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl border border-[#B2B4B9] ${
              index === 0 ? "ml-4" : "ml-1"
            } ${
              index === cards.length - 1 ? "md:mr-5" : ""
            } p-6 flex w-[calc(100%-2rem)] md:w-[900px] md:h-[410px] flex-shrink-0 snap-center flex-col md:flex-row`}
          >
            <div className="flex-grow pr-6 flex flex-col justify-between">
              <h3 className="text-[#101827] font-['mango'] font-bold text-[30px] md:text-4xl mb-4 uppercase whitespace-pre-line">
                {card.title}
              </h3>
              <p className="text-gray-700 font-[var(--font-outfit)] text-base leading-7 mt-auto">
                {card.description}
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-[400px] h-[200px] md:h-[360px] mt-4 md:mt-0 relative">
              <Image
                src={card.image || "/placeholder.svg"}
                alt="Kortelės nuotrauka"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="rounded-lg shadow-md object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {}
      <div className="flex justify-center mt-6 gap-2 md:hidden">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full ${
              currentSlide === index ? "bg-[#60988E]" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
