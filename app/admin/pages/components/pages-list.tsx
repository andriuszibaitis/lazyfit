"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ExternalLink, FileText } from "lucide-react";
import EditPageModal from "./edit-page-modal";
import DeletePageModal from "./delete-page-modal";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface MenuItem {
  id: string;
  title: string;
  path: string;
  section: string;
  icon: string;
}

interface PagesListProps {
  initialPages: Page[];
}

export default function PagesList({ initialPages = [] }: PagesListProps) {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>(initialPages || []);

  const [menuItems, setMenuItems] = useState<Record<string, MenuItem[]>>({});
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingPage, setDeletingPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderIcon = (iconName: string) => {
    if (!iconName) return <FileText className="h-4 w-4" />;

    const IconComponent = LucideIcons[
      iconName as keyof typeof LucideIcons
    ] as React.ElementType;
    return IconComponent ? (
      <IconComponent className="h-4 w-4" />
    ) : (
      <FileText className="h-4 w-4" />
    );
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/menu");

        if (response.ok) {
          const data = await response.json();
          console.log("Gauti meniu elementai:", data);

          if (data && typeof data === "object") {
            setMenuItems(data);
          } else {
            console.error(
              "Meniu elementų atsakymas nėra tinkamo formato:",
              data
            );
            setMenuItems({});
            setError("Meniu elementų formatas neteisingas");
          }
        } else {
          console.error("Klaida gaunant meniu elementus:", response.statusText);
          setMenuItems({});
          setError(`Klaida gaunant meniu elementus: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Klaida gaunant meniu elementus:", error);
        setMenuItems({});
        setError(`Klaida gaunant meniu elementus: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const findMenuItemForPage = (page: Page) => {
    if (!menuItems || typeof menuItems !== "object") {
      console.error("menuItems nėra objektas:", menuItems);
      return null;
    }

    for (const section in menuItems) {
      if (Array.isArray(menuItems[section])) {
        const item = menuItems[section].find(
          (item: MenuItem) =>
            item.path === `/dashboard/p/${page.slug}` ||
            item.path === `/p/${page.slug}`
        );
        if (item) return item;
      }
    }

    return null;
  };

  const getMenuSectionName = (section: string) => {
    switch (section) {
      case "main":
        return "Pagrindinis";
      case "profile":
        return "Profilis";
      case "footer":
        return "Poraštė";
      default:
        return section;
    }
  };

  const handleEditClick = (page: Page) => {
    setEditingPage(page);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (page: Page) => {
    setDeletingPage(page);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSuccess = (deletedPageId: string) => {
    setPages((prevPages) =>
      prevPages.filter((page) => page.id !== deletedPageId)
    );
    router.refresh();
  };

  if (isLoading) {
    return <div className="py-8 text-center">Kraunama...</div>;
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        <p>Įvyko klaida: {error}</p>
        <Button
          onClick={() => router.refresh()}
          variant="outline"
          className="mt-4"
        >
          Bandyti iš naujo
        </Button>
      </div>
    );
  }

  if (!pages || pages.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Nėra sukurtų puslapių</p>
      </div>
    );
  }

  return (
    <div>
      {}
      <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Pavadinimas</th>
              <th className="px-4 py-3 font-medium">URL</th>
              <th className="px-4 py-3 font-medium">Meniu</th>
              <th className="px-4 py-3 font-medium">Statusas</th>
              <th className="px-4 py-3 font-medium">Veiksmai</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pages.map((page) => {
              const menuItem = findMenuItemForPage(page);
              return (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {page.title}
                  </td>
                  <td className="px-4 py-3 text-gray-500">/p/{page.slug}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {menuItem ? (
                      <div className="flex items-center gap-1.5">
                        {menuItem.icon && renderIcon(menuItem.icon)}
                        <span>{getMenuSectionName(menuItem.section)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Nepridėtas</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={page.isPublished ? "default" : "outline"}
                      className={
                        page.isPublished ? "bg-green-100 text-green-700" : ""
                      }
                    >
                      {page.isPublished ? "Publikuotas" : "Juodraštis"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(page)}
                        className="h-8 w-8 text-gray-500"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Redaguoti</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(page)}
                        className="h-8 w-8 text-gray-500"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Ištrinti</span>
                      </Button>
                      <Link href={`/dashboard/p/${page.slug}`} target="_blank">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Peržiūrėti</span>
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {}
      <div className="grid gap-4 md:hidden">
        {pages.map((page) => {
          const menuItem = findMenuItemForPage(page);
          return (
            <Card key={page.id}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{page.title}</h3>
                    <Badge
                      variant={page.isPublished ? "default" : "outline"}
                      className={
                        page.isPublished ? "bg-green-100 text-green-700" : ""
                      }
                    >
                      {page.isPublished ? "Publikuotas" : "Juodraštis"}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">URL:</span>
                      <span>/p/{page.slug}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="font-medium">Meniu:</span>
                      {menuItem ? (
                        <div className="flex items-center gap-1.5">
                          {menuItem.icon && renderIcon(menuItem.icon)}
                          <span>{getMenuSectionName(menuItem.section)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Nepridėtas</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(page)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Redaguoti
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(page)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Ištrinti
                  </Button>
                  <Link href={`/dashboard/p/${page.slug}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Peržiūrėti
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {}
      {editingPage && (
        <EditPageModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          page={editingPage}
        />
      )}

      {deletingPage && (
        <DeletePageModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          page={deletingPage}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
