"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { DeleteNutritionPlanModal } from "./delete-nutrition-plan-modal";
import { Badge } from "@/components/ui/badge";

interface NutritionPlan {
  id: string;
  name: string;
  gender: string;
  membershipId: string | null;
  membership?: {
    name: string;
  };
  days: any[];
  isPublished: boolean;
  createdAt: string;
}

export function NutritionPlansList({ query }: { query: string }) {
  const router = useRouter();
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/admin/nutrition-plans?q=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
        } else {
          console.error("Failed to fetch nutrition plans");
        }
      } catch (error) {
        console.error("Error fetching nutrition plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [query]);

  const handleDelete = (id: string) => {
    setPlanToDelete(id);
    setDeleteModalOpen(true);
  };

  const onDeleteSuccess = () => {
    setPlans(plans.filter((plan) => plan.id !== planToDelete));
    router.refresh();
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "male":
        return "Vyrams";
      case "female":
        return "Moterims";
      default:
        return "Visiems";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center p-10 border rounded-lg">
        <h3 className="text-lg font-medium">Nerasta mitybos planų</h3>
        <p className="text-muted-foreground mt-2">
          {query
            ? `Nerasta mitybos planų pagal paiešką "${query}"`
            : "Sukurkite naują mitybos planą paspaudę mygtuką viršuje"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pavadinimas</TableHead>
              <TableHead>Lytis</TableHead>
              <TableHead>Narystė</TableHead>
              <TableHead>Dienų skaičius</TableHead>
              <TableHead>Statusas</TableHead>
              <TableHead>Sukurta</TableHead>
              <TableHead className="text-right">Veiksmai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>{getGenderLabel(plan.gender)}</TableCell>
                <TableCell>{plan.membership?.name || "Nepriskirta"}</TableCell>
                <TableCell>{plan.days.length}</TableCell>
                <TableCell>
                  <Badge variant={plan.isPublished ? "default" : "secondary"}>
                    {plan.isPublished ? "Publikuota" : "Juodraštis"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(plan.createdAt).toLocaleDateString("lt-LT")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/turinys/mityba/${plan.id}/edit`}>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteNutritionPlanModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        planId={planToDelete}
        onSuccess={onDeleteSuccess}
      />
    </>
  );
}
