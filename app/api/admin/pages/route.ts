import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const pages = await prisma.page.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("ADMIN_PAGES_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { title, slug, content, isPublished } = body;

    if (!title || !slug) {
      return new NextResponse("Trūksta reikalingų duomenų", { status: 400 });
    }

    const existingPage = await prisma.page.findUnique({
      where: {
        slug,
      },
    });

    if (existingPage) {
      return new NextResponse("Puslapis su tokiu URL jau egzistuoja", {
        status: 400,
      });
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content: content || "",
        isPublished: isPublished !== undefined ? isPublished : false,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("ADMIN_CREATE_PAGE_ERROR", error);
    return new NextResponse(`Vidinė serverio klaida: ${error}`, {
      status: 500,
    });
  }
}
