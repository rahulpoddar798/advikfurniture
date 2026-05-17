import { prisma } from "./prisma";
import { cache } from "react";

export const getFeaturedProducts = cache(async () => {
  return await prisma.product.findMany({
    where: { featured: true, status: 'PUBLISHED' },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 8
  });
});

export const getProducts = cache(async (options: { 
  category?: string, 
  search?: string, 
  limit?: number,
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'HIDDEN'
} = {}) => {
  const { category, search, limit, status = 'PUBLISHED' } = options;
  
  const where: any = { status };

  if (category && category !== 'All') {
    where.category = { name: category };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
});

export const getProductById = cache(async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      shortDescription: true,
      price: true,
      discountPrice: true,
      images: true,
      sku: true,
      stock: true,
      featured: true,
      isTrending: true,
      isBestSeller: true,
      dimensions: true,
      material: true,
      colors: true,
      tags: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        }
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              image: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    },
  });
});

export const getCategories = cache(async () => {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    }
  });
});
