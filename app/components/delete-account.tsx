"use client";

import { useState } from "react";
import Button from "./button";
import Modal from "./modal";

interface DeleteAccountProps {
  onDelete?: () => void;
  userEmail?: string;
  className?: string;
}

export default function DeleteAccount({
  onDelete,
  userEmail,
  className = ""
}: DeleteAccountProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleDeleteClick = async () => {
    setShowConfirmDialog(true);

    // Send verification code
    if (!codeSent) {
      setSendingCode(true);
      try {
        console.log("Sending request to /api/user/delete-code");
        const response = await fetch("/api/user/delete-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        console.log("Response status:", response.status);

        if (response.ok) {
          setCodeSent(true);
          const result = await response.json();
          console.log("Verification code:", result.code);
        } else {
          const errorText = await response.text();
          console.error("Failed to send code:", response.status, errorText);
          alert(`Klaida siųsiant kodą: ${response.status}`);
        }
      } catch (error) {
        console.error("Error sending code:", error);
        alert(`Klaida: ${error}`);
      } finally {
        setSendingCode(false);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmText.trim()) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete?.();
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirmDialog(false);
      setConfirmText("");
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setConfirmText("");
    setCodeSent(false);
  };

  return (
    <>
      <div className={`border border-gray-200 rounded-lg p-6 bg-white font-outfit ${className}`}>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ištrinti paskyrą
          </h3>
          <div className="text-sm text-gray-700 mb-4 space-y-2">
            <p>
              Ištrynę paskyrą jūs iš karto prarasite prieigą prie asmeninės paskyros.
              Jei turite klausimų, rašykite mums{" "}
              <a href="mailto:info@lazyfit.lt" className="underline font-medium">
                info@lazyfit.lt
              </a>
            </p>
            <p className="font-medium">
              Šis veiksmas yra negrįžtamas ir visi jūsų duomenys bus pašalinti.
            </p>
          </div>

          <Button
            onClick={handleDeleteClick}
            variant="danger-outline"
            size="lg"
          >
            Trinti paskyrą
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showConfirmDialog}
        onClose={handleCancel}
        title="Uždaryti paskyrą"
        variant="delete"
        confirmText="Uždaryti paskyrą"
        cancelText="Atšaukti"
        onConfirm={handleConfirmDelete}
        confirmDisabled={!confirmText.trim()}
        isLoading={isDeleting}
      >
        <p className="text-gray-600 mb-4">
          Šis veiksmas yra negrįžtamas. Visa jūsų informacija, pasiekimai
          ir kt. bus visiškai ištrinta. Tai neturi jokios jūsų galimybei ateityje
          iš naujo sukurti visiškai naują paskyrą.
        </p>

        <div>
          <label className="text-sm text-gray-700 mb-2 block">
            Įrašyk kodą kurį mes išsiuntėme į {userEmail || "jūsų el. paštą"}
          </label>


          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Įrašyk kodą"
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={sendingCode}
          />
        </div>
      </Modal>
    </>
  );
}