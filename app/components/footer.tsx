import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const footerMenuItems = [
    { name: "Pagrindinis", href: "/" },
    { name: "Apie mus", href: "/apie" },
    { name: "Paslaugos", href: "/paslaugos" },
    { name: "Kontaktai", href: "/kontaktai" },
  ];

  return (
    <footer className="bg-[#101827] m-5 rounded-3xl text-white py-16 px-4">
      {}
      <div className="container mx-auto text-center">
        {}
        <h3 className="text-[48px] md:text-5xl font-['mango'] font-bold mb-[20px]">
          KONTAKTAI
        </h3>

        {}
        <p className="text-base text-gray-300 mb-[70px] w-auto md:w-[500px] mx-auto">
          Jei kyla klausimų ar norite sužinoti daugiau apie „Lazyfit", mes
          visada pasiruošę jums padėti. Susisiekite su mumis ir mes atsakysime į
          visus jūsų klausimus – greitai ir aiškiai!
        </p>

        {}
        <a
          href="mailto:support@lazyfit.com"
          className="font-['mango'] text-[32px] md:text-[64px] block mb-12 hover:text-[#60988E] transition-colors"
        >
          support@lazyfit.com
        </a>

        {}
        <div className="social-icons flex justify-center space-x-4 mb-8">
          <a href="#" className="hover:text-[#60988E] transition-colors">
            <Facebook size={32} />
          </a>
          <a href="#" className="hover:text-[#60988E] transition-colors">
            <Instagram size={32} />
          </a>
        </div>
      </div>

      {}
      <div className="pt-8 mt-8 border-t border-gray-700">
        <div className="container font-[var(--font-outfit)] mx-auto flex flex-col md:flex-row justify-between text-sm text-gray-400 items-center md:items-start">
          {}
          <p className="mb-4 md:mb-0 text-center md:text-left md:order-none order-last">
            &copy; {new Date().getFullYear()} LazyFIT. Visos teisės saugomos.
          </p>

          {}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 text-sm text-white font-[var(--font-outfit)] uppercase justify-center text-center md:text-center">
            {footerMenuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="hover:text-[#60988E] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {}
          <div className="flex justify-center md:justify-end space-x-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privatumo politika
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Naudojimosi politika
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
