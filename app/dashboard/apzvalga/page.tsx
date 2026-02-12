import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth-options";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ApzvalgaContent from "./apzvalga-content";

export default async function ApzvalgaPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/prisijungti?callbackUrl=/dashboard/apzvalga");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { membership: true },
  });

  // Serialize user data to convert Decimal to number
  const serializedUser = user ? {
    ...user,
    membership: user.membership ? {
      ...user.membership,
      price: Number(user.membership.price),
    } : null,
  } : null;

  return <ApzvalgaContent user={serializedUser} />;
}
