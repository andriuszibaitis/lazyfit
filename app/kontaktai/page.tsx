"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function KontaktaiPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-[#101827] text-white py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Susisiekite su mumis</h1>
            <p className="text-gray-300 max-w-xl mx-auto">
              Turite klausimų? Norite sužinoti daugiau? Parašykite mums ir atsakysime
              kuo greičiau!
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Parašykite mums</h2>

                {status === "success" && (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 p-4 rounded-lg mb-6">
                    <CheckCircle className="h-5 w-5" />
                    <span>Jūsų žinutė sėkmingai išsiųsta! Atsakysime per 24 val.</span>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-lg mb-6">
                    <AlertCircle className="h-5 w-5" />
                    <span>Nepavyko išsiųsti žinutės. Bandykite dar kartą.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Vardas *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Jūsų vardas"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">El. paštas *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jusu@email.lt"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Tema *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Apie ką norite pasiteirauti?"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Žinutė *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Jūsų žinutė..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={status === "sending"}
                    className="bg-[#60988E] hover:bg-[#4e7d74] text-white flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {status === "sending" ? "Siunčiama..." : "Siųsti žinutę"}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#60988E]/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-[#60988E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">El. paštas</h3>
                    <a href="mailto:info@lazyfit.lt" className="text-[#60988E] hover:underline">
                      info@lazyfit.lt
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      Atsakome per 24 val.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#60988E]/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-[#60988E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Telefonas</h3>
                    <p className="text-gray-700">+370 600 00000</p>
                    <p className="text-sm text-gray-500 mt-1">
                      I-V 9:00 - 18:00
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#60988E]/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-[#60988E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Adresas</h3>
                    <p className="text-gray-700">Vilnius, Lietuva</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Dirbame nuotoliniu būdu
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-[#60988E] text-white">
                <h3 className="font-semibold text-lg mb-2">Dažnai užduodami klausimai</h3>
                <p className="text-white/80 text-sm mb-4">
                  Atsakymus į dažniausius klausimus rasite mūsų DUK skiltyje.
                </p>
                <Link
                  href="/#duk"
                  className="inline-block bg-white text-[#60988E] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                >
                  Peržiūrėti DUK
                </Link>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
