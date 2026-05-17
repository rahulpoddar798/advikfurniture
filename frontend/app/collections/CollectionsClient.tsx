'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { ChevronDown, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

interface CollectionsClientProps {
  initialProducts: any[];
  categories: string[];
  initialCategory: string;
  initialQuery: string;
  initialSort: string;
}

export default function CollectionsClient({ 
  initialProducts, 
  categories,
  initialCategory,
  initialQuery,
  initialSort
}: CollectionsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState(initialSort);

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'All') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/collections?${params.toString()}`);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    updateFilters({ category: cat });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ query: searchQuery });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateFilters({ sort });
  };

  const sortedProducts = useMemo(() => {
    const sorted = [...initialProducts];
    if (sortBy === 'Price: Low to High') {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'Price: High to Low') {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      // Newest
      sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }
    return sorted;
  }, [initialProducts, sortBy]);

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 md:px-6 bg-stone-50 dark:bg-stone-950 transition-colors duration-500 min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold tracking-tighter dark:text-white"
          >
            Collections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-stone-500 dark:text-stone-400 max-w-xl"
          >
            Explore our meticulously curated selection of premium furniture, where each piece is a testament to modern craftsmanship and timeless design.
          </motion.p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center py-4 md:py-6 border-y border-stone-200 dark:border-stone-800 mb-8 md:mb-12 space-y-4 lg:space-y-0 sticky top-16 md:top-20 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-30 px-4 rounded-xl">
          <div className="flex items-center space-x-4 md:space-x-8 overflow-x-auto w-full lg:w-auto no-scrollbar pb-2 lg:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat ? 'text-stone-900 dark:text-white border-b-2 border-stone-900 dark:border-white' : 'text-stone-400 hover:text-stone-600'
                } pb-1`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full lg:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-stone-100 dark:bg-stone-900 rounded-full px-4 py-2 w-full sm:w-auto">
              <Search size={14} className="text-stone-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-[9px] md:text-[10px] font-bold uppercase tracking-widest outline-none w-full sm:w-32 md:w-40 dark:text-white"
              />
              {searchQuery && (
                <button type="button" onClick={() => {setSearchQuery(''); updateFilters({ query: '' });}}>
                  <X size={12} className="text-stone-400 ml-2" />
                </button>
              )}
            </form>

            <div className="relative group w-full sm:w-auto">
              <button className="flex items-center justify-between sm:justify-start space-x-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest dark:text-white w-full sm:w-auto bg-stone-100 dark:bg-stone-900 sm:bg-transparent px-4 py-2 sm:p-0 rounded-full">
                <span>Sort: {sortBy}</span>
                <ChevronDown size={14} />
              </button>
              <div className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-white dark:bg-stone-900 shadow-2xl border border-stone-100 dark:border-stone-800 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-10 rounded-xl overflow-hidden">
                {['Newest', 'Price: Low to High', 'Price: High to Low'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className="w-full text-left px-4 py-3 text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors dark:text-white"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16"
        >
          <AnimatePresence mode="popLayout">
            {sortedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.images?.[0] || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'}
                category={product.category?.name || 'Furniture'}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <p className="text-stone-400 font-serif italic text-xl">No masterpieces found in this category yet.</p>
            <button 
              onClick={() => {
                setActiveCategory('All'); 
                setSearchQuery(''); 
                router.push('/collections');
              }}
              className="mt-6 text-xs font-bold uppercase tracking-widest border-b border-stone-900 pb-1 dark:text-white dark:border-white"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
