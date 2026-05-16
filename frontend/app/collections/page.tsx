'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import api from '@/lib/api';

const CollectionsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sortBy, setSortBy] = useState('Newest');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categories = ['All', 'Chairs', 'Sofas', 'Tables', 'Beds', 'Storage', 'Office'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (activeCategory !== 'All') params.category = activeCategory;
        if (debouncedSearchQuery) params.search = debouncedSearchQuery;
        
        const response = await api.get('/products', { params });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, debouncedSearchQuery]);

  const sortedProducts = React.useMemo(() => {
    const sorted = [...products];
    if (sortBy === 'Price: Low to High') {
      return sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'Price: High to Low') {
      return sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      // Newest
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }
  }, [products, sortBy]);

  return (
    <div className="pt-32 pb-20 px-6 bg-stone-50 dark:bg-stone-950 transition-colors duration-500">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-16 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold tracking-tighter dark:text-white"
          >
            Collections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-stone-500 dark:text-stone-400 max-w-xl"
          >
            Explore our meticulously curated selection of premium furniture, where each piece is a testament to modern craftsmanship and timeless design.
          </motion.p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-y border-stone-200 dark:border-stone-800 mb-12 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-8 overflow-x-auto w-full md:w-auto no-scrollbar pb-4 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat ? 'text-stone-900 dark:text-white border-b-2 border-stone-900 dark:border-white' : 'text-stone-400 hover:text-stone-600'
                } pb-1`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
            <div className="relative flex items-center bg-stone-100 dark:bg-stone-900 rounded-full px-4 py-2 flex-1 md:flex-none">
              <Search size={14} className="text-stone-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs font-bold uppercase tracking-widest outline-none w-full md:w-32 dark:text-white"
              />
            </div>

            <div className="relative group">
              <button className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest dark:text-white">
                <span>Sort: {sortBy}</span>
                <ChevronDown size={14} />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-stone-900 shadow-xl border border-stone-100 dark:border-stone-800 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-10">
                {['Newest', 'Price: Low to High', 'Price: High to Low'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors dark:text-white"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-[4/5] bg-stone-200 dark:bg-stone-800 animate-pulse" />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && sortedProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <p className="text-stone-400 font-serif italic text-xl">No masterpieces found in this category yet.</p>
            <button 
              onClick={() => {setActiveCategory('All'); setSearchQuery('');}}
              className="mt-6 text-xs font-bold uppercase tracking-widest border-b border-stone-900 pb-1 dark:text-white dark:border-white"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
