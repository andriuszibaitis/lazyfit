import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nėra prieigos" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Nėra teisių" }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = Number.parseInt(url.searchParams.get("page") || "1");
    const limit = Number.parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";

    const skip = (page - 1) * limit;

    let where: any = { isActive: true };

    if (search) {
      where.name = {
        contains: search,
      };
    }

    if (category && category !== "all") {
      where.category = category;
    }

    const products = await prisma.foodProduct.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: "asc" },
    });

    const total = await prisma.foodProduct.count({ where });

    const categoriesQuery = await prisma.foodProduct.findMany({
      where: { isActive: true },
      select: { category: true },
    });

    const categoriesSet = new Set<string>();
    categoriesQuery.forEach((item) => {
      if (item.category) categoriesSet.add(item.category);
    });
    const categories = Array.from(categoriesSet).sort();

    return NextResponse.json({
      products,
      total,
      pages: Math.ceil(total / limit),
      categories,
    });
  } catch (error) {
    console.error("Klaida gaunant maisto produktus:", error);
    return NextResponse.json(
      {
        error: "Įvyko klaida gaunant maisto produktus",
        details: error,
        message: error instanceof Error ? error.message : "Nežinoma klaida",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nėra prieigos" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Nėra teisių" }, { status: 403 });
    }

    const data = await request.json();

    if (!data.name || !data.category) {
      return NextResponse.json(
        { error: "Trūksta privalomų laukų" },
        { status: 400 }
      );
    }

    const product = await prisma.foodProduct.create({
      data: {
        name: data.name,
        category: data.category,
        calories: parseFloat(data.calories) || 0,
        protein: parseFloat(data.protein) || 0,
        carbs: parseFloat(data.carbs) || 0,
        fat: parseFloat(data.fat) || 0,
        fiber: data.fiber ? parseFloat(data.fiber) : null,
        sugar: data.sugar ? parseFloat(data.sugar) : null,
        serving: parseFloat(data.serving) || 100,
        servingUnit: data.servingUnit || "g",
        isActive: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Klaida kuriant maisto produktą:", error);
    return NextResponse.json(
      {
        error: "Įvyko klaida kuriant maisto produktą",
        details: error,
        message: error instanceof Error ? error.message : "Nežinoma klaida",
      },
      { status: 500 }
    );
  }
}
