/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./assets/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#609FEF",
        darkBlue: "#101827",
        lightGrey: "#EFEFEF",
        yellow: "#FAC64B",
        grey: "#B2B4B9",
        darkGrey: "#555B65",
        brandgreen: "#60988E",
        systemRed: "#E74043",
      },
      fontFamily: {
        outfit: ["var(--font-outfit)"],
        mango: ["mango", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
