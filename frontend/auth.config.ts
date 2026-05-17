import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Role } from "@/types";

// Debug logging for server-side development only.
if (typeof window === "undefined" && process.env.NODE_ENV === "development") {
  if (!process.env.GOOGLE_CLIENT_ID) console.warn("Missing GOOGLE_CLIENT_ID");
  if (!process.env.GOOGLE_CLIENT_SECRET) console.warn("Missing GOOGLE_CLIENT_SECRET");
  if (!process.env.AUTH_SECRET) console.warn("Missing AUTH_SECRET");
  
  // Log critical info for debugging redirect issues
  console.log("--- Auth Debug Info ---");
  console.log("VERCEL_URL:", process.env.VERCEL_URL);
  console.log("AUTH_URL:", process.env.AUTH_URL);
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  console.log("--- End Auth Debug ---");
}

export const authConfig = {
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // Credentials provider will be fully defined in auth.ts to avoid Prisma in middleware
    Credentials({}),
  ],
  debug: process.env.NODE_ENV === "development", // Enable debug logs in dev
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as Role | undefined) || "USER";
        session.user.id = (token.id as string | undefined) || "";
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth",
  },
} satisfies NextAuthConfig;
