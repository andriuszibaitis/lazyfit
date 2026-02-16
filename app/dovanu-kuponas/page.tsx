"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Gift, CreditCard, CheckCircle } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const amounts = [
  { value: 19.99, label: "1 mėnuo", description: "Mėnesinė narystė" },
  { value: 49.99, label: "3 mėnesiai", description: "3 mėn. narystė su nuolaida" },
  { value: 149.99, label: "12 mėnesių", description: "Metinė narystė su 38% nuolaida" },
];

export default function DovanuKuponasPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    senderName: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount > 0 && formData.recipientName && formData.senderName) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <Card className="p-12 text-center max-w-md">
            <CheckCircle className="h-16 w-16 text-[#60988E] mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Dovanų kuponas užsakytas!</h2>
            <p className="text-gray-600 mb-2">
              Kuponas <strong>{finalAmount.toFixed(2)} EUR</strong> gavėjui{" "}
              <strong>{formData.recipientName}</strong>.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Su jumis susisieksime dėl apmokėjimo ir kupono pristatymo.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setSelectedAmount(null);
                setCustomAmount("");
                setFormData({ recipientName: "", recipientEmail: "", senderName: "", message: "" });
              }}
              variant="outline"
            >
              Užsakyti dar vieną
            </Button>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-[#101827] text-white py-20 px-4">
          <div className="container mx-auto text-center">
            <Gift className="h-12 w-12 text-[#60988E] mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Dovanų kuponas</h1>
            <p className="text-gray-300 max-w-xl mx-auto">
              Padovanokite sveikatą ir sportą savo artimajam! LazyFit dovanų kuponas
              – puiki dovana kiekvienai progai.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 max-w-2xl">
          <form onSubmit={handleSubmit}>
            <Card className="p-8 mb-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#60988E]" />
                Pasirinkite sumą
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {amounts.map((amount) => (
                  <button
                    key={amount.value}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount.value);
                      setCustomAmount("");
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      selectedAmount === amount.value
                        ? "border-[#60988E] bg-[#60988E]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-2xl font-bold">{amount.value} &euro;</p>
                    <p className="font-medium text-sm">{amount.label}</p>
                    <p className="text-xs text-gray-500">{amount.description}</p>
                  </button>
                ))}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="custom">Arba įveskite savo sumą (EUR)</Label>
                <Input
                  id="custom"
                  type="number"
                  min="5"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="Pvz.: 75.00"
                />
              </div>
            </Card>

            <Card className="p-8 mb-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Gift className="h-5 w-5 text-[#60988E]" />
                Kupono informacija
              </h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="recipientName">Gavėjo vardas *</Label>
                  <Input
                    id="recipientName"
                    value={formData.recipientName}
                    onChange={(e) =>
                      setFormData({ ...formData, recipientName: e.target.value })
                    }
                    placeholder="Kam skirta dovana?"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="recipientEmail">Gavėjo el. paštas</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    value={formData.recipientEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, recipientEmail: e.target.value })
                    }
                    placeholder="gavejo@email.lt (neprivaloma)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="senderName">Jūsų vardas *</Label>
                  <Input
                    id="senderName"
                    value={formData.senderName}
                    onChange={(e) =>
                      setFormData({ ...formData, senderName: e.target.value })
                    }
                    placeholder="Jūsų vardas"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Asmeninė žinutė</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Parašykite asmeninę žinutę gavėjui..."
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            <Button
              type="submit"
              disabled={finalAmount <= 0}
              className="w-full bg-[#60988E] hover:bg-[#4e7d74] text-white py-3 text-lg flex items-center justify-center gap-2"
            >
              <Gift className="h-5 w-5" />
              {finalAmount > 0
                ? `Užsakyti kuponą - ${finalAmount.toFixed(2)} EUR`
                : "Pasirinkite sumą"}
            </Button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
