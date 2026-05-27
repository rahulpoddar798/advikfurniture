import React from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { getAdminCategories } from '@/app/actions/admin/categories';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  console.log("--- DEBUG: Entering NewProductPage ---");
  const session = await auth();
  console.log("Session User:", session?.user?.email);
  console.log("Session Role:", session?.user?.role);

  let categories;
  try {
    categories = await getAdminCategories();
    console.log("Successfully fetched categories:", categories.length);
  } catch (error) {
    console.error("CRITICAL ERROR in NewProductPage:", error);
    throw error; // Let error.tsx handle it
  }

  return (
    <ProductForm categories={categories} />
  );
}
