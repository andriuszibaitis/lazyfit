import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import { getAllEmailTemplates } from "@/app/lib/email-templates";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const templates = await getAllEmailTemplates();

    return NextResponse.json(templates);
  } catch (error) {
    console.error("ADMIN_EMAIL_TEMPLATES_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}
