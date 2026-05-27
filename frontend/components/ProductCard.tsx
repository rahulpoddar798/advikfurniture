'use client';

import React, { memo, useCallback, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { toggleWishlistItem } from '@/app/actions/settings';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  estimatedDelivery?: string;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ 
  id, 
  name, 
  price, 
  image, 
  category,
  rating = 0,
  reviewCount = 0,
  estimatedDelivery = "Get it in 3-5 days"
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

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

  const handleCardClick = useCallback(() => {
    router.push(`/product/${id}`);
  }, [router, id]);

  const [isPending, startTransition] = useTransition();

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const res = await toggleWishlistItem(id);
      if (res.error) {
        toast.error(res.error === "Unauthorized" ? "Please sign in to manage your wishlist." : res.error);
      } else {
        toast.success(res.success);
      }
    });
  }, [id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group will-change-transform cursor-pointer bg-white dark:bg-stone-900/40 p-4 rounded-2xl border border-stone-200/50 dark:border-stone-800 hover:shadow-xl hover:border-stone-300 dark:hover:border-stone-700 transition-all duration-300 flex flex-col justify-between"
      onClick={handleCardClick}
    >
      <div className="space-y-4">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-stone-800 rounded-xl">
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
          <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center space-x-3 pointer-events-none group-hover:pointer-events-auto">
            <button 
              onClick={handleAddToCart}
              className="bg-white dark:bg-stone-900 p-3 rounded-full text-stone-900 dark:text-white hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-900 transition-all transform translate-y-8 group-hover:translate-y-0 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-90 shadow-md"
              title="Add to Cart"
              aria-label={`Add ${name} to cart`}
            >
              <ShoppingCart size={16} />
            </button>
            <button 
              onClick={handleWishlistToggle}
              disabled={isPending}
              className="bg-white dark:bg-stone-900 p-3 rounded-full text-stone-900 dark:text-white hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-900 transition-all transform translate-y-8 group-hover:translate-y-0 duration-700 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-90 shadow-md disabled:opacity-50"
              title="Add to Wishlist"
              aria-label={`Add ${name} to wishlist`}
            >
              <Heart size={16} className={isPending ? "animate-pulse" : ""} />
            </button>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400 rounded-md shadow-sm border border-stone-200/20 dark:border-stone-800">
              {category}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 px-1">
          <Link href={`/product/${id}`}>
            <h3 className="text-xs md:text-sm font-bold text-stone-950 dark:text-white uppercase tracking-wider hover:text-stone-500 transition-colors truncate">
              {name}
            </h3>
          </Link>
          
          {/* Amazon style reviews */}
          <div className="flex items-center space-x-1.5">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  fill={i < Math.round(rating) ? "currentColor" : "none"}
                  className="text-amber-500"
                />
              ))}
            </div>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-bold">
              {reviewCount > 0 ? `(${reviewCount})` : '(No reviews)'}
            </span>
          </div>

          {/* Price */}
          <p className="text-base font-serif font-black text-stone-900 dark:text-white">₹{price.toLocaleString()}</p>
          
          {/* Amazon delivery message */}
          <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wide pt-0.5">
            {estimatedDelivery}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
