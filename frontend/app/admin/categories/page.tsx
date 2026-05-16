import React from 'react';
import { getAdminCategories } from '@/app/actions/admin/categories';
import CategoryList from '@/components/admin/CategoryList';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h2 className="text-4xl font-serif font-bold tracking-tight text-white">Categories</h2>
        <p className="text-stone-500 font-medium">Organize your collection into intuitive groups and subcategories.</p>
      </div>

      <CategoryList initialCategories={categories} />
    </div>
  );
}
