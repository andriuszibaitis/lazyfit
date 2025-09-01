import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendVerificationEmail } from "@/app/lib/email";

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

    if (user.emailVerified) {
      return NextResponse.json({
        success: false,
        message: "El. paštas jau patvirtintas",
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
      },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/el-pasto-patvirtinimas?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RESEND_VERIFICATION_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}
