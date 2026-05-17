import React from 'react';
import ProductCard from '@/components/ProductCard';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { getProducts } from '@/lib/services';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `${categoryName} Collection`,
    description: `Explore our premium ${categoryName} furniture collection at Advik Furniture. Crafted for elegance and comfort.`,
    openGraph: {
      title: `${categoryName} Collection | Advik Furniture`,
      description: `Explore our premium ${categoryName} furniture collection at Advik Furniture. Crafted for elegance and comfort.`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  // Format slug for display (e.g., 'living' -> 'Living')
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  // Fetch products by category name directly from DB
  const products = await getProducts({ category: categoryName });

  return (
    <div className="pt-32 pb-20 px-6 bg-stone-50 dark:bg-stone-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto">
        <div className="mb-16 space-y-4 text-center">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400 text-center">Category</h3>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter dark:text-white">
            {categoryName}
          </h1>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.images?.[0] || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'}
                category={product.category?.name || categoryName}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-6">
            <p className="text-stone-400 font-serif italic text-xl">Our curators are currently selecting masterpieces for this collection.</p>
            <Link href="/collections" className="inline-block text-xs font-bold uppercase tracking-widest border-b border-stone-900 dark:border-white pb-1 dark:text-white">
              Back to all collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
