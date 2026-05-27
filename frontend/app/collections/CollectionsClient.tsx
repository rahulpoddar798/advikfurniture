'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { ChevronDown, Search, X, Star, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  createdAt: Date | string;
  material?: string | null;
  stock: number;
  category?: {
    name: string;
  } | null;
  reviews?: {
    rating: number;
  }[];
}

interface CollectionsClientProps {
  initialProducts: Product[];
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

  // Amazon-style filter states
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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

  // Helper: Calculate average rating
  const getAverageRating = (reviews?: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  };

  // 1. Client-Side Filter Logic (Responsive & Real-time)
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Rating Filter (e.g. 4+ Stars)
      if (selectedRating !== null) {
        const avgRating = getAverageRating(product.reviews);
        if (avgRating < selectedRating) return false;
      }

      // 2. Price Range Filter
      const price = Number(product.price);
      if (selectedPriceRange) {
        if (selectedPriceRange === 'under-50000' && price >= 50000) return false;
        if (selectedPriceRange === '50000-150000' && (price < 50000 || price > 150000)) return false;
        if (selectedPriceRange === 'over-150000' && price <= 150000) return false;
      }

      // 3. Custom Price Filter
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;

      // 4. Material Filter
      if (selectedMaterial) {
        if (!product.material || !product.material.toLowerCase().includes(selectedMaterial.toLowerCase())) {
          return false;
        }
      }

      // 5. Availability Filter
      if (onlyInStock && product.stock <= 0) return false;

