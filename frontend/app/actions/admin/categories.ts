'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

async function checkAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  const adminRoles = ["SUPER_ADMIN", "STAFF_ADMIN", "CONTENT_MANAGER"];
  
  if (!session || !role || !adminRoles.includes(role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getAdminCategories() {
  try {
    await checkAdmin();
    // Simplified fetch to avoid potential aggregation issues in production
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching admin categories:", error);
    return [];
  }
}

export async function createCategory(values: z.infer<typeof CategorySchema>) {
  try {
    await checkAdmin();
    const validated = CategorySchema.parse(values);
    
    const category = await prisma.category.create({
      data: validated
    });
    
    revalidatePath("/admin/categories");
    revalidatePath("/collections");
    return { success: true, category };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create category" };
  }
}

export async function updateCategory(id: string, values: z.infer<typeof CategorySchema>) {
  try {
    await checkAdmin();
    const validated = CategorySchema.parse(values);
    
    const category = await prisma.category.update({
      where: { id },
      data: validated
    });
    
    revalidatePath("/admin/categories");
    revalidatePath("/collections");
    return { success: true, category };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await checkAdmin();
    
    // Check if category has products
    const productsCount = await prisma.product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return { error: "Cannot delete category with active products" };
    }
    
    await prisma.category.delete({ where: { id } });
    
    revalidatePath("/admin/categories");
    revalidatePath("/collections");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete category" };
  }
}
