"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, AlertTriangle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Membership {
  id: string;
  name: string;
  planId: string;
  _count?: {
    users: number;
  };
}

interface DeleteMembershipModalProps {
  membership: Membership;
}

export default function DeleteMembershipModal({
  membership,
}: DeleteMembershipModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const hasUsers = membership._count && membership._count.users > 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/memberships/${membership.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Narystė sėkmingai ištrinta.",
        });

        setTimeout(() => {
          setIsOpen(false);
          router.refresh();
        }, 2000);
      } else {
        const error = await response.text();
        setMessage({
          type: "error",
          text: `Klaida trinant narystę: ${error}`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Klaida trinant narystę: ${error}`,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-red-600 hover:text-red-900 flex items-center"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        <span className="sm:inline hidden">Ištrinti</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md max-w-[95vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Ištrinti narystę
            </DialogTitle>
          </DialogHeader>

          {message ? (
            <Alert
              className={`${
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
          ) : (
            <>
              <div className="py-4">
                <p className="text-gray-700 mb-4">
                  Ar tikrai norite ištrinti narystę{" "}
                  <span className="font-semibold">{membership.name}</span>?
                </p>

                {hasUsers && (
                  <Alert className="bg-amber-50 border-amber-200 mb-4">
                    <Users className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      Šią narystę naudoja {membership._count?.users} vartotojai.
                      Ištrynus narystę, šie vartotojai praras savo narystės
                      statusą.
                    </AlertDescription>
                  </Alert>
                )}

                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Šis veiksmas negrįžtamas. Narystės duomenys bus visiškai
                    ištrinti.
                  </AlertDescription>
                </Alert>
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
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                >
                  {isDeleting ? "Trinama..." : "Ištrinti narystę"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
