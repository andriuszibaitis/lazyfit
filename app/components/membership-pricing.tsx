"use client";

import { useState, useEffect } from "react";
import DiscountBadge from "../utils/discount-badge";

type Membership = {
  id: string;
  name: string;
  planId: string;
  price: number | string;
  discountPercentage: number;
  duration: number;
  description: string | null;
  features: any;
  isActive: boolean;
  showOnHomepage: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export default function MembershipPricing() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMemberships() {
      try {
        console.log("Bandoma gauti narystes iš API...");
        const response = await fetch("/api/memberships");

        if (!response.ok) {
          throw new Error(
            `API klaida: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        console.log("Visos narystės:", data.length);

        const filteredMemberships = data.filter(
          (membership: Membership) =>
            membership.isActive && membership.showOnHomepage
        );

        console.log("Filtruotos narystės:", filteredMemberships.length);
        console.log("Filtruotos narystės:", filteredMemberships);

        setMemberships(filteredMemberships);
      } catch (error) {
        console.error("Error fetching memberships:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMemberships();
  }, []);

  function formatDuration(days: number): string {
    if (days % 365 === 0) {
      const years = days / 365;
      return `${years} ${years === 1 ? "metų" : "metų"}`;
    } else if (days % 30 === 0) {
      const months = days / 30;
      return `${months} ${months === 1 ? "mėn." : "mėn."}`;
    } else {
      return `${days} ${days === 1 ? "dienos" : "dienų"}`;
    }
  }

  function formatPrice(price: number | string): string {
    const numPrice =
      typeof price === "number" ? price : Number.parseFloat(String(price));

    if (isNaN(numPrice)) {
      console.error("Klaida formatuojant kainą:", price);
      return "0,00 €";
    }

    return numPrice.toFixed(2).replace(".", ",") + " €";
  }

  function calculateDiscountedPrice(
    price: number | string,
    discountPercentage: number
  ): number {
    const numPrice =
      typeof price === "number" ? price : Number.parseFloat(String(price));
    return numPrice * (1 - discountPercentage / 100);
  }

  function calculateTotalPrice(price: number | string, days: number): number {
    const numPrice =
      typeof price === "number" ? price : Number.parseFloat(String(price));
    const months = days / 30;
    return numPrice * months;
  }

  function parseFeatures(
    features: any
  ): Array<{ text: string; included: boolean }> {
    if (Array.isArray(features)) {
      return features.map((feature) => ({
        text: String(feature),
        included: true,
      }));
    } else if (typeof features === "object" && features !== null) {
      try {
        return Object.values(features).map((feature) => ({
          text: String(feature),
          included: true,
        }));
      } catch (e) {
        console.error("Klaida apdorojant features:", e);
        return [];
      }
    } else if (typeof features === "string") {
      try {
        const parsedFeatures = JSON.parse(features);
        if (Array.isArray(parsedFeatures)) {
          return parsedFeatures.map((feature) => ({
            text: String(feature),
            included: true,
          }));
        }
        return [];
      } catch (e) {
        return features
          .split("\n")
          .filter(Boolean)
          .map((feature) => ({
            text: feature.trim(),
            included: true,
          }));
      }
    }

    return [];
  }

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="flex items-center justify-center m-5">
          <h2 className="text-[#101827] max-w-[600px] font-['mango'] leading-[1] font-bold text-[48px] uppercase md:text-5xl text-center">
            Narystė, kuri suteikia viską{" "}
            <span className="text-[#60988E] italic">vienoje vietoje</span>
          </h2>
        </div>
        <div className="flex justify-center">
          <p>Kraunami narysčių planai...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-16">
        <div className="flex items-center justify-center m-5">
          <h2 className="text-[#101827] max-w-[600px] font-['mango'] leading-[1] font-bold text-[48px] uppercase md:text-5xl text-center">
            Narystė, kuri suteikia viską{" "}
            <span className="text-[#60988E] italic">vienoje vietoje</span>
          </h2>
        </div>
        <div className="flex justify-center">
          <p className="text-red-500">Klaida: {error}</p>
        </div>
      </section>
    );
  }

  if (memberships.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="flex items-center justify-center m-5">
          <h2 className="text-[#101827] max-w-[600px] font-['mango'] leading-[1] font-bold text-[48px] uppercase md:text-5xl text-center">
            Narystė, kuri suteikia viską{" "}
            <span className="text-[#60988E] italic">vienoje vietoje</span>
          </h2>
        </div>
        <div className="flex justify-center">
          <p>Šiuo metu nėra aktyvių narysčių planų.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="flex items-center justify-center m-5">
        <h2 className="text-[#101827] max-w-[600px] font-['mango'] leading-[1] font-bold text-[48px] uppercase md:text-5xl text-center">
          Narystė, kuri suteikia viską{" "}
          <span className="text-[#60988E] italic">vienoje vietoje</span>
        </h2>
      </div>

      <div className="membership-container flex flex-wrap justify-center items-stretch gap-6">
        {memberships.map((membership, index) => {
          const durationText = formatDuration(membership.duration);
          const pricePerMonth = membership.price;
          const totalPrice = calculateTotalPrice(
            pricePerMonth,
            membership.duration
          );
          const discountedTotalPrice = calculateDiscountedPrice(
            totalPrice,
            membership.discountPercentage
          );

          const featuresList = parseFeatures(membership.features);

          return (
            <div
              key={membership.id}
              className={`membership-card bg-[#EFEFEF] shadow-lg rounded-xl p-6 text-[#101827] w-full max-w-sm md:max-w-md flex flex-col justify-between border-2 ${
                hoveredCard === index
                  ? "border-[#60988E]"
                  : "border-transparent"
              } transition-colors duration-300`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {}
              <div className="flex items-center justify-center mt-4">
                <h3 className="text-[32px] uppercase font-['mango'] flex items-center">
                  {membership.name}
                  {membership.discountPercentage > 0 && (
                    <DiscountBadge
                      percentage={`${membership.discountPercentage}%`}
                    />
                  )}
                </h3>
              </div>

              <div className="mt-4 text-center h-32">
                <p className="text-sm font-medium">{durationText} narystė</p>
                <p className="mt-2 py-2 px-4 border-[1px] border-[#60988E] rounded-full inline-block text-[15px] font-semibold">
                  {formatPrice(pricePerMonth)}/mėnuo
                </p>
                {membership.discountPercentage > 0 && (
                  <>
                    <p className="text-sm mt-2 line-through text-gray-500">
                      {formatPrice(totalPrice)}
                    </p>
                    <p className="text-sm text-[#101827] font-semibold">
                      → {formatPrice(discountedTotalPrice)}
                    </p>
                  </>
                )}
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                {featuresList.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <span
                      className={
                        feature.included
                          ? "text-green-600 mr-2"
                          : "text-red-600 mr-2"
                      }
                    >
                      {feature.included ? "✔️" : "❌"}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>

              <button className="bg-[#101827] font-['mango'] italic text-[28px] text-white font-bold py-2 px-4 mt-6 rounded-lg w-full hover:bg-[#EFEFEF] hover:text-[#101827] transition">
                Išsirinkti narystę
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
