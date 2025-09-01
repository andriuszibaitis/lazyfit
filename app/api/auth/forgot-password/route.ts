import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/app/lib/email";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("El. paštas yra privalomas", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json({ success: true });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
      },
    });

    const expires = new Date(Date.now() + 3600 * 1000);
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/atstatyti-slaptazodi?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetUrl, user.name || "");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}
