"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Save, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import dynamic from "next/dynamic";
import AddMenuItemCheckbox from "./add-menu-item-checkbox";

const SimpleEditor = dynamic(() => import("@/app/components/sample-editor"), {
  ssr: false,
  loading: () => (
    <div className="p-4 text-center text-gray-500">
      Kraunamas redaktorius...
    </div>
  ),
});

interface Message {
  type: "success" | "error";
  text: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
}

interface MenuItem {
  id: string;
  title: string;
  path: string;
  section: string;
  icon: string;
}

interface EditPageModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  page: Page;
}

export default function EditPageModal({
  isOpen,
  setIsOpen,
  page,
}: EditPageModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>({});
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(false);

  const [formData, setFormData] = useState({
    title: page.title,
    slug: page.slug,
    content: page.content,
    isPublished: page.isPublished,
    addToMenu: false,
    menuSection: "main",
    menuIcon: "FileText",
    existingMenuItem: null as MenuItem | null,
  });

  useEffect(() => {
    const checkForMenuItem = async () => {
      if (!isOpen) return;

      try {
        setIsLoadingMenuItems(true);
        const menuResponse = await fetch("/api/menu");

        if (menuResponse.ok) {
          const data = await menuResponse.json();
          console.log("Gauti meniu elementai:", data);

          if (data && typeof data === "object") {
            let foundMenuItem = null;

            for (const section in data) {
              if (Array.isArray(data[section])) {
                const item = data[section].find(
                  (item: MenuItem) =>
                    item.path === `/dashboard/p/${page.slug}` ||
                    item.path === `/p/${page.slug}`
                );

                if (item) {
                  foundMenuItem = item;
                  break;
                }
              }
            }

            if (foundMenuItem) {
              setFormData((prev) => ({
                ...prev,
                addToMenu: true,
                menuSection: foundMenuItem.section,
                menuIcon: foundMenuItem.icon || "FileText",
                existingMenuItem: foundMenuItem,
              }));
            }
          } else {
            console.error(
              "Meniu elementų atsakymas nėra tinkamo formato:",
              data
            );
          }
        } else {
          console.error(
            "Klaida gaunant meniu elementus:",
            menuResponse.statusText
          );
        }
      } catch (error) {
        console.error("Klaida tikrinant meniu elementą:", error);
      } finally {
        setIsLoadingMenuItems(false);
      }
    };

    checkForMenuItem();
  }, [isOpen, page.slug]);

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

      const response = await fetch(`/api/admin/pages/${page.id}`, {
        method: "PATCH",
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
        if (formData.addToMenu) {
          if (formData.existingMenuItem) {
            await fetch(`/api/menu/${formData.existingMenuItem.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: formData.title,
                path: `/dashboard/p/${formData.slug}`,
                section: formData.menuSection,
                isActive: formData.isPublished,
                icon: formData.menuIcon,
              }),
            });
          } else {
            await fetch("/api/menu", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: formData.title,
                path: `/dashboard/p/${formData.slug}`,
                section: formData.menuSection,
                order: 0,
                isActive: formData.isPublished,
                icon: formData.menuIcon,
              }),
            });
          }
        } else if (formData.existingMenuItem) {
          await fetch(`/api/menu/${formData.existingMenuItem.id}`, {
            method: "DELETE",
          });
        }

        setMessage({ type: "success", text: "Puslapis sėkmingai atnaujintas" });
        router.refresh();

        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      } else {
        const error = await response.text();
        setMessage({
          type: "error",
          text: `Klaida atnaujinant puslapį: ${error}`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Klaida atnaujinant puslapį: ${error}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Redaguoti puslapį</DialogTitle>
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
                  message.type === "success" ? "text-green-600" : "text-red-600"
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
              <Label htmlFor="isPublished">Publikuoti</Label>
            </div>
          </div>

          {}
          <div className="border-t pt-4 mt-2">
            {isLoadingMenuItems ? (
              <div className="text-center py-2">
                Kraunama meniu informacija...
              </div>
            ) : (
              <AddMenuItemCheckbox
                isChecked={formData.addToMenu}
                onCheckedChange={handleAddToMenuChange}
                section={formData.menuSection}
                onSectionChange={handleMenuSectionChange}
                icon={formData.menuIcon}
                onIconChange={handleIconChange}
              />
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
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
              {isSubmitting ? "Saugoma..." : "Išsaugoti pakeitimus"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
