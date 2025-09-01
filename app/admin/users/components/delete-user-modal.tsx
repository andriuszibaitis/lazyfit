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
import { Trash2, AlertCircle, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "next-auth/react";

interface DeleteUserModalProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export default function DeleteUserModal({ user }: DeleteUserModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isSelf = session?.user.id === user.id;

  const handleDelete = async () => {
    if (isSelf) {
      setMessage({
        type: "error",
        text: "Negalite ištrinti savo paskyros. Kreipkitės į kitą administratorių.",
      });
      return;
    }

    setIsDeleting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Vartotojas sėkmingai ištrintas.",
        });

        setTimeout(() => {
          setIsOpen(false);
          router.refresh();
        }, 2000);
      } else {
        const error = await response.text();
        setMessage({
          type: "error",
          text: `Klaida trinant vartotoją: ${error}`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Klaida trinant vartotoją: ${error}`,
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
        disabled={isSelf}
        title={
          isSelf ? "Negalite ištrinti savo paskyros" : "Ištrinti vartotoją"
        }
      >
        <Trash2 className="h-4 w-4 mr-1" />
        <span className="sm:inline hidden">Ištrinti</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md max-w-[95vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Ištrinti vartotoją
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
                  Ar tikrai norite ištrinti vartotoją{" "}
                  <span className="font-semibold">
                    {user.name || user.email}
                  </span>
                  ?
                </p>
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Šis veiksmas negrįžtamas. Vartotojo duomenys bus visiškai
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
                  disabled={isDeleting || isSelf}
                  className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                >
                  {isDeleting ? "Trinama..." : "Ištrinti vartotoją"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
