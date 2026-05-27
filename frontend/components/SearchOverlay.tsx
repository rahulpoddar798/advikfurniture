'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/collections?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/95 dark:bg-stone-950/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
        >
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-full transition-colors dark:text-white"
          >
            <X size={32} />
          </button>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full max-w-4xl space-y-8"
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-stone-400 text-center">Search our Collection</h2>
            <form onSubmit={handleSearch} className="relative group">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What masterpiece are you looking for?"
                className="w-full bg-transparent border-b-2 border-stone-200 dark:border-stone-800 py-6 text-2xl sm:text-3xl md:text-6xl font-serif outline-none focus:border-stone-900 dark:focus:border-white transition-all dark:text-white"
              />
              <button 
                type="submit"
                className="absolute right-0 bottom-6 p-4 hover:translate-x-2 transition-transform dark:text-white"
              >
                <ArrowRight size={48} strokeWidth={1} />
              </button>
            </form>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {['Eames', 'Lounge', 'Velvet', 'Nordic', 'Solid Oak'].map((tag, index) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.05) }}
                  onClick={() => setQuery(tag)}
                  className="px-6 py-2 rounded-full border border-stone-200 dark:border-stone-800 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-900 transition-all dark:text-white"
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
