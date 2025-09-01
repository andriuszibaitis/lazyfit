import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUpdatedSession() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return session;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      image: true,
      planId: true,
      membershipStatus: true,
      membership: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (user) {
    session.user.planId = user.planId || undefined;
    session.user.membershipStatus = user.membershipStatus || undefined;
    session.user.membershipId = user.membership?.id || undefined;
    session.user.membershipName = user.membership?.name || undefined;
  }

  return session;
}
