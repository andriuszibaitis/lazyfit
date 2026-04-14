import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Trūksta prisijungimo duomenų");
        }

        // Search by primary email or linked email
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.email },
              { linkedEmail: credentials.email },
            ],
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Neteisingi prisijungimo duomenys");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordValid) {
          throw new Error("Neteisingi prisijungimo duomenys");
        }

        return {
          id: user.id,
          email: user.email ?? "",
          name: user.name ?? "",
          role: user.role || "user",
          planId: user.planId ?? undefined,
          membershipStatus: user.membershipStatus ?? undefined,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth/prisijungti",
    signOut: "/",
    error: "/auth/prisijungti",
    newUser: "/auth/registracija",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            image: true,
            gender: true,
            planId: true,
            membershipStatus: true,
            membership: {
              select: {
                id: true,
                name: true,
                planId: true,
              },
            },
          },
        });

        if (dbUser) {
          // Atnaujinti token su naujausiais duomenimis
          token.id = dbUser.id;
          token.name = dbUser.name ?? undefined;
          token.role = dbUser.role;
          token.picture = dbUser.image ?? undefined;
          token.gender = dbUser.gender ?? undefined;
          token.planId = dbUser.planId ?? undefined;
          token.membershipStatus = dbUser.membershipStatus ?? undefined;
          token.membershipId = dbUser.membership?.id;
          token.membershipName = dbUser.membership?.name;

          token.updatedAt = new Date().toISOString();
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.image = token.picture as string | undefined;
        session.user.provider = token.provider as string;
        session.user.gender = token.gender as string | undefined;
        session.user.planId = token.planId as string | undefined;
        session.user.membershipStatus = token.membershipStatus as
          | string
          | undefined;
        session.user.membershipId = token.membershipId as string | undefined;
        session.user.membershipName = token.membershipName as
          | string
          | undefined;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const googleEmail = user.email as string;

        // Check if a user exists with this Google email as primary
        const existingUser = await prisma.user.findUnique({
          where: { email: googleEmail },
        });

        if (!existingUser) {
          // Check if a credentials user has this email as linkedEmail
          const linkedUser = await prisma.user.findFirst({
            where: { linkedEmail: googleEmail },
          });

          if (linkedUser) {
            // Credentials user linked this Google email — update provider info
            await prisma.user.update({
              where: { id: linkedUser.id },
              data: {
                image: user.image as string | undefined,
              },
            });
          } else {
            // Brand new user
            await prisma.user.create({
              data: {
                email: googleEmail,
                name: user.name as string,
                image: user.image as string | undefined,
                role: "user",
                hashedPassword: null,
                provider: account.provider,
              },
            });
          }
        } else if (existingUser.provider === "credentials") {
          // Credentials user signing in with Google — link Google to existing account
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              provider: "google",
              linkedEmail: existingUser.email,
              email: googleEmail,
              image: user.image as string | undefined,
            },
          });
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  cookies: {
    sessionToken: {
      name: `lazyfit.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `lazyfit.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `lazyfit.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
