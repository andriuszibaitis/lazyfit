"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Edit,
  Save,
  AlertCircle,
  CreditCard,
  Calendar,
  Tag,
  Percent,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Membership = {
  id: string;
  name: string;
  planId: string;
  price: number;
  discountPercentage: number;
  duration: number;
  description: string | null;
  features: any;
  isActive: boolean;
  showOnHomepage?: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    users: number;
  };
};

export default function EditMembershipModal({
  membership,
}: {
  membership: Membership;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: membership.name,
    planId: membership.planId,
    price: String(membership.price),
    discountPercentage: String(membership.discountPercentage),
    duration: String(membership.duration),
    description: membership.description || "",
    features: Array.isArray(membership.features)
      ? membership.features.join("\n")
      : typeof membership.features === "object"
      ? JSON.stringify(membership.features, null, 2)
      : "",
    isActive: membership.isActive,
    showOnHomepage: membership.showOnHomepage || false,
  });

  useEffect(() => {
    setFormData({
      name: membership.name,
      planId: membership.planId,
      price: String(membership.price),
      discountPercentage: String(membership.discountPercentage),
      duration: String(membership.duration),
      description: membership.description || "",
      features: Array.isArray(membership.features)
        ? membership.features.join("\n")
        : typeof membership.features === "object"
        ? JSON.stringify(membership.features, null, 2)
        : "",
      isActive: membership.isActive,
      showOnHomepage: membership.showOnHomepage || false,
    });
  }, [membership]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (
        !formData.name ||
        !formData.planId ||
        !formData.price ||
        !formData.duration
      ) {
        setMessage({
          type: "error",
          text: "Užpildykite visus privalomus laukus",
        });
        setIsSubmitting(false);
        return;
      }

      const price = Number.parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        setMessage({
          type: "error",
          text: "Kaina turi būti teigiamas skaičius",
        });
        setIsSubmitting(false);
        return;
      }

      const discount = Number.parseInt(formData.discountPercentage);
      if (isNaN(discount) || discount < 0 || discount > 100) {
        setMessage({
          type: "error",
          text: "Nuolaida turi būti tarp 0 ir 100 procentų",
        });
        setIsSubmitting(false);
        return;
      }

      const duration = Number.parseInt(formData.duration);
      if (isNaN(duration) || duration <= 0) {
        setMessage({
          type: "error",
          text: "Trukmė turi būti teigiamas skaičius",
        });
        setIsSubmitting(false);
        return;
      }

      let features = [];
      if (formData.features.trim()) {
        try {
          features = JSON.parse(formData.features);
        } catch (e) {
          features = formData.features
            .split("\n")
            .filter((line) => line.trim() !== "");
        }
      }

      const response = await fetch(`/api/admin/memberships/${membership.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          planId: formData.planId,
          price: Number.parseFloat(formData.price),
          discountPercentage: Number.parseInt(formData.discountPercentage),
          duration: Number.parseInt(formData.duration),
          description: formData.description,
          features,
          isActive: formData.isActive,
          showOnHomepage: formData.showOnHomepage,
        }),
      });

      if (response.ok) {
        router.refresh();
        setIsOpen(false);
        setMessage({ type: "success", text: "Narystė sėkmingai atnaujinta" });
      } else {
        const errorData =
          (await response.json().catch(() => null)) || (await response.text());
        const errorMessage =
          typeof errorData === "string"
            ? errorData
            : errorData.message || "Įvyko klaida atnaujinant narystę";
        setMessage({ type: "error", text: errorMessage });
      }
    } catch (error) {
      console.error("Error updating membership:", error);
      setMessage({
        type: "error",
        text: `Klaida atnaujinant narystę: ${error}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center text-gray-700 hover:text-[#60988E]"
      >
        <Edit className="h-4 w-4 mr-1" />
        Redaguoti
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-[#60988E]" />
              Redaguoti narystę: {membership.name}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            {message && (
              <Alert
                className={`mb-4 ${
                  message.type === "success" ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <AlertCircle
                  className={
                    message.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                />
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Pavadinimas <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Pvz.: Mėnesio narystė"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="planId">
                  Plano ID <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="planId"
                    name="planId"
                    value={formData.planId}
                    onChange={handleChange}
                    placeholder="Pvz.: monthly, yearly, premium"
                    className="pl-10"
                    required
                  />
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  Unikalus identifikatorius, naudojamas sistemoje
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">
                    Kaina (€) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="pl-10"
                      required
                    />
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="discountPercentage">Nuolaida (%)</Label>
                  <div className="relative">
                    <Input
                      id="discountPercentage"
                      name="discountPercentage"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discountPercentage}
                      onChange={handleChange}
                      placeholder="0"
                      className="pl-10"
                    />
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">
                  Trukmė (dienomis) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="30"
                    className="pl-10"
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">
                  Tipinės reikšmės: 30 (mėnuo), 90 (3 mėnesiai), 365 (metai)
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Aprašymas</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Narystės aprašymas..."
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="features">Funkcijos/savybės</Label>
                <Textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="Kiekviena funkcija naujoje eilutėje..."
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Įveskite kiekvieną funkciją naujoje eilutėje arba JSON masyvą
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={handleSwitchChange("isActive")}
                />
                <Label htmlFor="isActive">Aktyvi narystė</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="showOnHomepage"
                  checked={formData.showOnHomepage}
                  onCheckedChange={handleSwitchChange("showOnHomepage")}
                />
                <Label htmlFor="showOnHomepage" className="flex items-center">
                  <Home className="h-4 w-4 mr-2 text-gray-500" />
                  Rodyti pagrindiniame puslapyje
                </Label>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto"
              >
                Atšaukti
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Išsaugoma..." : "Išsaugoti pakeitimus"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
