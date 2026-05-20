import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import { Role } from "@/types";
import { siteUrl } from "@/lib/site";

declare module "next-auth" {
  interface User {
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  callbacks: {
    async redirect({ url, baseUrl }) {
      const appBaseUrl = siteUrl || baseUrl;

      if (url.startsWith("/")) {
        return `${appBaseUrl}${url}`;
      }

      try {
        const targetUrl = new URL(url);
        const currentBaseUrl = new URL(baseUrl);
        const appUrl = new URL(appBaseUrl);

        if (targetUrl.origin === appUrl.origin) {
          return url;
        }

        if (targetUrl.origin === currentBaseUrl.origin) {
          return `${appUrl.origin}${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
        }
      } catch {
        return appBaseUrl;
      }

      return appBaseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string | undefined) || "";
        session.user.role = (token.role as Role | undefined) || "USER";
      }
      return session;
    },
  },
  providers: [
    ...authConfig.providers.filter(p => p.id !== 'credentials'),
    Credentials({
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

          if (!parsedCredentials.success) return null;

          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({ where: { email } });

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
          console.error("Auth error:", error);
        }
        return null;
      },
    }),
  ],
});
