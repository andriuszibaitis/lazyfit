import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const pageId = params.id;

    const page = await prisma.page.findUnique({
      where: {
        id: pageId,
      },
    });

    if (!page) {
      return new NextResponse("Puslapis nerastas", { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("ADMIN_GET_PAGE_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const pageId = params.id;
    const body = await request.json();
    const { title, slug, content, isPublished } = body;

    const existingPage = await prisma.page.findUnique({
      where: {
        id: pageId,
      },
    });

    if (!existingPage) {
      return new NextResponse("Puslapis nerastas", { status: 404 });
    }

    if (slug && slug !== existingPage.slug) {
      const slugExists = await prisma.page.findUnique({
        where: {
          slug,
        },
      });

      if (slugExists) {
        return new NextResponse("Puslapis su tokiu URL jau egzistuoja", {
          status: 400,
        });
      }
    }

    const updatedPage = await prisma.page.update({
      where: {
        id: pageId,
      },
      data: {
        title: title !== undefined ? title : existingPage.title,
        slug: slug !== undefined ? slug : existingPage.slug,
        content: content !== undefined ? content : existingPage.content,
        isPublished:
          isPublished !== undefined ? isPublished : existingPage.isPublished,
        updatedBy: session.user.id,
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("ADMIN_UPDATE_PAGE_ERROR", error);
    return new NextResponse(`Vidinė serverio klaida: ${error}`, {
      status: 500,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const pageId = params.id;

    const existingPage = await prisma.page.findUnique({
      where: {
        id: pageId,
      },
    });

    if (!existingPage) {
      return new NextResponse("Puslapis nerastas", { status: 404 });
    }

    await prisma.page.delete({
      where: {
        id: pageId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("ADMIN_DELETE_PAGE_ERROR", error);
    return new NextResponse(`Vidinė serverio klaida: ${error}`, {
      status: 500,
    });
  }
}
