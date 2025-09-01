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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Edit, Save, AlertCircle, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: string;
  provider: string | null;
  accounts: { provider: string }[];
  membershipStatus?: string | null;
  planId?: string | null;
  membershipExpiry?: Date | null;
}

interface Membership {
  id: string;
  name: string;
  planId: string;
  duration: number;
  isActive: boolean;
}

interface UserEditModalProps {
  user: User;
}

export default function UserEditModal({ user }: UserEditModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoadingMemberships, setIsLoadingMemberships] = useState(false);

  const isGoogleUser =
    user.provider === "google" ||
    user.accounts.some((account) => account.provider === "google");

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    role: user.role,
    emailVerified: !!user.emailVerified,
    membershipStatus: user.membershipStatus || "inactive",
    planId: user.planId || "",
    membershipExpiry: user.membershipExpiry
      ? new Date(user.membershipExpiry).toISOString().split("T")[0]
      : "",
  });

  useEffect(() => {
    const fetchMemberships = async () => {
      setIsLoadingMemberships(true);
      try {
        const response = await fetch("/api/admin/memberships");
        if (response.ok) {
          const data = await response.json();
          setMemberships(data);
        }
      } catch (error) {
        console.error("Failed to fetch memberships:", error);
      } finally {
        setIsLoadingMemberships(false);
      }
    };

    if (isOpen) {
      fetchMemberships();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleMembershipStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, membershipStatus: value }));
  };

  const handlePlanIdChange = (value: string) => {
    setFormData((prev) => {
      if (value) {
        const selectedMembership = memberships.find((m) => m.planId === value);
        if (selectedMembership) {
          const expiryDate = new Date();
          expiryDate.setDate(
            expiryDate.getDate() + selectedMembership.duration
          );

          return {
            ...prev,
            planId: value,
            membershipStatus: "active",
            membershipExpiry: expiryDate.toISOString().split("T")[0],
          };
        }
      }

      return {
        ...prev,
        planId: value,
      };
    });
  };

  const handleVerifiedChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, emailVerified: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          emailVerified: formData.emailVerified,
          membershipStatus: formData.membershipStatus,
          planId: formData.planId || null,
          membershipExpiry: formData.membershipExpiry
            ? new Date(formData.membershipExpiry)
            : null,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Vartotojo duomenys sėkmingai atnaujinti",
        });
        router.refresh();

        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      } else {
        const error = await response.text();
        setMessage({
          type: "error",
          text: `Klaida atnaujinant vartotoją: ${error}`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Klaida atnaujinant vartotoją: ${error}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-indigo-600 hover:text-indigo-900 flex items-center"
      >
        <Edit className="h-4 w-4 mr-1" />
        <span className="sm:inline hidden">Redaguoti</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center flex-wrap gap-2">
              <span>Redaguoti vartotoją</span>
              {isGoogleUser && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <Image
                    src="/images/google-icon.png"
                    alt="Google"
                    width={14}
                    height={14}
                    className="mr-1"
                  />
                  Google vartotojas
                </span>
              )}
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
              {}
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="name" className="sm:text-right">
                  Vardas
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="sm:col-span-3"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="email" className="sm:text-right">
                  El. paštas
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="sm:col-span-3"
                  disabled={isGoogleUser}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="role" className="sm:text-right">
                  Rolė
                </Label>
                <div className="sm:col-span-3">
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pasirinkite rolę" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Vartotojas</SelectItem>
                      <SelectItem value="business">Verslo paskyra</SelectItem>
                      <SelectItem value="admin">Administratorius</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="emailVerified" className="sm:text-right">
                  Patvirtintas
                </Label>
                <div className="sm:col-span-3 flex items-center space-x-2">
                  <Switch
                    id="emailVerified"
                    checked={formData.emailVerified || isGoogleUser}
                    onCheckedChange={handleVerifiedChange}
                    disabled={isGoogleUser}
                  />
                  <Label htmlFor="emailVerified">
                    {formData.emailVerified || isGoogleUser ? "Taip" : "Ne"}
                  </Label>
                  {isGoogleUser && (
                    <span className="text-xs text-gray-500 italic">
                      (Google vartotojai visada patvirtinti)
                    </span>
                  )}
                </div>
              </div>

              {}
              <div className="border-t pt-4 mt-2">
                <h3 className="font-medium text-gray-900 mb-2">
                  Narystės informacija
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="membershipStatus" className="sm:text-right">
                  Statusas
                </Label>
                <div className="sm:col-span-3">
                  <Select
                    value={formData.membershipStatus}
                    onValueChange={handleMembershipStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pasirinkite statusą" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktyvi</SelectItem>
                      <SelectItem value="inactive">Neaktyvi</SelectItem>
                      <SelectItem value="pending">Laukiama</SelectItem>
                      <SelectItem value="expired">Pasibaigusi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="planId" className="sm:text-right">
                  Narystė
                </Label>
                <div className="sm:col-span-3">
                  <Select
                    value={formData.planId}
                    onValueChange={handlePlanIdChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pasirinkite narystę" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Nepriskirta</SelectItem>
                      {isLoadingMemberships ? (
                        <SelectItem value="loading" disabled>
                          Kraunama...
                        </SelectItem>
                      ) : (
                        memberships
                          .filter((m) => m.isActive)
                          .map((membership) => (
                            <SelectItem
                              key={membership.planId}
                              value={membership.planId}
                            >
                              {membership.name}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                  {formData.planId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Plano ID: {formData.planId}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="membershipExpiry" className="sm:text-right">
                  Galiojimas iki
                </Label>
                <div className="sm:col-span-3 relative">
                  <Input
                    id="membershipExpiry"
                    name="membershipExpiry"
                    type="date"
                    value={formData.membershipExpiry}
                    onChange={handleChange}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
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
                {isSubmitting ? "Išsaugoma..." : "Išsaugoti"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
