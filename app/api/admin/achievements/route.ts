import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/prismadb";

// GET - Get all achievements (admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const achievements = await prisma.achievement.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({ achievements });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

// POST - Create achievement or seed default achievements
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // If seed flag is passed, seed default achievements
    if (body.seed) {
      const defaultAchievements = [
        {
          code: "centimeter_killer",
          title: "Centimetrų naikintojas",
          description: "Pirmą kartą suvesti savo kūno apimčių duomenis (svorį, liemenį, krūtinę ir t.t.).",
          order: 1,
        },
        {
          code: "half_scale",
          title: "Pusiaukelė",
          description: "Numesti pusę svorio iki savo pasirinkto tikslo.",
          order: 2,
        },
        {
          code: "unstoppable",
          title: "Nestabdomas",
          description: "Išlaikyti 30 dienų nepertraukiamą prisijungimų arba treniruočių seriją (streak'ą).",
          order: 3,
        },
        {
          code: "easy_start",
          title: "Lengvas startas",
          description: "Atlikti pačią pirmąją treniruotę.",
          order: 4,
        },
        {
          code: "ice_breaker",
          title: "Ledo pralaužimas",
          description: "Pirmą kartą atlikti socialinį veiksmą: atsakyti į 'Savaitės klausimą', prisijungti prie grupės arba pakomentuoti.",
          order: 5,
        },
        {
          code: "plan_champion",
          title: "Plano čempionas",
          description: "Sėkmingai užbaigti visą treniruočių planą nuo pradžios iki galo.",
          order: 6,
        },
        {
          code: "weekend_warrior",
          title: "Savaitgalio karys",
          description: "Atlikti treniruotę šeštadienį arba sekmadienį.",
          order: 7,
        },
        {
          code: "nutrition_guru",
          title: "Mitybos guru",
          description: "Užpildyti mitybos dienoraštį 7 dienas iš eilės.",
          order: 8,
        },
        {
          code: "iron_persistence",
          title: "Geležinis atkakumas",
          description: "Iš viso atlikti 100 treniruočių.",
          order: 9,
        },
        {
          code: "brave_step",
          title: "Drąsus žingsnis",
          description: "Pirmą kartą įkelti savo progreso nuotrauką.",
          order: 10,
        },
      ];

      // Upsert each achievement
      for (const achievement of defaultAchievements) {
        await prisma.achievement.upsert({
          where: { code: achievement.code },
          update: achievement,
          create: achievement,
        });
      }

      return NextResponse.json({ message: "Achievements seeded successfully" });
    }

    // Check if code already exists
    const existing = await prisma.achievement.findUnique({
      where: { code: body.code },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Pasiekimas su tokiu kodu jau egzistuoja" },
        { status: 400 }
      );
    }

    // Create single achievement
    const achievement = await prisma.achievement.create({
      data: {
        code: body.code,
        title: body.title,
        description: body.description,
        iconUrl: body.iconUrl,
        iconSvg: body.iconSvg,
        trigger: body.trigger,
        triggerValue: body.triggerValue,
        order: body.order || 0,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(achievement);
  } catch (error) {
    console.error("Error creating achievement:", error);
    return NextResponse.json(
      { error: "Failed to create achievement" },
      { status: 500 }
    );
  }
}
