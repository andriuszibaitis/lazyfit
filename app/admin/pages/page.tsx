import { Suspense } from "react";
import AddPageModal from "./components/add-page-modal";
import PagesList from "./components/pages-list";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPages() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return pages;
  } catch (error) {
    console.error("Klaida gaunant puslapius:", error);
    return [];
  }
}

export default async function PagesPage() {
  const pages = await getPages();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Puslapiai</h1>
        <AddPageModal />
      </div>

      <Suspense fallback={<div>Kraunama...</div>}>
        <PagesList initialPages={pages} />
      </Suspense>
    </div>
  );
}
