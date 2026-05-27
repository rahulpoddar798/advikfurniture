"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

// --- PROFILE ---
const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  image: z.string().optional(),
});

export async function updateProfile(values: z.infer<typeof ProfileSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const validatedFields = ProfileSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { ...validatedFields.data },
    });
    revalidatePath("/settings/profile");
    return { success: "Profile updated successfully!" };
  } catch {
    return { error: "Something went wrong!" };
  }
}

// --- PASSWORD ---
const PasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function changePassword(values: z.infer<typeof PasswordSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const validatedFields = PasswordSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { currentPassword, newPassword } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || !user.password) return { error: "User not found" };

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordsMatch) return { error: "Incorrect current password" };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    });
    return { success: "Password changed successfully!" };
  } catch {
    return { error: "Something went wrong!" };
  }
}

// --- ADDRESSES ---
const AddressSchema = z.object({
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  phone: z.string().optional(),
});

export async function addAddress(values: z.infer<typeof AddressSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const validatedFields = AddressSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  try {
    const addressCount = await prisma.address.count({ where: { userId: session.user.id } });
    await prisma.address.create({
      data: {
        userId: session.user.id,
        ...validatedFields.data,
        isDefault: addressCount === 0,
      },
    });
    revalidatePath("/settings/addresses");
    return { success: "Address added successfully!" };
  } catch {
    return { error: "Something went wrong!" };
  }
}

export async function updateAddress(id: string, values: z.infer<typeof AddressSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const validatedFields = AddressSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  try {
    await prisma.address.update({
      where: { id, userId: session.user.id },
      data: { ...validatedFields.data },
    });
    revalidatePath("/settings/addresses");
    return { success: "Address updated successfully!" };
  } catch {
    return { error: "Something went wrong!" };
  }
}

export async function deleteAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const address = await prisma.address.findUnique({ where: { id, userId: session.user.id } });
    if (!address) return { error: "Address not found" };

    await prisma.address.delete({ where: { id, userId: session.user.id } });

    if (address.isDefault) {
      const nextAddress = await prisma.address.findFirst({ where: { userId: session.user.id } });
      if (nextAddress) {
        await prisma.address.update({ where: { id: nextAddress.id }, data: { isDefault: true } });
      }
    }
    revalidatePath("/settings/addresses");
    return { success: "Address deleted successfully!" };
  } catch {
    return { error: "Something went wrong!" };
  }
}

export async function setDefaultAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
    await prisma.address.update({ where: { id, userId: session.user.id }, data: { isDefault: true } });
    revalidatePath("/settings/addresses");
    return { success: "Default address updated!" };
  } catch {
    return { error: "Something went wrong!" };
  }
}

export async function getUserAddresses() {
  const session = await auth();
  if (!session?.user?.id) return [];
  try {
    return await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: 'desc' }
    });
  } catch {
    return [];
  }
}

// --- NOTIFICATIONS ---
export async function updateNotifications(values: {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotional: boolean;
  wishlistAlerts: boolean;
  newArrivals: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await prisma.notificationSettings.upsert({
      where: { userId: session.user.id },
      update: { ...values },
      create: { userId: session.user.id, ...values },
    });
    revalidatePath("/settings/notifications");
    return { success: "Notification preferences updated!" };
  } catch {
    return { error: "Something went wrong!" };
  }
}
