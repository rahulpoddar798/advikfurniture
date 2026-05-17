import React from 'react';
import { getProducts, getCategories } from '@/lib/services';
import CollectionsClient from './CollectionsClient';

export const dynamic = 'force-dynamic';

interface CollectionsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CollectionsPage({ searchParams }: CollectionsPageProps) {
  const params = await searchParams;
  const category = (params.category as string) || 'All';
  const query = (params.query as string) || '';
  const sort = (params.sort as string) || 'Newest';

  const [products, categoriesData] = await Promise.all([
    getProducts({ category, search: query }),
    getCategories()
  ]);

  const categoryNames = ['All', ...categoriesData.map(c => c.name)];

  return (
    <CollectionsClient 
      initialProducts={products} 
      categories={categoryNames}
      initialCategory={category}
      initialQuery={query}
      initialSort={sort}
    />
  );
}
