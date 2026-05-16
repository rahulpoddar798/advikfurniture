'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';

const CategoryPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  // Format slug for display (e.g., 'living-room' -> 'Living Room')
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  // Mock data - In a real app, you'd fetch this based on the category slug
  const allProducts = [
    { id: '1', name: 'Eames Lounge Chair', price: 4500, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop', category: 'living' },
    { id: '2', name: 'Nordic Velvet Sofa', price: 2200, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop', category: 'living' },
    { id: '3', name: 'Minimalist Oak Desk', price: 850, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba62d?q=80&w=1000&auto=format&fit=crop', category: 'office' },
    { id: '4', name: 'Floating Platform Bed', price: 1800, image: 'https://images.unsplash.com/photo-1505693419173-42b9258a6347?q=80&w=1000&auto=format&fit=crop', category: 'bedroom' },
    { id: '6', name: 'Velvet Task Chair', price: 450, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=1000&auto=format&fit=crop', category: 'office' },
  ];

  const filteredProducts = allProducts.filter(p => p.category.toLowerCase() === slug.toLowerCase());

  return (
    <div className="pt-32 pb-20 px-6 bg-stone-50 dark:bg-stone-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto">
        <div className="mb-16 space-y-4 text-center">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">Category</h3>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold tracking-tighter dark:text-white"
          >
            {categoryName}
          </motion.h1>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-6">
            <p className="text-stone-400 font-serif italic text-xl">Our curators are currently selecting masterpieces for this collection.</p>
            <a href="/collections" className="inline-block text-xs font-bold uppercase tracking-widest border-b border-stone-900 dark:border-white pb-1 dark:text-white">
              Back to all collections
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
