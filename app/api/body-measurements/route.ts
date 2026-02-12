import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prismadb";

// GET - Get user's body measurements
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week"; // week, month, 3months

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case "3months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      default: // week
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const measurements = await prisma.bodyMeasurement.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // Get latest and previous measurements for change calculation
    const latest = measurements[0] || null;
    const previous = measurements[1] || null;

    // Calculate changes
    const changes = latest && previous ? {
      weight: latest.weight && previous.weight ? latest.weight - previous.weight : null,
      shoulders: latest.shoulders && previous.shoulders ? latest.shoulders - previous.shoulders : null,
      chest: latest.chest && previous.chest ? latest.chest - previous.chest : null,
      biceps: latest.biceps && previous.biceps ? latest.biceps - previous.biceps : null,
      forearm: latest.forearm && previous.forearm ? latest.forearm - previous.forearm : null,
      waist: latest.waist && previous.waist ? latest.waist - previous.waist : null,
      belly: latest.belly && previous.belly ? latest.belly - previous.belly : null,
      hips: latest.hips && previous.hips ? latest.hips - previous.hips : null,
      thigh: latest.thigh && previous.thigh ? latest.thigh - previous.thigh : null,
      calf: latest.calf && previous.calf ? latest.calf - previous.calf : null,
    } : null;

    return NextResponse.json({
      measurements,
      latest,
      previous,
      changes,
    });
  } catch (error) {
    console.error("Error fetching body measurements:", error);
    return NextResponse.json(
      { error: "Failed to fetch body measurements" },
      { status: 500 }
    );
  }
}

// POST - Create or update body measurement for a date
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      date,
      weight,
      shoulders,
      chest,
      biceps,
      forearm,
      waist,
      belly,
      hips,
      thigh,
      calf,
    } = body;

    // Parse date - create start and end of day for comparison
    const measurementDate = new Date(date);
    measurementDate.setUTCHours(0, 0, 0, 0);

    const startOfDay = new Date(measurementDate);
    const endOfDay = new Date(measurementDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Check if measurement exists for this date
    const existingMeasurement = await prisma.bodyMeasurement.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    let measurement;

    if (existingMeasurement) {
      // Update existing measurement
      measurement = await prisma.bodyMeasurement.update({
        where: {
          id: existingMeasurement.id,
        },
        data: {
          weight: weight !== undefined ? weight : existingMeasurement.weight,
          shoulders: shoulders !== undefined ? shoulders : existingMeasurement.shoulders,
          chest: chest !== undefined ? chest : existingMeasurement.chest,
          biceps: biceps !== undefined ? biceps : existingMeasurement.biceps,
          forearm: forearm !== undefined ? forearm : existingMeasurement.forearm,
          waist: waist !== undefined ? waist : existingMeasurement.waist,
          belly: belly !== undefined ? belly : existingMeasurement.belly,
          hips: hips !== undefined ? hips : existingMeasurement.hips,
          thigh: thigh !== undefined ? thigh : existingMeasurement.thigh,
          calf: calf !== undefined ? calf : existingMeasurement.calf,
        },
      });
    } else {
      // Create new measurement
      measurement = await prisma.bodyMeasurement.create({
        data: {
          userId: session.user.id,
          date: measurementDate,
          weight,
          shoulders,
          chest,
          biceps,
          forearm,
          waist,
          belly,
          hips,
          thigh,
          calf,
        },
      });
    }

    return NextResponse.json(measurement);
  } catch (error) {
    console.error("Error saving body measurement:", error);
    return NextResponse.json(
      { error: "Failed to save body measurement" },
      { status: 500 }
    );
  }
}
