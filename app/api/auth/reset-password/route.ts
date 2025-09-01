import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return new NextResponse("Trūksta reikalingų duomenų", { status: 400 });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
      },
    });

    if (!verificationToken) {
      return new NextResponse("Neteisingas arba pasibaigęs atkūrimo kodas", {
        status: 400,
      });
    }

    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.delete({
        where: {
          token: hashedToken,
        },
      });

      return new NextResponse("Atkūrimo kodas pasibaigęs", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: verificationToken.identifier,
      },
    });

    if (!user) {
      return new NextResponse("Vartotojas nerastas", { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedPassword,
      },
    });

    await prisma.verificationToken.delete({
      where: {
        token: hashedToken,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  }
}
