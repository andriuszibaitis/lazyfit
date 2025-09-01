import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth-options";
import bcrypt from "bcryptjs";
import { sendNewUserEmail } from "@/app/lib/email";

const prisma = new PrismaClient();

function generateRandomPassword(length = 10) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";

  password += charset.charAt(Math.floor(Math.random() * 26));
  password += charset.charAt(26 + Math.floor(Math.random() * 26));
  password += charset.charAt(52 + Math.floor(Math.random() * 10));
  password += charset.charAt(62 + Math.floor(Math.random() * 12));

  for (let i = 4; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("ADMIN_USERS_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, email, role, membershipStatus, planId, membershipExpiry } =
      body;

    if (!name || !email) {
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

    const randomPassword = generateRandomPassword(12);

    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: role || "user",
        hashedPassword,
        emailVerified: new Date(),
        provider: "credentials",
        membershipStatus: membershipStatus || "inactive",
        planId: planId || null,
        membershipExpiry: membershipExpiry || null,
      },
    });

    try {
      await sendNewUserEmail(email, name, randomPassword);
    } catch (emailError) {
      console.error("Failed to send new user email:", emailError);

      return NextResponse.json({
        user,
        password: randomPassword,
        emailSent: false,
        message:
          "Vartotojas sukurtas, bet nepavyko išsiųsti el. laiško su prisijungimo duomenimis.",
      });
    }

    return NextResponse.json({
      user,
      emailSent: true,
      message:
        "Vartotojas sukurtas ir el. laiškas su prisijungimo duomenimis išsiųstas.",
    });
  } catch (error) {
    console.error("ADMIN_CREATE_USER_ERROR", error);
    return new NextResponse("Vidinė serverio klaida", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
