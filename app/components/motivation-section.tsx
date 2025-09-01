import Image from "next/image";

export default function MotivationSection() {
  const images = [
    "/images/motivation/image_01.png",
    "/images/motivation/image_02.png",
    "/images/motivation/image_03.png",
    "/images/motivation/image_04.png",
    "/images/motivation/image_05.png",
    "/images/motivation/image_06.png",
  ];

  return (
    <section className="bg-white py-24 m-5 md:m-0">
      <div className="container mx-auto text-center max-w-4xl px-4">
        <p className="text-[#101827] font-bold text-sm mb-4">
          Šiek tiek sveikiau
        </p>
        <h2 className="text-[#101827] text-[48px] uppercase font-['mango'] font-bold leading-[1] relative md:text-5xl">
          Kad{" "}
          <span className="text-[#60988E] italic relative top-[-5px]">
            kiekviena treniruotė
          </span>
          <br />
          Taptų žingsniu link šiek tiek geresnio,{" "}
          <span className="text-[#60988E] italic">subalansuoto tavęs</span>
        </h2>
        <p className="text-gray-700 font-[var(--font-outfit)] text-[18px] mt-4 leading-[1.4] max-w-[460px] mx-auto">
          LazyFit skatina ilgalaikius pokyčius, ugdo naujus įpročius, bei
          pabrėžia, kad visiškai nereikia atsisakyti dalykų, kuriuos mėgsti, net
          jei jie nėra patys sveikiausi. Kartu sportuojame siekdami kuo ilgiau
          leisti sau daryti tai, kas patinka, o ne aklai kažko atsisakyti.
        </p>
      </div>

      <div className="container mx-auto mt-10 grid grid-cols-3 md:grid-cols-6 gap-x-10 gap-y-4 justify-items-center">
        {images.map((src, index) => (
          <div key={index} className="w-[100px] h-[100px] relative">
            <Image
              src={src || "/placeholder.svg"}
              alt={`Motivation image ${index + 1}`}
              fill
              sizes="100px"
              className="rounded-lg shadow-md object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
