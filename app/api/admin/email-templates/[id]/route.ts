import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import { updateEmailTemplate } from "@/app/lib/email-templates";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const templateId = params.id;

    const template = await prisma.emailTemplate.findUnique({
      where: {
        id: templateId,
      },
    });

    if (!template) {
      return new NextResponse("Šablonas nerastas", { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("ADMIN_GET_EMAIL_TEMPLATE_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  } finally {
    await prisma.$disconnect();
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

    const templateId = params.id;
    const body = await request.json();
    const { subject, htmlContent, textContent, isActive } = body;

    const existingTemplate = await prisma.emailTemplate.findUnique({
      where: {
        id: templateId,
      },
    });

    if (!existingTemplate) {
      return new NextResponse("Šablonas nerastas", { status: 404 });
    }

    const updatedTemplate = await updateEmailTemplate(templateId, {
      subject,
      htmlContent,
      textContent,
      isActive,
    });

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error("ADMIN_UPDATE_EMAIL_TEMPLATE_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}
