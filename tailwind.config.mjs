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
        // Legacy colors (keep for backwards compatibility)
        primary: "#609FEF",
        darkBlue: "#101827",
        lightGrey: "#EFEFEF",
        yellow: "#FAC64B",
        grey: "#B2B4B9",
        darkGrey: "#555B65",
        brandgreen: "#60988E",
        systemRed: "#E74043",

        // Design System - Base Colors
        black: "#141313",
        "black-2": "#1E1E1E",
        white: "#FFFFFF",
        "white-darken": "#F7F7F7",

        // Fill Colors
        "light-grey": "#EFEFEF",
        "grey-light": "#CCCED3",
        "dark-grey": "#555B65",
        "light-green": "#D7E5E3",
        "brand-green-light": "#AFCBC7",
        "brand-green": "#60988E",
        "brand-green-dark": "#34786C",
        "light-yellow": "#FFF7DF",
        "warning-light": "#FFE2A5",
        warning: "#FFB700",
        "success-light": "#C8E8D6",
        success: "#25A55A",
        "destructive-light": "#FBD0CD",
        destructive: "#E74043",
        "destructive-dark": "#BA1E21",

        // Background Colors
        "bg-white": "#FFFFFF",
        "bg-white-darken": "#F7F7F7",
        "bg-warning": "#FFF1C2",
        "bg-information": "#F0F7FF",
        "bg-error": "#FDECEC",
        "bg-success": "#ECF7EC",

        // Nutrition Colors
        calories: "#BBB1FC",
        carbs: "#51BD9B",
        protein: "#F98466",
        fat: "#334BA3",

        // Border Colors
        "border-primary": "#101827",
        "border-secondary": "#555B65",
        "border-grey": "#B2B4B9",
        "border-light-grey": "#CCCED3",
        "border-brand-green": "#60988E",
        "border-brand-green-dark": "#34786C",
        "border-white": "#FFFFFF",
        "border-warning": "#FFB700",
        "border-success": "#25A55A",
        "border-destructive": "#E74043",

        // Text & Icon Colors
        "text-black": "#101827",
        "text-brand-green": "#60988E",
        "text-success": "#87CEA5",
        "text-error": "#F69891",
        "text-warning": "#FFD16E",
        "text-grey": "#CCCED3",
        "text-secondary": "#E6E6E6",
        "text-primary-border": "#EFEFEF",
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
        mango: ["mango", "sans-serif"],
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
      },
      fontSize: {
        // Headers
        "header-xl": ["48px", { lineHeight: "0.9", fontWeight: "600" }],
        "header-l": ["36px", { lineHeight: "0.9", fontWeight: "600" }],
        "header-m": ["28px", { lineHeight: "0.9", fontWeight: "600" }],
        "header-card": ["18px", { lineHeight: "1.2", fontWeight: "500", letterSpacing: "-0.36px" }],

        // Text medium
        "text-medium": ["16px", { lineHeight: "1.3", fontWeight: "400", letterSpacing: "-0.32px" }],
        "text-medium-md": ["16px", { lineHeight: "1.2", fontWeight: "500" }],
        "text-medium-sb": ["16px", { lineHeight: "1.2", fontWeight: "600" }],
        "text-medium-bold": ["16px", { lineHeight: "1.2", fontWeight: "700" }],

        // Text small
        "text-small": ["14px", { lineHeight: "1.4", fontWeight: "400", letterSpacing: "-0.28px" }],
        "text-small-md": ["14px", { lineHeight: "1.2", fontWeight: "500" }],
        "text-small-sb": ["14px", { lineHeight: "1.2", fontWeight: "600" }],
        "text-small-bold": ["14px", { lineHeight: "1.2", fontWeight: "700" }],

        // Text very small
        "text-xs": ["13px", { lineHeight: "1.2", fontWeight: "400" }],
        "text-xs-md": ["13px", { lineHeight: "1.2", fontWeight: "500" }],
        "text-xs-sb": ["13px", { lineHeight: "1.2", fontWeight: "600" }],
        "text-xs-bold": ["13px", { lineHeight: "1.2", fontWeight: "700" }],

        // Text tiny
        "text-tiny": ["11px", { lineHeight: "1.2", fontWeight: "400" }],
        "text-tiny-md": ["11px", { lineHeight: "1.2", fontWeight: "500" }],
        "text-tiny-sb": ["11px", { lineHeight: "1.2", fontWeight: "600" }],
        "text-tiny-bold": ["11px", { lineHeight: "1.2", fontWeight: "700" }],
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
