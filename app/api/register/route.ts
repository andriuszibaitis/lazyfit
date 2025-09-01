import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendVerificationEmail } from "@/app/lib/email";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("Trūksta reikalingų duomenų", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse("Vartotojas su šiuo el. paštu jau egzistuoja", {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        provider: "credentials",
      },
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    try {
      const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/el-pasto-patvirtinimas?token=${verificationToken}`;
      await sendVerificationEmail(email, verificationUrl, name);

      return NextResponse.json({
        user,
        message:
          "Registracija sėkminga. Patikrinkite savo el. paštą patvirtinimui.",
      });
    } catch (emailError) {
      console.error("EMAIL_SENDING_ERROR", emailError);

      return NextResponse.json({
        user,
        message:
          "Registracija sėkminga, tačiau nepavyko išsiųsti patvirtinimo laiško. Susisiekite su administratoriumi.",
        emailError: true,
      });
    }
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}
