import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    const menuItems = await prisma.menuItem.findMany({
      where: section ? { section } : undefined,
      orderBy: {
        order: "asc",
      },
    });

    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=3600, s-maxage=7200");

    return NextResponse.json(menuItems, { headers });
  } catch (error) {
    console.error("[MENU_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, path, icon, section, order, parentId, isActive } = body;

    if (!title || !path) {
      return new NextResponse("Trūksta reikalingų duomenų", { status: 400 });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        title,
        path,
        icon,
        section: section || "main",
        order: order || 0,
        parentId,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    console.log("API: Sukurtas naujas meniu elementas:", menuItem);
    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("ADMIN_CREATE_MENU_ERROR", error);
    return new NextResponse(`Vidinė serverio klaida: ${error}`, {
      status: 500,
    });
  }
}
