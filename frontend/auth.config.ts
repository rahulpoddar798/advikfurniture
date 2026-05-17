import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// Debug logging for server-side (Vercel logs)
if (typeof window === "undefined") {
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
  // Prioritize AUTH_URL if set, otherwise use VERCEL_URL. 
  // On Vercel, VERCEL_URL is often a unique deployment URL, so setting AUTH_URL to your main domain is safer.
  redirectProxyUrl: process.env.AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined),
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
