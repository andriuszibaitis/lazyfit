import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User, Briefcase } from "lucide-react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roles = [
  {
    id: "admin",
    name: "Administratorius",
    icon: ShieldCheck,
    color: "bg-red-100 text-red-800",
    permissions: [
      "Pilna prieiga prie admin panelės",
      "Vartotojų valdymas (kūrimas, redagavimas, šalinimas)",
      "Narysčių valdymas",
      "Turinio kūrimas ir redagavimas (treniruotės, mitybos planai, kursai)",
      "Maisto produktų duomenų bazės valdymas",
      "El. pašto šablonų redagavimas",
      "Puslapių ir meniu valdymas",
      "Klientų klausimų peržiūra ir atsakymas",
      "Statistikos ir žurnalų peržiūra",
      "Sistemos nustatymų keitimas",
    ],
  },
  {
    id: "user",
    name: "Vartotojas",
    icon: User,
    color: "bg-blue-100 text-blue-800",
    permissions: [
      "Prieiga prie asmeninio dashboard",
      "Narystės turinio peržiūra (pagal narystės planą)",
      "Treniruočių programų peržiūra ir naudojimas",
      "Mitybos planų peržiūra ir asmeninių planų kūrimas",
      "Kalorijų skaičiuoklė ir valgių sekimas",
      "Kūno matmenų ir progreso nuotraukų įvedimas",
      "Edukacinių kursų peržiūra",
      "Klausimų pateikimas palaikymo komandai",
      "Asmeninės paskyros valdymas",
    ],
  },
  {
    id: "business",
    name: "Verslo partneris",
    icon: Briefcase,
    color: "bg-green-100 text-green-800",
    permissions: [
      "Visos vartotojo teisės",
      "Prieiga prie verslo dashboard (planuojama)",
      "Klientų valdymas (planuojama)",
      "Statistikos peržiūra (planuojama)",
      "Pasiūlymų kūrimas (planuojama)",
    ],
  },
];

async function getRoleCounts() {
  try {
    const counts = await prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    });
    const map: Record<string, number> = {};
    for (const c of counts) {
      map[c.role] = c._count.role;
    }
    return map;
  } catch {
    return {};
  } finally {
    await prisma.$disconnect();
  }
}

export default async function RolesPage() {
  const roleCounts = await getRoleCounts();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Rolių valdymas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card key={role.id} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <Icon className="h-6 w-6 text-[#60988E]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{role.name}</h3>
                  <Badge className={role.color}>{role.id}</Badge>
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">
                {roleCounts[role.id] || 0}
              </p>
              <p className="text-sm text-gray-500">vartotojų</p>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Rolių teisės</h2>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium w-48">Rolė</TableHead>
                <TableHead className="font-medium">Teisės ir leidimai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[#60988E]" />
                        <span className="font-medium">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ul className="space-y-1">
                        {role.permissions.map((perm, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-[#60988E] mt-0.5">&#10003;</span>
                            <span className={perm.includes("planuojama") ? "text-gray-400 italic" : ""}>
                              {perm}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
