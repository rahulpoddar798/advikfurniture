import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// Debug logging for server-side (Vercel logs)
if (typeof window === "undefined") {
  if (!process.env.GOOGLE_CLIENT_ID) console.warn("Missing GOOGLE_CLIENT_ID");
  if (!process.env.GOOGLE_CLIENT_SECRET) console.warn("Missing GOOGLE_CLIENT_SECRET");
  if (!process.env.AUTH_SECRET) console.warn("Missing AUTH_SECRET (Required for production)");
}

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // Credentials provider will be fully defined in auth.ts to avoid Prisma in middleware
    Credentials({}),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth",
  },
} satisfies NextAuthConfig;
