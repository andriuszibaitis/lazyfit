"use client";

import type React from "react";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Plus, Save, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import dynamic from "next/dynamic";

// Importuojame naują komponentą ir atnaujinkime formą
import AddMenuItemCheckbox from "./add-menu-item-checkbox";

// Dinamiškai importuojame paprastą redaktorių vietoj CKEditor
const SimpleEditor = dynamic(() => import("@/app/components/sample-editor"), {
  ssr: false,
  loading: () => (
    <div className="p-4 text-center text-gray-500">
      Kraunamas redaktorius...
    </div>
  ),
});

export default function AddPageModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Pridėkime naują būseną formData objekte
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    isPublished: false,
    addToMenu: true,
    menuSection: "main",
    menuIcon: "FileText",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublished: checked }));
  };

  // Pridėkime naujus valdiklius
  const handleAddToMenuChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, addToMenu: checked }));
  };

  const handleMenuSectionChange = (section: string) => {
    setFormData((prev) => ({ ...prev, menuSection: section }));
  };

  const handleIconChange = (icon: string) => {
    setFormData((prev) => ({ ...prev, menuIcon: icon }));
  };

  const generateSlug = () => {
    if (!formData.title) return;

    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    setFormData((prev) => ({ ...prev, slug }));
  };

  // Atnaujinkime resetForm funkciją
  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      isPublished: false,
      addToMenu: true,
      menuSection: "main",
      menuIcon: "FileText",
    });
    setMessage(null);
  };

  // Atnaujinkime handleSubmit funkciją, kad naudotų naują kelią
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!formData.title || !formData.slug) {
        setMessage({ type: "error", text: "Pavadinimas ir URL yra privalomi" });
        setIsSubmitting(false);
        return;
      }

      console.log("Kuriamas puslapis:", formData);

      // 1. Pirma sukuriame puslapį
      const response = await fetch("/api/admin/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          isPublished: formData.isPublished,
        }),
      });

      if (response.ok) {
        const pageData = await response.json();
        console.log("Puslapis sukurtas:", pageData);

        // 2. Jei reikia, sukuriame meniu elementą
        if (formData.addToMenu) {
          console.log("Kuriamas meniu elementas:", {
            title: formData.title,
            path: `/dashboard/p/${formData.slug}`, // Atnaujintas kelias
            section: formData.menuSection,
            isActive: formData.isPublished,
            icon: formData.menuIcon,
          });

          const menuResponse = await fetch("/api/menu", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: formData.title,
              path: `/dashboard/p/${formData.slug}`, // Atnaujintas kelias
              section: formData.menuSection,
              order: 0, // Bus surikiuota pagal sukūrimo laiką
              isActive: formData.isPublished, // Aktyvus tik jei puslapis publikuotas
              icon: formData.menuIcon, // Naudojame pasirinktą ikoną
            }),
          });

          if (menuResponse.ok) {
            const menuData = await menuResponse.json();
            console.log("Meniu elementas sukurtas:", menuData);
          } else {
            console.error(
              "Nepavyko sukurti meniu elemento:",
              await menuResponse.text()
            );
          }
        }

        setMessage({ type: "success", text: "Puslapis sėkmingai sukurtas" });
        setTimeout(() => {
          router.refresh();
          setIsOpen(false);
          resetForm();
        }, 1500);
      } else {
        const errorData = await response.text();
        setMessage({
          type: "error",
          text: `Klaida kuriant puslapį: ${errorData}`,
        });
      }
    } catch (error) {
      console.error("Error creating page:", error);
      setMessage({ type: "error", text: `Klaida kuriant puslapį: ${error}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsOpen(open);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-[#60988E] text-white hover:bg-opacity-90 flex items-center w-full sm:w-auto"
      >
        <Plus className="h-4 w-4 mr-2" />
        Pridėti puslapį
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pridėti naują puslapį</DialogTitle>
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
                <Label htmlFor="title">
                  Pavadinimas <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={() => !formData.slug && generateSlug()}
                  placeholder="Puslapio pavadinimas"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">
                  URL <span className="text-red-500">*</span>
                </Label>
                <div className="flex">
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="puslapio-url"
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSlug}
                    className="ml-2"
                    disabled={!formData.title}
                  >
                    Generuoti
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Puslapio URL bus: /dashboard/p/{formData.slug}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Turinys</Label>
                <div className="min-h-[300px] border rounded-md">
                  {isOpen && (
                    <SimpleEditor
                      value={formData.content}
                      onChange={handleContentChange}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isPublished">Publikuoti iš karto</Label>
              </div>
            </div>

            {/* Pridėkime naują komponentą į formą, prieš DialogFooter */}
            <div className="border-t pt-4 mt-2">
              <AddMenuItemCheckbox
                isChecked={formData.addToMenu}
                onCheckedChange={handleAddToMenuChange}
                section={formData.menuSection}
                onSectionChange={handleMenuSectionChange}
                icon={formData.menuIcon}
                onIconChange={handleIconChange}
              />
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
                {isSubmitting ? "Kuriama..." : "Sukurti puslapį"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
