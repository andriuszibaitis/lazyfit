import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prismadb";

// POST - Submit a new question (for logged-in users)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { question } = body;

    if (!question || !question.trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const userQuestion = await prisma.userQuestion.create({
      data: {
        userId: session.user.id,
        question: question.trim(),
        status: "pending",
      },
    });

    return NextResponse.json(userQuestion, { status: 201 });
  } catch (error) {
    console.error("Error creating user question:", error);
    return NextResponse.json(
      { error: "Failed to submit question" },
      { status: 500 }
    );
  }
}

// GET - Get current user's questions
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questions = await prisma.userQuestion.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching user questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
