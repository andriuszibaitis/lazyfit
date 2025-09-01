import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth-options"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = new URL(request.url).searchParams
    const published = searchParams.get("published")
    const muscleGroup = searchParams.get("muscleGroup")

    const whereClause: any = {}
    if (published === "true") {
      whereClause.isPublished = true
    } else if (published === "false") {
      whereClause.isPublished = false
    }

    if (muscleGroup) {
      whereClause.muscleGroup = muscleGroup
    }

    const exercises = await prisma.exercise.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ exercises })
  } catch (error) {
    console.error("Error fetching exercises:", error)
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      muscleGroup,
      secondaryMuscleGroups,
      equipment,
      difficulty,
      instructions,
      tips,
      imageUrl,
      videoUrl,
      isPublished,
    } = body

    const exercise = await prisma.exercise.create({
      data: {
        name,
        description,
        muscleGroup,
        secondaryMuscleGroups: secondaryMuscleGroups || [],
        equipment,
        difficulty: difficulty || "medium",
        instructions: instructions || [],
        tips: tips || [],
        imageUrl,
        videoUrl,
        isPublished: isPublished || false,
        createdBy: session.user.email || undefined,
        updatedBy: session.user.email || undefined,
      },
    })

    return NextResponse.json({ exercise })
  } catch (error) {
    console.error("Error creating exercise:", error)
    return NextResponse.json({ error: "Failed to create exercise" }, { status: 500 })
  }
}

