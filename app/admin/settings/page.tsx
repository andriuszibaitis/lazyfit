"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Globe,
  Mail,
  ShieldCheck,
  Save,
  CheckCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    siteName: "LazyFit",
    siteDescription: "Fitnes ir sveikatingumo platforma",
    contactEmail: "support@lazyfit.com",
    supportEmail: "info@lazyfit.lt",
    maintenanceMode: false,
    registrationEnabled: true,
  });

  const [seo, setSeo] = useState({
    metaTitle: "LazyFit - Fitnes ir sveikatingumo platforma",
    metaDescription:
      "LazyFit – jūsų asmeninis fitnes ir mitybos asistentas. Treniruočių programos, mitybos planai, kalorijų skaičiuoklė ir daugiau.",
    metaKeywords: "fitness, mityba, treniruotės, sveikata, sportas, LazyFit",
    ogImage: "",
  });

  const [email, setEmail] = useState({
    smtpHost: "smtp.hostinger.com",
    smtpPort: "465",
    smtpUser: "",
    smtpSecure: true,
    emailFrom: "LazyFit <autosp@gatsby.lt>",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="h-8 w-8 text-[#60988E]" />
          Sistemos nustatymai
        </h1>
        {saved && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Nustatymai išsaugoti</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Bendra
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            El. paštas
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Sauga
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Bendri nustatymai</h2>
            <div className="space-y-6 max-w-xl">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Svetainės pavadinimas</Label>
                <Input
                  id="siteName"
                  value={general.siteName}
                  onChange={(e) =>
                    setGeneral({ ...general, siteName: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="siteDesc">Svetainės aprašymas</Label>
                <Textarea
                  id="siteDesc"
                  value={general.siteDescription}
                  onChange={(e) =>
                    setGeneral({ ...general, siteDescription: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactEmail">Kontaktinis el. paštas</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={general.contactEmail}
                  onChange={(e) =>
                    setGeneral({ ...general, contactEmail: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supportEmail">Palaikymo el. paštas</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={general.supportEmail}
                  onChange={(e) =>
                    setGeneral({ ...general, supportEmail: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between py-3 border-t">
                <div>
                  <Label>Registracija</Label>
                  <p className="text-xs text-gray-500">
                    Leisti naujų vartotojų registraciją
                  </p>
                </div>
                <Switch
                  checked={general.registrationEnabled}
                  onCheckedChange={(v) =>
                    setGeneral({ ...general, registrationEnabled: v })
                  }
                />
              </div>
              <div className="flex items-center justify-between py-3 border-t">
                <div>
                  <Label>Priežiūros režimas</Label>
                  <p className="text-xs text-gray-500">
                    Rodyti priežiūros pranešimą lankytojams
                  </p>
                </div>
                <Switch
                  checked={general.maintenanceMode}
                  onCheckedChange={(v) =>
                    setGeneral({ ...general, maintenanceMode: v })
                  }
                />
              </div>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Išsaugoti
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">SEO nustatymai</h2>
            <div className="space-y-6 max-w-xl">
              <div className="grid gap-2">
                <Label htmlFor="metaTitle">Meta pavadinimas</Label>
                <Input
                  id="metaTitle"
                  value={seo.metaTitle}
                  onChange={(e) =>
                    setSeo({ ...seo, metaTitle: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  {seo.metaTitle.length}/60 simbolių
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaDesc">Meta aprašymas</Label>
                <Textarea
                  id="metaDesc"
                  value={seo.metaDescription}
                  onChange={(e) =>
                    setSeo({ ...seo, metaDescription: e.target.value })
                  }
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  {seo.metaDescription.length}/160 simbolių
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaKeywords">Raktiniai žodžiai</Label>
                <Input
                  id="metaKeywords"
                  value={seo.metaKeywords}
                  onChange={(e) =>
                    setSeo({ ...seo, metaKeywords: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  Atskirkite kableliais
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ogImage">OG paveiksliukas URL</Label>
                <Input
                  id="ogImage"
                  value={seo.ogImage}
                  onChange={(e) =>
                    setSeo({ ...seo, ogImage: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Išsaugoti
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">El. pašto nustatymai</h2>
            <div className="space-y-6 max-w-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="smtpHost">SMTP serveris</Label>
                  <Input
                    id="smtpHost"
                    value={email.smtpHost}
                    onChange={(e) =>
                      setEmail({ ...email, smtpHost: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="smtpPort">Portas</Label>
                  <Input
                    id="smtpPort"
                    value={email.smtpPort}
                    onChange={(e) =>
                      setEmail({ ...email, smtpPort: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtpUser">Vartotojo vardas</Label>
                <Input
                  id="smtpUser"
                  value={email.smtpUser}
                  onChange={(e) =>
                    setEmail({ ...email, smtpUser: e.target.value })
                  }
                  placeholder="autosp@gatsby.lt"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emailFrom">Siuntėjo adresas</Label>
                <Input
                  id="emailFrom"
                  value={email.emailFrom}
                  onChange={(e) =>
                    setEmail({ ...email, emailFrom: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center justify-between py-3 border-t">
                <div>
                  <Label>SSL/TLS</Label>
                  <p className="text-xs text-gray-500">
                    Naudoti saugų ryšį
                  </p>
                </div>
                <Switch
                  checked={email.smtpSecure}
                  onCheckedChange={(v) =>
                    setEmail({ ...email, smtpSecure: v })
                  }
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Išsaugoti
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Siųsti testinį laišką
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Saugos nustatymai</h2>
            <div className="space-y-6 max-w-xl">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <Label>Dviejų faktorių autentifikacija</Label>
                  <p className="text-xs text-gray-500">
                    Reikalauti 2FA admin vartotojams (planuojama)
                  </p>
                </div>
                <Switch disabled />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <Label>Sesijos trukmė</Label>
                  <p className="text-xs text-gray-500">
                    Maksimali sesijos trukmė dienomis
                  </p>
                </div>
                <Input
                  type="number"
                  defaultValue={30}
                  className="w-20"
                  min={1}
                  max={365}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <Label>Prisijungimo bandymai</Label>
                  <p className="text-xs text-gray-500">
                    Maksimalus nesėkmingų bandymų skaičius
                  </p>
                </div>
                <Input
                  type="number"
                  defaultValue={5}
                  className="w-20"
                  min={3}
                  max={10}
                />
              </div>
              <a
                href="/admin/roles"
                className="flex items-center gap-2 text-[#60988E] hover:underline text-sm"
              >
                <ShieldCheck className="h-4 w-4" />
                Peržiūrėti rolių valdymą
              </a>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Išsaugoti
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
