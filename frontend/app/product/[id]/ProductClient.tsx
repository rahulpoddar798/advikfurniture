'use client';

import React, { useState, useCallback, useMemo, useTransition, useEffect } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  MapPin, 
  Lock, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toggleWishlistItem } from '@/app/actions/settings';

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: Date | string;
  user: {
    name?: string | null;
    image?: string | null;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  shortDescription?: string | null;
  images?: string[] | null;
  material?: string | null;
  dimensions?: string | null;
  stock: number;
  rating?: number | null;
  sku?: string | null;
  colors?: string[];
  reviews?: Review[] | null;
  category?: {
    name: string;
  } | null;
}

interface ProductClientProps {
  product: Product;
  initialIsInWishlist?: boolean;
}

export default function ProductClient({ product, initialIsInWishlist = false }: ProductClientProps) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlistActive, setIsWishlistActive] = useState(initialIsInWishlist);
  const [isWishlistPending, startWishlistTransition] = useTransition();

  useEffect(() => {
    setIsWishlistActive(initialIsInWishlist);
  }, [initialIsInWishlist]);

  const handleWishlistToggle = useCallback(() => {
    startWishlistTransition(async () => {
      const res = await toggleWishlistItem(product.id);
      if (res.error) {
        toast.error(res.error === "Unauthorized" ? "Please sign in to manage your wishlist." : res.error);
      } else {
        setIsWishlistActive(res.active || false);
        toast.success(res.success);
      }
    });
  }, [product.id]);

  const handleAddToCart = useCallback(() => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0] || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'
    });
    toast.success(`${product.name} added to cart`);
  }, [addItem, product.id, product.name, product.price, product.images, quantity]);

  const handleBuyNow = useCallback(() => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0] || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'
    });
    router.push('/checkout');
  }, [addItem, product.id, product.name, product.price, product.images, quantity, router]);

  const images = useMemo<string[]>(() => 
    (product.images && product.images.length > 0) 
      ? product.images 
      : ['https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'],
    [product.images]
  );

  const handlePrevImage = useCallback(() => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Average rating calculation
  const averageRating = useMemo(() => {
    if (!product.reviews || product.reviews.length === 0) return 4.5; // Premium fallback
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / product.reviews.length).toFixed(1));
  }, [product.reviews]);

  const totalReviews = product.reviews?.length || 0;

  // Review star distribution calculations
  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!product.reviews || product.reviews.length === 0) {
      // Premium placeholder distribution
      return { 5: 75, 4: 15, 3: 6, 2: 3, 1: 1 };
    }
    product.reviews.forEach((r) => {
      const roundedRating = Math.round(r.rating) as 5 | 4 | 3 | 2 | 1;
      if (distribution[roundedRating] !== undefined) {
        distribution[roundedRating]++;
      }
    });
    const total = product.reviews.length;
    return {
      5: Math.round((distribution[5] / total) * 100),
      4: Math.round((distribution[4] / total) * 100),
      3: Math.round((distribution[3] / total) * 100),
      2: Math.round((distribution[2] / total) * 100),
      1: Math.round((distribution[1] / total) * 100),
    };
  }, [product.reviews]);

  // Split description into bullet points for "About this item"
  const bulletPoints = useMemo(() => {
    return product.description
      .split('.')
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 10);
  }, [product.description]);

  return (
    <div className="pt-32 pb-24 px-4 md:px-8 bg-stone-50 dark:bg-stone-950 transition-colors duration-500 min-h-screen">
      <div className="container mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-stone-400 mb-8 flex items-center space-x-2">
          <Link href="/collections" className="hover:text-stone-900 dark:hover:text-white transition-colors">Collections</Link>
          <span>/</span>
          <Link href={`/collections?category=${product.category?.name}`} className="hover:text-stone-900 dark:hover:text-white transition-colors">{product.category?.name || 'Furniture'}</Link>
          <span>/</span>
          <span className="text-stone-900 dark:text-white truncate max-w-xs">{product.name}</span>
        </div>

        {/* 3-Column Layout (Gallery | Product Info | Buy Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Image Gallery (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/5] bg-stone-100 dark:bg-stone-900 overflow-hidden rounded-2xl shadow-sm border border-stone-200/50 dark:border-stone-800">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    fill
                    priority={selectedImage === 0}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
                <button 
                  onClick={handlePrevImage}
                  className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm p-3 hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-900 transition-all text-stone-900 dark:text-white rounded-full shadow-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm p-3 hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-900 transition-all text-stone-900 dark:text-white rounded-full shadow-md"
                  aria-label="Next image"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square relative bg-stone-100 dark:bg-stone-900 overflow-hidden border-2 transition-all rounded-xl ${
                    selectedImage === idx ? 'border-stone-900 dark:border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" sizes="100px" />
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Product Info & Bullet Specs (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400 block">{product.category?.name || 'Furniture'}</span>
              <h1 className="text-2xl md:text-3xl font-serif font-black text-stone-950 dark:text-white leading-tight">{product.name}</h1>
              
              {/* Rating stars link */}
              <div className="flex items-center space-x-2">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                      className="text-amber-500"
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-950 dark:text-white">{averageRating} out of 5</span>
                <span className="text-stone-300 dark:text-stone-700">|</span>
                <span className="text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer transition-colors">{totalReviews} customer ratings</span>
              </div>
            </div>

            <div className="border-y border-stone-200 dark:border-stone-800 py-4 flex flex-col space-y-1">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">Price</div>
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl font-serif font-black text-stone-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                {product.price > 100000 && (
                  <span className="text-xs text-stone-400 line-through">₹{(product.price * 1.2).toLocaleString()}</span>
                )}
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider">Inclusive of all taxes</p>
            </div>

            {/* Bullet Points: About this item */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-stone-900 dark:text-white">About this item</h3>
              <ul className="list-disc pl-5 space-y-2.5 text-xs font-semibold text-stone-600 dark:text-stone-400 leading-relaxed">
                {bulletPoints.length > 0 ? (
                  bulletPoints.map((bp, i) => <li key={i}>{bp}.</li>)
                ) : (
                  <>
                    <li>Masterfully constructed using premium hand-selected materials.</li>
                    <li>Designed to merge functional everyday stability with timeless aesthetic balance.</li>
                    <li>Crafted under strict quality tolerances by senior carpenters.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Specifications Table */}
            <div className="space-y-4 pt-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-stone-900 dark:text-white">Technical Details</h3>
              <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-2 border-b border-stone-200 dark:border-stone-800">
                  <div className="bg-stone-100 dark:bg-stone-900/50 p-3 font-black text-stone-500 uppercase tracking-wider">Material</div>
                  <div className="p-3 font-semibold dark:text-white">{product.material || 'Premium Woods & Fabric'}</div>
                </div>
                <div className="grid grid-cols-2 border-b border-stone-200 dark:border-stone-800">
                  <div className="bg-stone-100 dark:bg-stone-900/50 p-3 font-black text-stone-500 uppercase tracking-wider">Dimensions</div>
                  <div className="p-3 font-semibold dark:text-white">{product.dimensions || 'Standard Custom Sizing'}</div>
                </div>
                <div className="grid grid-cols-2 border-b border-stone-200 dark:border-stone-800">
                  <div className="bg-stone-100 dark:bg-stone-900/50 p-3 font-black text-stone-500 uppercase tracking-wider">Serial (SKU)</div>
                  <div className="p-3 font-mono font-semibold dark:text-white">{product.sku || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="bg-stone-100 dark:bg-stone-900/50 p-3 font-black text-stone-500 uppercase tracking-wider">Status</div>
                  <div className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Sticky Buy Box (lg:col-span-3) */}
          <div className="lg:col-span-3 lg:sticky lg:top-36 bg-white dark:bg-stone-900/30 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
            <div>
              <div className="text-xl font-serif font-black text-stone-950 dark:text-white">₹{product.price.toLocaleString()}</div>
              
              <div className="mt-4 flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Truck size={14} className="shrink-0" />
                <span>FREE shipping in India</span>
              </div>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider ml-6 mt-0.5">Estimated delivery: Wednesday, Jun 3</p>
            </div>

            {/* Location Selector */}
            <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer pt-2 border-t border-stone-100 dark:border-stone-800">
              <MapPin size={14} />
              <span className="font-bold">Deliver to India - Delhi 110001</span>
            </div>

            {/* Stock Message */}
            <div>
              {product.stock > 0 ? (
                <div className="space-y-1">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">In Stock</span>
                  {product.stock <= 5 && (
                    <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Only {product.stock} left in stock - order soon.</p>
                  )}
                </div>
              ) : (
                <span className="text-sm font-bold text-red-500">Temporarily Out of Stock</span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center justify-between border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-2 text-xs">
                <span className="font-bold text-stone-500 uppercase tracking-widest">Qty</span>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    className="text-base font-black px-2 hover:text-stone-400"
                  >
                    -
                  </button>
                  <span className="font-black w-4 text-center dark:text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} 
                    className="text-base font-black px-2 hover:text-stone-400"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full bg-stone-950 dark:bg-white text-white dark:text-stone-950 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={14} />
                <span>Add to Cart</span>
              </button>
              
              <button 
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full bg-amber-500 text-stone-950 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calendar size={14} />
                <span>Buy Now</span>
              </button>
              
              <button 
                onClick={handleWishlistToggle}
                disabled={isWishlistPending}
                className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-stone-50 dark:hover:bg-stone-800 transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
              >
                <Heart size={14} className={isWishlistActive ? "fill-red-500 text-red-500" : ""} />
                <span>{isWishlistActive ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Buying specifications */}
            <div className="text-[10px] text-stone-400 space-y-1.5 font-bold uppercase tracking-wider pt-4 border-t border-stone-100 dark:border-stone-800">
              <div className="flex justify-between">
                <span>Ships from</span>
                <span className="text-stone-600 dark:text-stone-300">Advik Express</span>
              </div>
              <div className="flex justify-between">
                <span>Sold by</span>
                <span className="text-stone-600 dark:text-stone-300">Advik Workshops</span>
              </div>
            </div>

            {/* Badges */}
            <div className="pt-2 flex flex-col space-y-2 text-[9px] font-bold uppercase tracking-wider text-stone-500">
              <div className="flex items-center space-x-2">
                <Lock size={12} className="text-stone-400 shrink-0" />
                <span>Secure Transaction</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck size={12} className="text-stone-400 shrink-0" />
                <span>1 Year Manufacturer Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Amazon-Style Customer Reviews Section */}
        <section className="mt-24 pt-16 border-t border-stone-200 dark:border-stone-800">
          <h2 className="text-2xl font-serif font-black text-stone-900 dark:text-white mb-10">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Reviews Left: Star Rating Distribution Graph */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                        className="text-amber-500"
                      />
                    ))}
                  </div>
                  <span className="text-lg font-black dark:text-white">{averageRating} out of 5</span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">{totalReviews} global ratings</p>
              </div>

              {/* Distribution bars */}
              <div className="space-y-3.5">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const pct = ratingDistribution[stars as 5|4|3|2|1] || 0;
                  return (
                    <div key={stars} className="flex items-center space-x-4 text-xs font-semibold">
                      <span className="w-12 text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider">{stars} star</span>
                      <div className="flex-1 h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 transition-all duration-500 rounded-full" 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-bold text-stone-500 dark:text-stone-400">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Right: List of Reviews */}
            <div className="lg:col-span-8 space-y-10">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-8 last:border-b-0">
                    {/* User profile identifier */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden relative flex items-center justify-center">
                        {rev.user?.image ? (
                          <Image src={rev.user.image} alt={rev.user.name || 'User'} fill className="object-cover" />
                        ) : (
                          <span className="text-xs font-bold uppercase text-stone-500">{rev.user?.name?.[0] || 'A'}</span>
                        )}
                      </div>
                      <span className="text-xs font-black dark:text-white">{rev.user?.name || 'Verified Customer'}</span>
                    </div>

                    {/* Stars and Date info */}
                    <div className="flex items-center space-x-3">
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < rev.rating ? "currentColor" : "none"}
                            className="text-amber-500"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                        Reviewed on {new Date(rev.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Verified purchase status */}
                    <div className="flex items-center space-x-1.5 text-[9px] font-bold uppercase tracking-wider text-amber-600">
                      <CheckCircle2 size={12} />
                      <span>Verified Purchase</span>
                    </div>

                    {/* Content */}
                    <p className="text-xs font-medium text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
                      {rev.comment || "An absolutely spectacular furniture addition. The build quality exceeds ordinary standards and merges perfectly with the decor."}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center bg-stone-100 dark:bg-stone-900/10 border border-dashed border-stone-200 dark:border-stone-800 rounded-3xl">
                  <p className="text-stone-400 font-serif italic text-base">This masterpiece has no customer reviews yet.</p>
                  <p className="text-stone-500 text-xs mt-2">Buy this item and be the first to review it!</p>
                </div>
              )}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
