"use client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IconPicker from "./icon-picker";

interface AddMenuItemCheckboxProps {
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  section: string;
  onSectionChange: (section: string) => void;
  icon: string;
  onIconChange: (icon: string) => void;
}

export default function AddMenuItemCheckbox({
  isChecked,
  onCheckedChange,
  section,
  onSectionChange,
  icon,
  onIconChange,
}: AddMenuItemCheckboxProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="addToMenu"
          checked={isChecked}
          onCheckedChange={onCheckedChange}
        />
        <Label htmlFor="addToMenu">Pridėti į meniu</Label>
      </div>

      {isChecked && (
        <div className="grid gap-4 pl-6 pt-2">
          <div className="grid gap-2">
            <Label htmlFor="menuSection">Meniu sekcija</Label>
            <Select value={section} onValueChange={onSectionChange}>
              <SelectTrigger id="menuSection">
                <SelectValue placeholder="Pasirinkite meniu sekciją" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Pagrindinis</SelectItem>
                <SelectItem value="profile">Profilis</SelectItem>
                <SelectItem value="footer">Poraštė</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="menuIcon">Ikona</Label>
            <IconPicker value={icon} onChange={onIconChange} />
          </div>
        </div>
      )}
    </div>
  );
}
