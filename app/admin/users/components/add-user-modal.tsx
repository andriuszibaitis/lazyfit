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
import { UserPlus, Save, AlertCircle, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Membership {
  id: string;
  name: string;
  planId: string;
  duration: number;
  isActive: boolean;
}

export default function AddUserModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoadingMemberships, setIsLoadingMemberships] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    membershipStatus: "inactive",
    planId: "",
    membershipExpiry: "",
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

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "user",
      membershipStatus: "inactive",
      planId: "",
      membershipExpiry: "",
    });
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          membershipStatus: formData.membershipStatus,
          planId: formData.planId || null,
          membershipExpiry: formData.membershipExpiry
            ? new Date(formData.membershipExpiry)
            : null,
        }),
      });

      if (response.ok) {
        router.refresh();
        setIsOpen(false);

        resetForm();
      } else {
        const error = await response.text();
        setMessage({
          type: "error",
          text: `Klaida kuriant vartotoją: ${error}`,
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: `Klaida kuriant vartotoją: ${error}` });
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
        <UserPlus className="h-4 w-4 mr-2" />
        Pridėti vartotoją
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pridėti naują vartotoją</DialogTitle>
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
                  Vardas <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">
                  El. paštas <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">
                  Rolė <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
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

              {}
              <div className="border-t pt-4 mt-2">
                <h3 className="font-medium text-gray-900 mb-2">
                  Narystės informacija
                </h3>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="membershipStatus">Statusas</Label>
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

              <div className="grid gap-2">
                <Label htmlFor="planId">Narystė</Label>
                <Select
                  value={formData.planId}
                  onValueChange={handlePlanIdChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pasirinkite narystę" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nepriskirta</SelectItem>
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
              </div>

              <div className="grid gap-2">
                <Label htmlFor="membershipExpiry">Galiojimas iki</Label>
                <div className="relative">
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

              <div className="text-sm text-gray-500 mt-2">
                <p>
                  Pastaba: Automatiškai sugeneruotas laikinas slaptažodis bus
                  išsiųstas nurodytu el. pašto adresu.
                </p>
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
                {isSubmitting ? "Kuriama..." : "Sukurti vartotoją"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
