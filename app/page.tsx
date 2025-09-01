import type { Metadata } from "next";
import Navbar from "./components/navbar";
import Header from "./components/header";
import MotivationSection from "./components/motivation-section";
import CardSlider from "./components/card-slider";
import StepsSection from "./components/steps-section";
import PersonalStory from "./components/personal-story";
import MembershipPricing from "./components/membership-pricing";
import FAQSection from "./components/faq-section";
import GiftSection from "./components/gift-section";
import Footer from "./components/footer";

export const metadata: Metadata = {
  title: "LazyFit - Tavo asmeninis sporto klubas internete",
  description:
    "LazyFit – tai tavo asmeninis sporto klubas internete, suteikiantis prieigą prie treniruočių, mitybos ir mokymų bet kur ir bet kada.",
  keywords:
    "sporto klubas, treniruotės, mityba, sportas, sveikata, online treniruotės",
  openGraph: {
    title: "LazyFit - Tavo asmeninis sporto klubas internete",
    description:
      "LazyFit – tai tavo asmeninis sporto klubas internete, suteikiantis prieigą prie treniruočių, mitybos ir mokymų bet kur ir bet kada.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LazyFit",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LazyFit - Tavo asmeninis sporto klubas internete",
    description:
      "LazyFit – tai tavo asmeninis sporto klubas internete, suteikiantis prieigą prie treniruočių, mitybos ir mokymų bet kur ir bet kada.",
    images: ["/images/og-image.jpg"],
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <Header />
      <MotivationSection />
      <CardSlider />
      <StepsSection />
      <PersonalStory />
      <MembershipPricing />
      <GiftSection />
      <FAQSection />
      <Footer />
    </>
  );
}
