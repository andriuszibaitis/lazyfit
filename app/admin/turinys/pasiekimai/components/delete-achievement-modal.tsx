"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  achievementName: string;
}

export default function DeleteAchievementModal({
  isOpen,
  onClose,
  onConfirm,
  achievementName,
}: DeleteAchievementModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ištrinti pasiekimą</DialogTitle>
          <DialogDescription>
            Ar tikrai norite ištrinti pasiekimą &ldquo;{achievementName}&rdquo;?
            Šis veiksmas yra negrįžtamas ir pašalins visų vartotojų gautus šiuos pasiekimus.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Atšaukti
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Ištrinti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
