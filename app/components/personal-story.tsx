import Image from "next/image";

export default function PersonalStory() {
  return (
    <section className="bg-white py-16 m-5 md:m-0">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-stretch gap-8">
        {}
        <div className="overflow-hidden rounded-3xl order-last md:order-first relative h-[476px] md:h-[676px]">
          <Image
            src="/images/airidas-butkus.png"
            alt="Airidas Butkus"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {}
        <div className="bg-white border border-1 border-[#B2B4B9] rounded-3xl p-8 flex flex-col justify-between order-first md:order-last">
          <h2 className="text-[#101827] font-['mango'] font-bold text-[40px] md:text-5xl uppercase leading-[1] text-center md:text-left">
            Asmeninė istorija,
            <br />
            <span className="text-[#60988E] italic">kuri įkvėps</span>
          </h2>

          <p className="text-gray-700 font-[var(--font-outfit)] text-base leading-7 mt-6 md:mt-0">
            Esu Airidas Butkus, "LazyFit" online sporto klubo steigėjas ir jėgos
            bei sveikatingumo treneris. Mano tikslas buvo ne tik sukurti
            platformą, kurioje žmonės gali tobulėti fiziškai, bet ir įgyvendinti
            tam tikrą savo filosofiją. Ši vieta nėra apie perdėtą pozityvumą. Į
            LazyFit žvelgiu kaip į subtilų balansą, tam tikrą sarkazmą į sveiką
            gyvenseną. Tai, kaip mokslas ir paprasta pradinuko logika gali
            padėti mums šiek tiek geriau suprasti, kaip geriausia mum patiems
            pasirūpinti savo kūnu ir protu. Čia nesurasi tuščių pažadų ar
            akivaizdžių, netikrų mantrų. Tai vieta, kur sužinosi, ką būtent
            reikia daryti norint būti šiek tiek sveikesniu ir energingesniu,
            šiam kupinam pasauliui pagundų.
          </p>
        </div>
      </div>
    </section>
  );
}
