import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth",
  },
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("--- AUTHORIZE DEBUG ---");
        console.log("Attempting login for:", credentials?.email);

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log("Invalid fields in credentials");
          return null;
        }

        const { email, password } = parsedCredentials.data;
        
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.log("User not found in database:", email);
            return null;
          }

          if (!user.password) {
            console.log("User has no password set (possibly social login only)");
            return null;
          }

          console.log("Found user, comparing passwords...");
          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          if (passwordsMatch) {
            console.log("Login SUCCESS for:", email);
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          } else {
            console.log("Password MISMATCH for:", email);
          }
        } catch (error) {
          console.error("Error during authorize:", error);
        }

        console.log("Login FAILED for:", email);
        return null;
      },
    }),
  ],
});
