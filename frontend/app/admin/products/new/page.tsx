import React from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { getAdminCategories } from '@/app/actions/admin/categories';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <ProductForm categories={categories} />
  );
}
