import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse("Trūksta patvirtinimo kodo", { status: 400 });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token: hashedToken,
      },
    });

    if (!verificationToken) {
      return new NextResponse(
        "Neteisingas arba pasibaigęs patvirtinimo kodas",
        {
          status: 400,
        }
      );
    }

    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.delete({
        where: {
          token: hashedToken,
        },
      });

      return new NextResponse("Patvirtinimo kodas pasibaigęs", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: verificationToken.identifier,
      },
    });

    if (!user) {
      return new NextResponse("Vartotojas nerastas", { status: 404 });
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    await prisma.verificationToken.delete({
      where: {
        token: hashedToken,
      },
    });

    return NextResponse.redirect(new URL("/auth/prisijungti", request.url));
  } catch (error) {
    console.error("EMAIL_VERIFICATION_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}
