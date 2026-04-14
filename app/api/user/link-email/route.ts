import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth-options";
import { prisma } from "../../../lib/prismadb";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: process.env.EMAIL_SERVER_SECURE === "true",
});

// In-memory store for verification codes (use Redis in production)
const verificationCodes = new Map<string, { code: string; email: string; userId: string; expiresAt: number }>();

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST - Send verification code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Neteisingas el. pašto adresas" }, { status: 400 });
    }

    // Check if already linked to this email
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (currentUser?.email === email || currentUser?.linkedEmail === email) {
      return NextResponse.json({ error: "Šis el. paštas jau susietas su jūsų paskyra" }, { status: 400 });
    }

    // Check if email is already used as linkedEmail by another user
    const linkedByOther = await prisma.user.findFirst({
      where: {
        linkedEmail: email,
        NOT: { id: session.user.id },
      },
    });

    if (linkedByOther) {
      return NextResponse.json({ error: "Šis el. paštas jau susietas su kita paskyra" }, { status: 400 });
    }

    const code = generateCode();
    const key = `${session.user.id}_${email}`;

    // Store code with 10 min expiration
    verificationCodes.set(key, {
      code,
      email,
      userId: session.user.id,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "LazyFit - El. pašto patvirtinimo kodas",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2>El. pašto patvirtinimas</h2>
          <p>Jūsų patvirtinimo kodas:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px; margin: 16px 0;">
            ${code}
          </div>
          <p style="color: #666; font-size: 14px;">Kodas galioja 10 minučių.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Kodas išsiųstas" });
  } catch (error) {
    console.error("Error sending link email code:", error);
    return NextResponse.json({ error: "Klaida siunčiant kodą" }, { status: 500 });
  }
}

// PUT - Verify code and link email (merge accounts if needed)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, code, password } = body;

    if (!email || !code || !password) {
      return NextResponse.json({ error: "Trūksta duomenų" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Slaptažodis turi būti bent 8 simbolių" }, { status: 400 });
    }

    const key = `${session.user.id}_${email}`;
    const stored = verificationCodes.get(key);

    if (!stored) {
      return NextResponse.json({ error: "Kodas nerastas. Bandykite iš naujo." }, { status: 400 });
    }

    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(key);
      return NextResponse.json({ error: "Kodas nebegalioja" }, { status: 400 });
    }

    if (stored.code !== code) {
      return NextResponse.json({ error: "Neteisingas kodas" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if another user exists with this email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      // Merge: transfer all data from existing user to current user, then delete old account
      await prisma.$transaction(async (tx) => {
        const oldUserId = existingUser.id;
        const currentUserId = session.user.id;

        // Update all relations that reference the old user to point to current user
        const relationUpdates = [
          tx.account.updateMany({ where: { userId: oldUserId }, data: { userId: currentUserId } }),
          tx.session.updateMany({ where: { userId: oldUserId }, data: { userId: currentUserId } }),
        ];

        // Try updating common relations - ignore errors for tables that don't exist
        try { await tx.workout.updateMany({ where: { userId: oldUserId }, data: { userId: currentUserId } }); } catch {}
        try { await tx.userNutritionPlan.updateMany({ where: { userId: oldUserId }, data: { userId: currentUserId } }); } catch {}
        try { await tx.bodyMeasurement.updateMany({ where: { userId: oldUserId }, data: { userId: currentUserId } }); } catch {}
        try { await tx.userAchievement.updateMany({ where: { userId: oldUserId }, data: { userId: currentUserId } }); } catch {}
        try { await tx.userQuestion.updateMany({ where: { userId: oldUserId }, data: { userId: currentUserId } }); } catch {}
        try { await tx.userMealLog.updateMany({ where: { userId: oldUserId }, data: { userId: currentUserId } }); } catch {}

        await Promise.all(relationUpdates);

        // Link the email and set password on current user
        await tx.user.update({
          where: { id: currentUserId },
          data: {
            linkedEmail: email,
            hashedPassword,
          },
        });

        // Delete the old user
        await tx.user.delete({
          where: { id: oldUserId },
        });
      });
    } else {
      // No existing user with this email - just link it
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          linkedEmail: email,
          hashedPassword,
        },
      });
    }

    // Clean up
    verificationCodes.delete(key);

    return NextResponse.json({ message: "El. paštas sėkmingai susietas" });
  } catch (error) {
    console.error("Error linking email:", error);
    return NextResponse.json({ error: "Klaida susiejant el. paštą" }, { status: 500 });
  }
}
