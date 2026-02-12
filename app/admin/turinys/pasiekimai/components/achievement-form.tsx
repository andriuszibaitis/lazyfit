"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, Trophy, X } from "lucide-react";

interface AchievementFormProps {
  initialData?: {
    id: string;
    code: string;
    title: string;
    description: string;
    iconUrl: string | null;
    iconSvg: string | null;
    trigger: string | null;
    triggerValue: number | null;
    order: number;
    isActive: boolean;
  };
  isEditing?: boolean;
}

const triggerOptions = [
  { value: "first_measurement", label: "Pirmas matavimas", hasValue: false },
  { value: "first_workout", label: "Pirma treniruotė", hasValue: false },
  { value: "first_photo", label: "Pirma progreso nuotrauka", hasValue: false },
  { value: "workout_streak", label: "Treniruočių serija", hasValue: true },
  { value: "total_workouts", label: "Iš viso treniruočių", hasValue: true },
  { value: "nutrition_streak", label: "Mitybos dienoraščio serija", hasValue: true },
  { value: "half_goal", label: "Pusė svorio tikslo", hasValue: false },
  { value: "plan_completed", label: "Planas užbaigtas", hasValue: false },
  { value: "weekend_workout", label: "Savaitgalio treniruotė", hasValue: false },
  { value: "social_action", label: "Socialinis veiksmas", hasValue: false },
];


export default function AchievementForm({ initialData, isEditing = false }: AchievementFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    iconUrl: initialData?.iconUrl || "",
    iconSvg: initialData?.iconSvg || "",
    trigger: initialData?.trigger || "",
    triggerValue: initialData?.triggerValue || null,
    order: initialData?.order || 0,
    isActive: initialData?.isActive ?? true,
  });

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(initialData?.iconUrl || null);
  const [iconMode, setIconMode] = useState<"upload" | "svg">(initialData?.iconSvg ? "svg" : "upload");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedTrigger = triggerOptions.find((t) => t.value === formData.trigger);

  const handleInputChange = (field: string, value: string | number | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an SVG
      if (!file.type.includes("svg") && !file.type.includes("image")) {
        setErrors((prev) => ({ ...prev, icon: "Tik SVG arba paveikslėlio failai leidžiami" }));
        return;
      }

      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeIcon = () => {
    setIconFile(null);
    setIconPreview(null);
    setFormData((prev) => ({ ...prev, iconUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Kodas yra privalomas";
    } else if (!/^[a-z_]+$/.test(formData.code)) {
      newErrors.code = "Kodas turi būti mažosiomis raidėmis su pabraukimais";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Pavadinimas yra privalomas";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Aprašymas yra privalomas";
    }

    if (selectedTrigger?.hasValue && !formData.triggerValue) {
      newErrors.triggerValue = "Reikšmė yra privaloma šiam tikslui";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let iconUrl = formData.iconUrl;

      // Upload icon if new file selected
      if (iconFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", iconFile);
        uploadFormData.append("folder", "achievements");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload icon");
        }

        const uploadData = await uploadResponse.json();
        iconUrl = uploadData.url;
      }

      const payload = {
        code: formData.code,
        title: formData.title,
        description: formData.description,
        iconUrl: iconMode === "upload" ? (iconUrl || null) : null,
        iconSvg: iconMode === "svg" ? (formData.iconSvg || null) : null,
        trigger: formData.trigger || null,
        triggerValue: selectedTrigger?.hasValue ? formData.triggerValue : null,
        order: formData.order,
        isActive: formData.isActive,
      };

      const url = isEditing
        ? `/api/admin/achievements/${initialData?.id}`
        : "/api/admin/achievements";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save achievement");
      }

      router.push("/admin/turinys/pasiekimai");
      router.refresh();
    } catch (error) {
      console.error("Error saving achievement:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : "Nepavyko išsaugoti pasiekimo",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pagrindinė informacija</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Kodas *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value.toLowerCase().replace(/[^a-z_]/g, ""))}
                    placeholder="pirmas_pasiekimas"
                    disabled={isEditing}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-500">{errors.code}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Unikalus kodas (mažosios raidės ir pabraukimai)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Tvarka</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 0)}
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Pavadinimas *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Centimetrų naikintojas"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Aprašymas *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Aprašykite, kaip gauti šį pasiekimą..."
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tikslas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tikslo tipas</Label>
                <Select
                  value={formData.trigger}
                  onValueChange={(value) => handleInputChange("trigger", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pasirinkite tikslo tipą" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenustatytas</SelectItem>
                    {triggerOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Pasirinkite, kada vartotojas gaus šį pasiekimą
                </p>
              </div>

              {selectedTrigger?.hasValue && (
                <div className="space-y-2">
                  <Label htmlFor="triggerValue">Tikslo reikšmė *</Label>
                  <Input
                    id="triggerValue"
                    type="number"
                    value={formData.triggerValue || ""}
                    onChange={(e) => handleInputChange("triggerValue", parseInt(e.target.value) || null)}
                    placeholder="30"
                    min={1}
                  />
                  {errors.triggerValue && (
                    <p className="text-sm text-red-500">{errors.triggerValue}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Pvz.: 30 dienų serija arba 100 treniruočių
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ikona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Icon preview */}
              <div className="flex justify-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center relative overflow-hidden bg-[#60988E]"
                >
                  {iconMode === "svg" && formData.iconSvg ? (
                    <div
                      className="w-12 h-12 flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: formData.iconSvg }}
                    />
                  ) : iconPreview ? (
                    <>
                      <Image
                        src={iconPreview}
                        alt="Icon preview"
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeIcon}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <Trophy className="w-12 h-12 text-white" />
                  )}
                </div>
              </div>

              {/* Mode selector */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={iconMode === "upload" ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 ${iconMode === "upload" ? "bg-[#60988E] hover:bg-[#4e7d75]" : ""}`}
                  onClick={() => setIconMode("upload")}
                >
                  Įkelti failą
                </Button>
                <Button
                  type="button"
                  variant={iconMode === "svg" ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 ${iconMode === "svg" ? "bg-[#60988E] hover:bg-[#4e7d75]" : ""}`}
                  onClick={() => setIconMode("svg")}
                >
                  SVG kodas
                </Button>
              </div>

              {iconMode === "upload" ? (
                /* Upload button */
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".svg,image/*"
                    onChange={handleIconChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Įkelti SVG ikoną
                  </Button>
                  {errors.icon && (
                    <p className="text-sm text-red-500">{errors.icon}</p>
                  )}
                  <p className="text-xs text-gray-500 text-center">
                    Rekomenduojamas formatas: SVG
                  </p>
                </div>
              ) : (
                /* SVG code input */
                <div className="space-y-2">
                  <Label htmlFor="iconSvg">SVG kodas</Label>
                  <Textarea
                    id="iconSvg"
                    value={formData.iconSvg}
                    onChange={(e) => handleInputChange("iconSvg", e.target.value)}
                    placeholder='<svg viewBox="0 0 24 24">...</svg>'
                    rows={6}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-gray-500">
                    Įklijuokite SVG kodą tiesiogiai
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statusas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Aktyvus</Label>
                  <p className="text-xs text-gray-500">
                    Rodomas vartotojams
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            {errors.submit && (
              <p className="text-sm text-red-500 text-center">{errors.submit}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-[#60988E] hover:bg-[#4e7d75]"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? "Atnaujinti pasiekimą" : "Sukurti pasiekimą"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/admin/turinys/pasiekimai")}
            >
              Atšaukti
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
