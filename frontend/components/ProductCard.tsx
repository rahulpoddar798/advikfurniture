'use client';

import React, { memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

const ProductCard: React.FC<ProductCardProps> = memo(({ id, name, price, image, category }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      price,
      quantity: 1,
      image,
    });
  }, [addItem, id, name, price, image]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group will-change-transform"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-stone-800 rounded-sm">
        <Link href={`/product/${id}`} className="block w-full h-full relative">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 will-change-transform"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          />
        </Link>
        
        {/* Hover Actions - Optimized with CSS transforms */}
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center space-x-4 pointer-events-none group-hover:pointer-events-auto">
          <button 
            onClick={handleAddToCart}
            className="bg-white dark:bg-stone-900 p-4 rounded-full text-stone-900 dark:text-white hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-900 transition-all transform translate-y-8 group-hover:translate-y-0 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-90"
            title="Add to Cart"
            aria-label={`Add ${name} to cart`}
          >
            <ShoppingCart size={20} />
          </button>
          <button 
            className="bg-white dark:bg-stone-900 p-4 rounded-full text-stone-900 dark:text-white hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-900 transition-all transform translate-y-8 group-hover:translate-y-0 duration-700 delay-100 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-90"
            title="Add to Wishlist"
            aria-label={`Add ${name} to wishlist`}
          >
            <Heart size={20} />
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
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
