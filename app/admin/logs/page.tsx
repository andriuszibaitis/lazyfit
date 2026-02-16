"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileText, AlertTriangle, Info, Bug } from "lucide-react";

// Fake log data for demonstration
const fakeLogs = [
  { id: "1", timestamp: "2026-02-16 14:32:05", type: "info", user: "Airidas", action: "Prisijungimas", details: "Sėkmingas prisijungimas iš 192.168.1.1" },
  { id: "2", timestamp: "2026-02-16 14:28:12", type: "info", user: "Airidas", action: "Narystės atnaujinimas", details: "Narystė atnaujinta: Metinė narystė" },
  { id: "3", timestamp: "2026-02-16 13:45:33", type: "warning", user: "Sistema", action: "El. pašto klaida", details: "Nepavyko išsiųsti patvirtinimo laiško: SMTP timeout" },
  { id: "4", timestamp: "2026-02-16 12:15:00", type: "info", user: "Airidas", action: "Produkto kūrimas", details: "Sukurtas maisto produktas: Vištienos krūtinėlė" },
  { id: "5", timestamp: "2026-02-16 11:30:22", type: "error", user: "Sistema", action: "Duomenų bazės klaida", details: "Connection timeout - auto-reconnect success" },
  { id: "6", timestamp: "2026-02-15 18:00:00", type: "info", user: "admin@lazyfit.com", action: "Vartotojo kūrimas", details: "Sukurtas naujas vartotojas: testas@test.lt" },
  { id: "7", timestamp: "2026-02-15 16:45:10", type: "warning", user: "Sistema", action: "Didelė apkrova", details: "API atsakymo laikas > 2s: /api/food-products/search" },
  { id: "8", timestamp: "2026-02-15 14:20:00", type: "info", user: "Airidas", action: "Kurso publikavimas", details: "Publikuotas kursas: Sporto pagrindai pradedantiesiems" },
  { id: "9", timestamp: "2026-02-15 10:00:00", type: "info", user: "Sistema", action: "Atsarginė kopija", details: "Duomenų bazės backup sukurtas sėkmingai" },
  { id: "10", timestamp: "2026-02-14 22:10:05", type: "error", user: "Sistema", action: "Failo įkėlimo klaida", details: "Vercel Blob upload failed: file too large (>10MB)" },
  { id: "11", timestamp: "2026-02-14 19:30:00", type: "info", user: "admin@lazyfit.com", action: "Treniruotės kūrimas", details: "Sukurta nauja treniruotė: Push Day" },
  { id: "12", timestamp: "2026-02-14 15:00:00", type: "warning", user: "Sistema", action: "Sesijos pabaiga", details: "5 vartotojų sesijos pasibaigė vienu metu" },
  { id: "13", timestamp: "2026-02-14 09:00:00", type: "info", user: "Sistema", action: "Sistemos paleidimas", details: "Serveris paleistas sėkmingai, versija 1.0.0" },
  { id: "14", timestamp: "2026-02-13 20:15:00", type: "info", user: "Airidas", action: "Nustatymų keitimas", details: "Pakeisti el. pašto nustatymai" },
  { id: "15", timestamp: "2026-02-13 16:00:00", type: "error", user: "Sistema", action: "API klaida", details: "500 Internal Server Error: /api/admin/memberships" },
];

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  info: { label: "Informacija", icon: <Info className="h-4 w-4" />, color: "bg-blue-100 text-blue-800" },
  warning: { label: "Įspėjimas", icon: <AlertTriangle className="h-4 w-4" />, color: "bg-yellow-100 text-yellow-800" },
  error: { label: "Klaida", icon: <Bug className="h-4 w-4" />, color: "bg-red-100 text-red-800" },
};

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const filteredLogs = fakeLogs.filter((log) => {
    const matchesSearch =
      !searchTerm ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || log.type === typeFilter;

    const matchesDate =
      !dateFilter || log.timestamp.startsWith(dateFilter);

    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sistemos žurnalai</h1>
          <p className="text-gray-500 mt-1">
            Sistemos veiksmų ir įvykių žurnalas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">
            {filteredLogs.length} įrašų
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Ieškoti pagal veiksmą, aprašymą ar vartotoją..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Visi tipai</SelectItem>
                <SelectItem value="info">Informacija</SelectItem>
                <SelectItem value="warning">Įspėjimai</SelectItem>
                <SelectItem value="error">Klaidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium w-44">Laikas</TableHead>
                <TableHead className="font-medium w-28">Tipas</TableHead>
                <TableHead className="font-medium w-36">Vartotojas</TableHead>
                <TableHead className="font-medium w-48">Veiksmas</TableHead>
                <TableHead className="font-medium">Detalės</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const config = typeConfig[log.type];
                return (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell className="text-sm text-gray-500 font-mono">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                        {config.icon}
                        {config.label}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {log.user}
                    </TableCell>
                    <TableCell className="text-sm">{log.action}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {log.details}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    Nerasta žurnalo įrašų
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="grid gap-3 p-4 md:hidden">
          {filteredLogs.map((log) => {
            const config = typeConfig[log.type];
            return (
              <div key={log.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                    {config.icon}
                    {config.label}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {log.timestamp}
                  </span>
                </div>
                <p className="font-medium text-sm">{log.action}</p>
                <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Vartotojas: {log.user}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
