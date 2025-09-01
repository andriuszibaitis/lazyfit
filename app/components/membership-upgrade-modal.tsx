"use client";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface MembershipUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredLevel: string;
}

export default function MembershipUpgradeModal({
  isOpen,
  onClose,
  requiredLevel,
}: MembershipUpgradeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push("/membership/upgrade");
  };

  const membershipBenefits = {
    basic: [
      "Prieiga prie pagrindinių treniruočių",
      "Pagrindiniai mitybos planai",
      "Bendruomenės forumas",
    ],
    premium: [
      "Visos Basic narystės funkcijos",
      "Prieiga prie visų treniruočių",
      "Išsamūs mitybos planai",
      "Asmeninės konsultacijos",
      "Progresas ir statistika",
    ],
    pro: [
      "Visos Premium narystės funkcijos",
      "Individualūs treniruočių planai",
      "Individualūs mitybos planai",
      "Prioritetinė pagalba",
      "Papildomi mokomieji video",
    ],
  };

  const benefits =
    membershipBenefits[
      requiredLevel.toLowerCase() as keyof typeof membershipBenefits
    ] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex flex-col items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="text-primary" size={24} />
          </div>
          <h2 className="text-xl font-bold mb-2">
            Reikalinga {requiredLevel} narystė
          </h2>
          <p className="text-center text-gray-600 mb-4">
            Šis turinys prieinamas tik {requiredLevel} narystės nariams.
            Atnaujinkite savo narystę, kad galėtumėte peržiūrėti šį turinį.
          </p>

          {benefits.length > 0 && (
            <div className="w-full mb-4">
              <h3 className="font-medium mb-2 text-center">
                {requiredLevel} narystės privalumai:
              </h3>
              <ul className="space-y-1">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Atšaukti
          </Button>
          <Button onClick={handleUpgrade}>Atnaujinti narystę</Button>
        </div>
      </div>
    </div>
  );
}
