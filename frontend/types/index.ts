export type Role = 'USER' | 'SUPER_ADMIN' | 'STAFF_ADMIN' | 'CONTENT_MANAGER';

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug?: string | null;
  description: string;
  shortDescription?: string | null;
  price: number;
  discountPrice?: number | null;
  images: string[];
  sku?: string | null;
  stock: number;
  categoryId: string;
  category?: Category;
  featured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  dimensions?: string | null;
  material?: string | null;
  colors: string[];
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'HIDDEN';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
}
