import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const menuItemId = id;

    const menuItem = await prisma.menuItem.findUnique({
      where: {
        id: menuItemId,
      },
      include: {
        children: true,
      },
    });

    if (!menuItem) {
      return new NextResponse("Meniu elementas nerastas", { status: 404 });
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("ADMIN_GET_MENU_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const menuItemId = id;
    const body = await request.json();
    const { title, path, icon, section, order, parentId, isActive } = body;

    const existingMenuItem = await prisma.menuItem.findUnique({
      where: {
        id: menuItemId,
      },
    });

    if (!existingMenuItem) {
      return new NextResponse("Meniu elementas nerastas", { status: 404 });
    }

    if (parentId && parentId === menuItemId) {
      return new NextResponse("Meniu elementas negali būti savo paties tėvas", {
        status: 400,
      });
    }

    const updatedMenuItem = await prisma.menuItem.update({
      where: {
        id: menuItemId,
      },
      data: {
        title: title !== undefined ? title : existingMenuItem.title,
        path: path !== undefined ? path : existingMenuItem.path,
        icon: icon !== undefined ? icon : existingMenuItem.icon,
        section: section !== undefined ? section : existingMenuItem.section,
        order: order !== undefined ? order : existingMenuItem.order,
        parentId: parentId !== undefined ? parentId : existingMenuItem.parentId,
        isActive: isActive !== undefined ? isActive : existingMenuItem.isActive,
      },
    });

    return NextResponse.json(updatedMenuItem);
  } catch (error) {
    console.error("ADMIN_UPDATE_MENU_ERROR", error);
    return new NextResponse(`Vidinė serverio klaida: ${error}`, {
      status: 500,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const menuItemId = id;

    const existingMenuItem = await prisma.menuItem.findUnique({
      where: {
        id: menuItemId,
      },
      include: {
        children: true,
      },
    });

    if (!existingMenuItem) {
      return new NextResponse("Meniu elementas nerastas", { status: 404 });
    }

    if (existingMenuItem.children.length > 0) {
      await prisma.menuItem.updateMany({
        where: {
          parentId: menuItemId,
        },
        data: {
          parentId: null,
        },
      });
    }

    await prisma.menuItem.delete({
      where: {
        id: menuItemId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("ADMIN_DELETE_MENU_ERROR", error);
    return new NextResponse(`Vidinė serverio klaida: ${error}`, {
      status: 500,
    });
  }
}
