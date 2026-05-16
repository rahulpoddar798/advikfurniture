'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  shortDescription: z.string().optional(),
  price: z.number().min(0),
  discountPrice: z.number().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1, "Category is required"),
  featured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  dimensions: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
  colors: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'HIDDEN']).default('DRAFT'),
  images: z.array(z.string()).default([]),
});

async function checkAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  const adminRoles = ["SUPER_ADMIN", "STAFF_ADMIN", "CONTENT_MANAGER"];
  
  if (!session || !adminRoles.includes(role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getAdminProducts() {
  try {
    await checkAdmin();
    return await prisma.product.findMany({
      include: { category: true },
      orderBy: { updatedAt: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return [];
  }
}

export async function createProduct(values: z.infer<typeof ProductSchema>) {
  try {
    await checkAdmin();
    const validated = ProductSchema.parse(values);
    
    const product = await prisma.product.create({
      data: {
        ...validated,
        slug: validated.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      }
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/collections");
    return { success: true, product };
  } catch (error: any) {
    return { error: error.message || "Failed to create product" };
  }
}

export async function updateProduct(id: string, values: z.infer<typeof ProductSchema>) {
  try {
    await checkAdmin();
    const validated = ProductSchema.parse(values);
    
    const product = await prisma.product.update({
      where: { id },
      data: validated
    });
    
    revalidatePath("/admin/products");
    revalidatePath(`/product/${id}`);
    revalidatePath("/collections");
    return { success: true, product };
  } catch (error: any) {
    return { error: error.message || "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await checkAdmin();
    await prisma.product.delete({ where: { id } });
    
    revalidatePath("/admin/products");
    revalidatePath("/collections");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete product" };
  }
}
