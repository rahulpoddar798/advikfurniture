import type { NextAuthConfig } from "next-auth";

export default {
  providers: [], // Providers are defined in auth.ts to avoid edge runtime issues with Prisma
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
