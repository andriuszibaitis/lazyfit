import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prismadb";

// GET - Fetch all active FAQ categories with their items (public endpoint)
export async function GET() {
  try {
    const categories = await prisma.fAQCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            question: true,
            answer: true,
          },
        },
      },
    });

    // Transform data to match frontend expected format
    const faqData = categories.map((category) => ({
      id: category.slug,
      title: category.title,
      items: category.items.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
    }));

    return NextResponse.json(faqData);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ" },
      { status: 500 }
    );
  }
}
