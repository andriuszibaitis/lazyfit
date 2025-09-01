import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import { replaceTemplateVariables } from "@/app/lib/email-templates";
// @ts-ignore
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { to, subject, htmlContent, textContent, variables } = body;

    if (!to || !subject || !htmlContent) {
      return new NextResponse("Trūksta reikalingų duomenų", { status: 400 });
    }

    const processedHtml = replaceTemplateVariables(htmlContent, variables);
    const processedText = textContent
      ? replaceTemplateVariables(textContent, variables)
      : undefined;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      secure: process.env.EMAIL_SERVER_SECURE === "true",
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `[TESTAS] ${subject}`,
      html: processedHtml,
      text: processedText,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("ADMIN_EMAIL_TEMPLATE_TEST_ERROR", error);
    return new NextResponse(`Vidinė serverio klaida: ${error}`, {
      status: 500,
    });
  }
}