      return true;
    });
  }, [initialProducts, selectedRating, selectedPriceRange, minPrice, maxPrice, selectedMaterial, onlyInStock]);

  // 2. Client-Side Sorting Logic
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortBy === 'Price: Low to High') {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'Price: High to Low') {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'Avg. Customer Review') {
      sorted.sort((a, b) => getAverageRating(b.reviews) - getAverageRating(a.reviews));
    } else {
      // Newest
      sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  const clearAllFilters = () => {
    setSelectedRating(null);
    setSelectedPriceRange(null);
    setMinPrice('');
    setMaxPrice('');
    setSelectedMaterial(null);
    setOnlyInStock(false);
    setActiveCategory('All');
    setSearchQuery('');
    router.push('/collections');
  };

  const materials = ['Oak', 'Teak', 'Leather', 'Velvet', 'Steel'];

  const SidebarContent = () => (
    <div className="space-y-8 pr-4">
      {/* Category / Department List */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-900 dark:text-white mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
          Departments
        </h3>
        <div className="flex flex-col space-y-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`text-left text-xs font-bold transition-colors ${
                activeCategory === cat ? 'text-stone-950 dark:text-white underline decoration-2 underline-offset-4' : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Reviews Rating Filter */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-900 dark:text-white mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
          Customer Reviews
        </h3>
        <div className="flex flex-col space-y-2">
          {[4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
              className={`flex items-center space-x-2 text-xs font-bold transition-all text-left ${
                selectedRating === stars ? 'text-stone-950 dark:text-white scale-[1.02]' : 'text-stone-500 dark:text-stone-400'
              }`}
            >
              <div className="flex text-amber-500 shrink-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < stars ? 'currentColor' : 'none'}
                    className="text-amber-500"
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filters */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-900 dark:text-white mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
          Price Range
        </h3>
        <div className="flex flex-col space-y-3">
          <label className="flex items-center space-x-2.5 text-xs text-stone-600 dark:text-stone-400 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPriceRange === 'under-50000'}
              onChange={() => setSelectedPriceRange(selectedPriceRange === 'under-50000' ? null : 'under-50000')}
              className="accent-stone-950 dark:accent-white"
            />
            <span>Under ₹50,000</span>
          </label>
          <label className="flex items-center space-x-2.5 text-xs text-stone-600 dark:text-stone-400 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPriceRange === '50000-150000'}
              onChange={() => setSelectedPriceRange(selectedPriceRange === '50000-150000' ? null : '50000-150000')}
              className="accent-stone-950 dark:accent-white"
            />
            <span>₹50,000 - ₹1,50,000</span>
          </label>
          <label className="flex items-center space-x-2.5 text-xs text-stone-600 dark:text-stone-400 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPriceRange === 'over-150000'}
              onChange={() => setSelectedPriceRange(selectedPriceRange === 'over-150000' ? null : 'over-150000')}
              className="accent-stone-950 dark:accent-white"
            />
            <span>Over ₹1,50,000</span>
          </label>

          {/* Min/Max Fields */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-16 px-2 py-1 text-xs border border-stone-300 dark:border-stone-800 rounded bg-transparent dark:text-white"
            />
            <span className="text-stone-400 text-xs">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-16 px-2 py-1 text-xs border border-stone-300 dark:border-stone-800 rounded bg-transparent dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Materials Filter */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-900 dark:text-white mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
          Materials
        </h3>
        <div className="flex flex-col space-y-2.5">
          {materials.map((mat) => (
            <label key={mat} className="flex items-center space-x-2.5 text-xs text-stone-600 dark:text-stone-400 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMaterial === mat}
                onChange={() => setSelectedMaterial(selectedMaterial === mat ? null : mat)}
                className="accent-stone-950 dark:accent-white"
              />
              <span>{mat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-900 dark:text-white mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
          Availability
        </h3>
        <label className="flex items-center space-x-2.5 text-xs text-stone-600 dark:text-stone-400 font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={() => setOnlyInStock(!onlyInStock)}
            className="accent-stone-950 dark:accent-white"
          />
          <span>Exclude Out of Stock</span>
        </label>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={clearAllFilters}
        className="w-full py-2.5 bg-stone-900 dark:bg-stone-800 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="pt-36 md:pt-40 pb-20 px-4 md:px-6 bg-stone-50 dark:bg-stone-950 transition-colors duration-500 min-h-screen">
      <div className="container mx-auto">
        <div className="flex gap-8">
          
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <SidebarContent />
          </aside>

          {/* Right Product Listings Pane */}
          <div className="flex-1 space-y-8">
            
            {/* Catalog Info & Sorting Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 px-5 bg-white dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800 rounded-2xl gap-4">
              <div className="text-xs font-bold text-stone-500 dark:text-stone-400">
                Showing <span className="text-stone-900 dark:text-white font-black">{sortedProducts.length}</span> results 
                {searchQuery && (
                  <span> for &quot;<span className="text-stone-900 dark:text-white font-black">{searchQuery}</span>&quot;</span>
                )}
              </div>

              <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center space-x-2 text-xs font-bold uppercase tracking-wider dark:text-white px-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl"
                >
                  <Filter size={14} />
                  <span>Filters</span>
                </button>

                {/* Sort dropdown */}
                <div className="relative group shrink-0">
                  <button className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest dark:text-white px-4 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl">
                    <span>Sort: {sortBy}</span>
                    <ChevronDown size={14} />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-stone-900 shadow-2xl border border-stone-100 dark:border-stone-800 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-30 rounded-xl overflow-hidden">
                    {['Newest', 'Price: Low to High', 'Price: High to Low', 'Avg. Customer Review'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSortChange(option)}
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
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {sortedProducts.map((product) => {
                  const ratingAvg = getAverageRating(product.reviews);
                  const ratingCount = product.reviews?.length || 0;
                  const estimatedDel = product.stock > 0 ? "Get it by Monday, Jun 1" : "Temporarily Out of Stock";
                  return (
                    <ProductCard 
                      key={product.id} 
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.images?.[0] || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'}
                      category={product.category?.name || 'Furniture'}
                      rating={ratingAvg}
                      reviewCount={ratingCount}
                      estimatedDelivery={estimatedDel}
                    />
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {sortedProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center bg-white dark:bg-stone-900/20 border border-dashed border-stone-200 dark:border-stone-800 rounded-3xl"
              >
                <p className="text-stone-400 font-serif italic text-xl">No items match your Amazon-style filters.</p>
                <button 
                  onClick={clearAllFilters}
                  className="mt-6 text-xs font-bold uppercase tracking-widest border-b border-stone-900 pb-1 dark:text-white dark:border-white"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Filters Slide-out Modal */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-full max-w-xs bg-white dark:bg-stone-900 z-[99] shadow-2xl p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-black uppercase tracking-wider dark:text-white">Filter Results</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="dark:text-white">
                  <X size={20} />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
