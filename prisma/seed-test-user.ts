import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding test user 'Airidas'...");

  let membership = await prisma.membership.findUnique({
    where: { planId: "yearly" },
  });

  if (!membership) {
    membership = await prisma.membership.create({
      data: {
        name: "Metinė narystė",
        planId: "yearly",
        price: 149.99,
        discountPercentage: 38,
        duration: 365,
        description: "Pilna prieiga visiems metams",
        features: [
          "Visos treniruočių programos",
          "Mitybos planai ir receptai",
          "Kalorijų skaičiuoklė",
          "Edukaciniai kursai",
        ],
        isActive: true,
        showOnHomepage: true,
      },
    });
    console.log("✅ Created yearly membership");
  }

  const email = "info@lazyfit.lt";
  const hashedPassword = await bcrypt.hash("password123", 12);

  const membershipExpiry = new Date();
  membershipExpiry.setFullYear(membershipExpiry.getFullYear() + 1);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    await prisma.user.update({
      where: { email },
      data: {
        name: "Airidas",
        role: "admin",
        planId: "yearly",
        membershipStatus: "active",
        membershipExpiry,
        emailVerified: new Date(),
        gender: "male",
      },
    });
    console.log("✅ Updated existing user Airidas");
  } else {
    await prisma.user.create({
      data: {
        name: "Airidas",
        email,
        hashedPassword,
        role: "admin",
        planId: "yearly",
        membershipStatus: "active",
        membershipExpiry,
        emailVerified: new Date(),
        gender: "male",
        provider: "credentials",
      },
    });
    console.log("✅ Created user Airidas (info@lazyfit.lt / password123)");
  }

  console.log("🎉 Test user seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding test user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
