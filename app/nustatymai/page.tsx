import { Card } from "@/components/ui/card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth-options";
import Link from "next/link";
import { Shield } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "admin";

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Nustatymai</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profilio nustatymai</h2>
          <p className="text-gray-600 mb-4">
            Keiskite savo profilio informaciją, slaptažodį ir kitus asmeninius
            nustatymus.
          </p>
          <Link
            href="/nustatymai/profilis"
            className="bg-[#60988E] text-white px-4 py-2 rounded-lg inline-block hover:bg-opacity-90 transition-colors"
          >
            Redaguoti profilį
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Pranešimų nustatymai</h2>
          <p className="text-gray-600 mb-4">
            Valdykite, kokius pranešimus ir el. laiškus norite gauti iš LazyFit.
          </p>
          <Link
            href="/nustatymai/pranesimai"
            className="bg-[#60988E] text-white px-4 py-2 rounded-lg inline-block hover:bg-opacity-90 transition-colors"
          >
            Keisti pranešimus
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Privatumo nustatymai</h2>
          <p className="text-gray-600 mb-4">
            Valdykite savo duomenų privatumą ir peržiūrėkite, kokius duomenis
            renkame.
          </p>
          <Link
            href="/nustatymai/privatumas"
            className="bg-[#60988E] text-white px-4 py-2 rounded-lg inline-block hover:bg-opacity-90 transition-colors"
          >
            Privatumo nustatymai
          </Link>
        </Card>

        {isAdmin && (
          <Card className="p-6 border-2 border-[#60988E]">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-[#60988E] mr-2" />
              <h2 className="text-xl font-semibold">
                Administratoriaus skydelis
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Jūs turite administratoriaus teises. Pasiekite administravimo
              skydelį čia.
            </p>
            <Link
              href="/admin"
              className="bg-[#60988E] text-white px-4 py-2 rounded-lg inline-block hover:bg-opacity-90 transition-colors"
            >
              Eiti į administravimą
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
