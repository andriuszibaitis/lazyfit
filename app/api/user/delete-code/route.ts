import { NextRequest, NextResponse } from "next/server";
import { sendDeleteVerificationCode } from "../../../lib/email";

// Generate a random 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate verification code
    const code = generateCode();

    // Send email with code
    const emailSent = await sendDeleteVerificationCode(email, code);

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Verification code sent to your email",
      // For development only - remove in production
      code: code
    });

  } catch (error) {
    console.error("Error sending delete code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

