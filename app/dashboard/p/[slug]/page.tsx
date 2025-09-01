import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";
import SideNavigation from "@/app/dashboard/components/side-navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function DashboardDynamicPage({ params }: PageProps) {
  const { slug } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/prisijungti?callbackUrl=/dashboard/p/" + slug);
  }

  try {
    const page = await prisma.page.findUnique({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!page) {
      return notFound();
    }

    return (
      <div className="flex min-h-screen bg-[#f7f7f7]">
        {}
        <SideNavigation user={session.user} />

        {}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h1 className="text-3xl font-bold mb-6 text-[#101827]">
                {page.title}
              </h1>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching page:", error);
    return notFound();
  }
}
