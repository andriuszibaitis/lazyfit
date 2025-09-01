import "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image?: string;
      provider: string;
      planId?: string;
      membershipStatus?: string;
      membershipId?: string;
      membershipName?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    planId?: string;
    membershipStatus?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    picture?: string;
    provider: string;
    planId?: string;
    membershipStatus?: string;
    membershipId?: string;
    membershipName?: string;
    updatedAt?: string;
  }
}
