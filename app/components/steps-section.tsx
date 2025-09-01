export default function StepsSection() {
  const steps = [
    {
      number: "01",
      title: "Pasirink narystę",
      description:
        "Išsirink tinkamą planą, kuris geriausiai atitinka tavo tikslus ir poreikius. Nesvarbu, ar sieki pagerinti fizinę formą, pradėti sveikiau maitintis, ar išmokti kurti tvarius įpročius – viskas tavo rankose.",
    },
    {
      number: "02",
      title: "Prisijunk",
      description:
        "Užsiregistruok ir gauk neribotą prieigą prie sporto pratimų, mitybos idėjų bei mokymų. Naudok platformą lengvai ir patogiai – tiek kompiuteryje, tiek telefone, bet kur ir bet kada.",
    },
    {
      number: "03",
      title: "Ženk pirmąjį žingsnį",
      description:
        'Sek planą, mokykis, kaip valdyti savo mitybą ir treniruotes, bei pasiek savo tikslų tvariai ir užtikrintai. Su „Lazyfit" tavo sveikesnis gyvenimas prasideda lengvai ir efektyviai.',
    },
  ];

  return (
    <section className="bg-white py-16 m-5 md:m-0">
      <div className="container mx-auto text-center">
        <h2 className="text-[#101827] font-['mango'] font-bold text-[48px] uppercase md:text-5xl">
          Tik trys žingsniai iki{" "}
          <span className="text-[#60988E] italic">starto</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-[#EFEFEF] rounded-2xl p-8 text-left relative overflow-hidden"
            >
              <div className="w-full h-40 bg-transparent rounded-t-2xl relative z-10"></div>
              <div className="absolute top-[-50px] left-[-45px] text-[400px] text-[#E6E6E6] font-['mango'] font-bold leading-none z-0">
                {step.number}
              </div>
              <h3 className="text-[#101827] font-['mango'] font-bold text-[48px] mt-8 uppercase relative z-10 md:text-4xl md:mt-8">
                {step.title}
              </h3>
              <p className="text-gray-700 font-[var(--font-outfit)] text-base mt-2 w-4/5 relative z-10 md:mt-4">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto mt-8">
        <button className="w-full bg-[#60988E] font-bold font-['mango'] italic text-[28px] text-white py-4 rounded-lg hover:bg-green-600 transition">
          Gauti išankstinę prieigą
        </button>
      </div>
    </section>
  );
}
