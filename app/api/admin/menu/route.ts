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

    const menuItems = await prisma.menuItem.findMany({
      orderBy: [{ section: "asc" }, { order: "asc" }],
      include: {
        children: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("ADMIN_MENU_ERROR", error);
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

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("ADMIN_CREATE_MENU_ERROR", error);
    return new NextResponse(`Vidinė serverio klaida: ${error}`, {
      status: 500,
    });
  }
}
