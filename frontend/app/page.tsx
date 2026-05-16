'use client';

import React, { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import api from "@/lib/api";

import { Award, Users, Armchair } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products?featured=true');
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-stone-50 dark:bg-stone-950">
      <Hero />
      
      {/* Featured Products */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-4 md:space-y-0">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">Curated Selection</h3>
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-stone-900 dark:text-white">Featured Masterpieces</h2>
            </div>
            <Link href="/collections" className="text-sm font-bold uppercase tracking-widest border-b-2 border-stone-900 dark:border-white pb-1 hover:text-stone-500 hover:border-stone-500 transition-all dark:text-white active:scale-95 inline-block">
              View All Products
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[4/5] bg-stone-200 dark:bg-stone-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.images?.[0] || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'}
                  category={product.category?.name || 'Furniture'}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white dark:bg-stone-900/50 border-y border-stone-100 dark:border-stone-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white">
                  <Award size={32} />
                </div>
              </div>
              <h3 className="text-4xl font-serif font-bold dark:text-white">25+ Years</h3>
              <p className="text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] font-bold">Of Design Excellence</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white">
                  <Users size={32} />
                </div>
              </div>
              <h3 className="text-4xl font-serif font-bold dark:text-white">80k+</h3>
              <p className="text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] font-bold">Happy Customers</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white">
                  <Armchair size={32} />
                </div>
              </div>
              <h3 className="text-4xl font-serif font-bold dark:text-white">1k+</h3>
              <p className="text-stone-500 dark:text-stone-400 uppercase tracking-widest text-[10px] font-bold">Premium Products</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Luxury Showroom Teaser */}
      <section className="bg-stone-900 dark:bg-stone-900 py-32 px-6 overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop" 
              alt="Showroom" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-stone-100 dark:bg-stone-800 p-8 hidden md:flex flex-col justify-center shadow-2xl">
              <p className="text-stone-900 dark:text-white font-serif text-xl italic mb-4">"The details are not the details. They make the design."</p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">— Charles Eames</span>
            </div>
          </div>
          <div className="space-y-8 text-white">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Experience</h3>
            <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter">The Virtual Showroom</h2>
            <p className="text-stone-400 text-lg leading-relaxed max-w-lg">
              Step into an immersive 3D world where you can visualize every piece in high fidelity. Our virtual showroom brings the future of furniture shopping to your fingertips.
            </p>
            <Link href="/showroom" className="inline-block bg-white text-stone-900 px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-200 transition-all active:scale-95">
              Enter Showroom
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight dark:text-white">Stay Inspired.</h2>
          <p className="text-stone-500 dark:text-stone-400">Join our exclusive circle for interior design tips, new collection launches, and private event invitations.</p>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-stone-100 dark:bg-stone-900 border-none px-6 py-4 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white dark:text-white transition-all"
            />
            <button className="bg-stone-900 dark:bg-white dark:text-stone-900 text-white px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-stone-800 dark:hover:bg-stone-200 transition-all active:scale-95">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
