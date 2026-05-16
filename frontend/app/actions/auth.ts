"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

const ResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const NewPasswordSchema = z.object({
  password: z.string().min(6, "Minimum 6 characters required"),
});

export async function reset(values: z.infer<typeof ResetSchema>) {
  console.log("--- RESET ACTION TRIGGERED ---");
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log("Validation failed:", validatedFields.error.flatten());
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;
  console.log("Searching for user with email:", email);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      console.log("User not found in database.");
      return { error: "Email not found!" };
    }

    console.log("User found. Generating token...");
    const passwordResetToken = await generatePasswordResetToken(email);
    console.log("Token generated. Attempting to send email/log link...");
    
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token
    );

    console.log("Reset flow completed successfully.");
    return { success: "Reset email sent!" };
  } catch (error) {
    console.error("CRITICAL ERROR in reset action:", error);
    return { error: "Internal server error. Please try again." };
  }
}

export async function newPassword(
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) {
  console.log("--- NEW PASSWORD ACTION TRIGGERED ---");
  if (!token) {
    console.log("Token missing from request");
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log("Validation failed");
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  try {
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!existingToken) {
      console.log("Token not found in database:", token);
      return { error: "Invalid token!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      console.log("Token has expired");
      return { error: "Token has expired!" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.email }
    });

    if (!existingUser) {
      console.log("User for token not found:", existingToken.email);
      return { error: "Email does not exist!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    });

    console.log("Password updated successfully for:", existingToken.email);
    return { success: "Password updated!" };
  } catch (error) {
    console.error("ERROR in newPassword action:", error);
    return { error: "Something went wrong!" };
  }
}

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return { success: "User created!" };
}
