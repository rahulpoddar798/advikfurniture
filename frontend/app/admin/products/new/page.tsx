import React from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { getAdminCategories } from '@/app/actions/admin/categories';

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <ProductForm categories={categories} />
  );
}
