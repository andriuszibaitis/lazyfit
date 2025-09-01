import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const page = await prisma.page.findUnique({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!page) {
      return new NextResponse("Puslapis nerastas", { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("GET_PAGE_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}
