'use client';

import React, { useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Trash2, Heart, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { toggleWishlistItem } from '@/app/actions/settings';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
    category?: {
      name: string;
    } | null;
  };
}

interface WishlistClientProps {
  initialItems: WishlistItem[];
}

export default function WishlistClient({ initialItems }: WishlistClientProps) {
  const [items, setItems] = React.useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const addItem = useCartStore((state) => state.addItem);

  const handleRemove = (productId: string) => {
    startTransition(async () => {
      const res = await toggleWishlistItem(productId);
      if (res.error) {
        toast.error(res.error);
      } else {
        setItems(prev => prev.filter(item => item.productId !== productId));
        toast.success("Removed from Wishlist");
      }
    });
  };

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: 1,
      image: item.product.images?.[0] || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'
    });
    toast.success(`${item.product.name} added to cart!`);
  };

  if (items.length === 0) {
    return (
      <div className="py-24 text-center space-y-6 bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-stone-200/50 dark:border-stone-800/50 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center text-stone-400">
          <Heart size={36} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-widest dark:text-white">Your Wishlist is Empty</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm">Save your favorite premium items here to track them or purchase later.</p>
        </div>
        <Link 
          href="/collections" 
          className="flex items-center space-x-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity active:scale-95"
        >
          <span>Explore Collections</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex gap-4 p-4 bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-stone-200/50 dark:border-stone-800/50 rounded-3xl relative hover:shadow-xl transition-all duration-300 group"
          >
            {/* Image */}
            <div className="w-24 h-24 aspect-square rounded-2xl bg-stone-100 dark:bg-stone-800 overflow-hidden relative shrink-0">
              <Image 
                src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'} 
                alt={item.product.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
              <div className="space-y-1">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-stone-400 block">
                  {item.product.category?.name || 'Furniture'}
                </span>
                <Link href={`/product/${item.product.id}`} className="block">
                  <h3 className="text-xs font-bold uppercase tracking-tight dark:text-white hover:text-stone-500 transition-colors truncate">
                    {item.product.name}
                  </h3>
                </Link>
                <div className="flex items-baseline space-x-2">
                  <span className="text-sm font-serif font-black dark:text-white">₹{item.product.price.toLocaleString()}</span>
                  {item.product.stock <= 0 && (
                    <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={item.product.stock <= 0}
                  className="flex-1 flex items-center justify-center space-x-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[9px] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  <ShoppingCart size={12} />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => handleRemove(item.product.id)}
                  disabled={isPending}
                  className="p-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all text-stone-400 hover:text-red-500 active:scale-95 border border-stone-200/50 dark:border-stone-800"
                  title="Remove from wishlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
