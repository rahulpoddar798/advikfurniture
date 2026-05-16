'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, category }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      price,
      quantity: 1,
      image,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-stone-800 rounded-sm">
        <Link href={`/product/${id}`} className="block w-full h-full">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4 pointer-events-none group-hover:pointer-events-auto">
          <button 
            onClick={handleAddToCart}
            className="bg-white dark:bg-stone-900 p-3 rounded-full text-stone-900 dark:text-white hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-900 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 active:scale-95"
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
          <button 
            className="bg-white dark:bg-stone-900 p-3 rounded-full text-stone-900 dark:text-white hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-900 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75 active:scale-95"
            title="Add to Wishlist"
          >
            <Heart size={18} />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400">
            {category}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-1 text-center md:text-left">
        <Link href={`/product/${id}`}>
          <h3 className="text-sm font-medium text-stone-900 dark:text-white uppercase tracking-wider hover:text-stone-500 transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-lg font-serif text-stone-600 dark:text-stone-400">₹{price.toLocaleString()}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
