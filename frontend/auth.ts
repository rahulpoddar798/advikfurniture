import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import { Role } from "@/types";

declare module "next-auth" {
  interface User {
    role: Role;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  debug: true, // ALWAYS enable debug for now to catch production errors
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = (user as any).role || "USER";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        
        // Fetch fresh data from DB to ensure role is up to date
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true }
          });
          
          if (dbUser) {
            (session.user as any).role = dbUser.role;
          } else {
            (session.user as any).role = token.role || "USER";
          }
        } catch (error) {
          console.error("Session callback DB error:", error);
          (session.user as any).role = token.role || "USER";
        }
      }
      return session;
    },
  },
  providers: [
    ...authConfig.providers.filter(p => p.id !== 'credentials'),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        } catch (error) {
          console.error("Error during authorize:", error);
        }

        return null;
      },
    }),
  ],
});
