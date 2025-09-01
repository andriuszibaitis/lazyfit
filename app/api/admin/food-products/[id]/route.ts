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

    const id = params.id;

    const product = await prisma.foodProduct.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!product) {
      return new NextResponse("Produktas nerastas", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("ADMIN_GET_FOOD_PRODUCT_ERROR", error);
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

    const id = params.id;
    const body = await request.json();
    const {
      name,
      category,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      serving,
      servingUnit,
    } = body;

    const existingProduct = await prisma.foodProduct.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!existingProduct) {
      return new NextResponse("Produktas nerastas", { status: 404 });
    }

    const updatedProduct = await prisma.foodProduct.update({
      where: {
        id,
      },
      data: {
        name: name !== undefined ? name : undefined,
        category: category !== undefined ? category : undefined,
        calories:
          calories !== undefined ? Number.parseFloat(calories) : undefined,
        protein: protein !== undefined ? Number.parseFloat(protein) : undefined,
        carbs: carbs !== undefined ? Number.parseFloat(carbs) : undefined,
        fat: fat !== undefined ? Number.parseFloat(fat) : undefined,
        fiber:
          fiber !== undefined
            ? fiber
              ? Number.parseFloat(fiber)
              : null
            : undefined,
        sugar:
          sugar !== undefined
            ? sugar
              ? Number.parseFloat(sugar)
              : null
            : undefined,
        serving: serving !== undefined ? Number.parseFloat(serving) : undefined,
        servingUnit: servingUnit !== undefined ? servingUnit : undefined,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("ADMIN_UPDATE_FOOD_PRODUCT_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
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

    const id = params.id;

    const existingProduct = await prisma.foodProduct.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!existingProduct) {
      return new NextResponse("Produktas nerastas", { status: 404 });
    }

    await prisma.foodProduct.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("ADMIN_DELETE_FOOD_PRODUCT_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}
