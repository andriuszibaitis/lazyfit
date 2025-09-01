import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import { replaceTemplateVariables } from "@/app/lib/email-templates";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { htmlContent, textContent, variables } = body;

    const processedHtml = replaceTemplateVariables(htmlContent, variables);
    const processedText = textContent
      ? replaceTemplateVariables(textContent, variables)
      : undefined;

    return NextResponse.json({
      htmlContent: processedHtml,
      textContent: processedText,
    });
  } catch (error) {
    console.error("ADMIN_EMAIL_TEMPLATE_PREVIEW_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}
