import React from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { getAdminCategories } from '@/app/actions/admin/categories';
import { getAdminProductById } from '@/app/actions/admin/products';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getAdminCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductForm initialData={product} categories={categories} />
  );
}
