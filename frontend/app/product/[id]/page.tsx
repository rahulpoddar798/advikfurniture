'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import api from '@/lib/api';

const ProductDetail = () => {
  const params = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${params.id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0] || ''
    });
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 bg-stone-50 dark:bg-stone-950 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 px-6 bg-stone-50 dark:bg-stone-950 min-h-screen flex items-center justify-center">
        <p className="text-xl font-serif dark:text-white">Product not found.</p>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'];

  return (
    <div className="pt-32 pb-20 px-6 bg-stone-50 dark:bg-stone-950 transition-colors duration-500">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] bg-stone-100 dark:bg-stone-900 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              <div className="absolute bottom-6 right-6 flex space-x-2">
                <button 
                  onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm p-3 hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-900 transition-all dark:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm p-3 hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-900 transition-all dark:text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-stone-100 dark:bg-stone-900 overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-stone-900 dark:border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">{product.category?.name || 'Furniture'}</span>
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="fill-stone-900 dark:fill-white dark:text-white" />
                    <span className="text-xs font-bold dark:text-white">{product.rating || 4.5}</span>
                    <span className="text-xs text-stone-400">({product.reviews?.length || 0} reviews)</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-stone-900 dark:text-white">{product.name}</h1>
                <p className="text-3xl font-serif text-stone-600 dark:text-stone-400">₹{product.price.toLocaleString()}</p>
              </div>

              <p className="text-stone-500 dark:text-stone-400 leading-relaxed text-lg">
                {product.description}
              </p>

              <div className="space-y-4 pt-8 border-t border-stone-200 dark:border-stone-800">
                <div className="flex justify-between text-sm">
                  <span className="font-bold uppercase tracking-widest text-stone-400">Material</span>
                  <span className="text-stone-900 dark:text-stone-200">{product.material || 'Premium Materials'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold uppercase tracking-widest text-stone-400">Dimensions</span>
                  <span className="text-stone-900 dark:text-stone-200">{product.dimensions || 'N/A'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-6 pt-10">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded-full px-6 py-4 dark:text-white">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-xl px-2 hover:text-stone-400">-</button>
                    <span className="mx-6 font-bold w-4 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="text-xl px-2 hover:text-stone-400">+</button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-stone-900 dark:bg-white dark:text-stone-900 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-800 dark:hover:bg-stone-200 transition-all flex items-center justify-center space-x-3"
                  >
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-center space-x-12 pt-4">
                  <button className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                    <Heart size={16} />
                    <span>Add to Wishlist</span>
                  </button>
                  <button className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                    <Share2 size={16} />
                    <span>Share Piece</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
