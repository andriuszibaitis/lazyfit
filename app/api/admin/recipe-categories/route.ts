import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Naudotojas neprisijungęs" }),
        { status: 401 }
      );
    }

    const categories = await prisma.recipeCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Klaida gaunant receptų kategorijas:", error);
    return new NextResponse(
      JSON.stringify({ error: "Įvyko serverio klaida" }),
      { status: 500 }
    );
  }
}

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[ąčęėįšųūž]/g, (char) => {
      const map: Record<string, string> = {
        ą: "a",
        č: "c",
        ę: "e",
        ė: "e",
        į: "i",
        š: "s",
        ų: "u",
        ū: "u",
        ž: "z",
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Naudotojas neprisijungęs" }),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, image, isActive } = body;

    if (!name || !name.trim()) {
      return new NextResponse(
        JSON.stringify({ error: "Kategorijos pavadinimas yra privalomas" }),
        { status: 400 }
      );
    }

    // Get the highest order number to place new category at the end
    const lastCategory = await prisma.recipeCategory.findFirst({
      orderBy: {
        order: "desc",
      },
    });

    const newOrder = lastCategory ? lastCategory.order + 1 : 0;

    // Generate slug from name
    let slug = generateSlug(name.trim());

    // Check if slug already exists and make it unique if needed
    const existingCategory = await prisma.recipeCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      slug = `${slug}-${Date.now()}`;
    }

    const category = await prisma.recipeCategory.create({
      data: {
        name: name.trim(),
        slug,
        description: description || null,
        image: image || null,
        isActive: isActive ?? true,
        order: newOrder,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Klaida kuriant receptų kategoriją:", error);
    return new NextResponse(
      JSON.stringify({ error: "Įvyko serverio klaida" }),
      { status: 500 }
    );
  }
}
