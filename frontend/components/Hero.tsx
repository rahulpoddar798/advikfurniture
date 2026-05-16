'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Link from 'next/link';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });

    tl.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, delay: 0.5 }
    )
    .fromTo(
      subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1 },
      '-=1.2'
    )
    .fromTo(
      ctaRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1 },
      '-=1'
    );

    // Parallax effect on scroll
    gsap.to(heroRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: 100,
      opacity: 0.5,
    });
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-stone-100 dark:bg-stone-950"
    >
      {/* Background Image/3D Placeholder */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
          alt="Premium Living Space" 
          className="w-full h-full object-cover opacity-80 dark:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-50/20 to-stone-50 dark:via-stone-950/20 dark:to-stone-950"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <h2 ref={subtitleRef} className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-stone-600 dark:text-stone-400 mb-6">
          2026 Collection
        </h2>
        <h1 ref={titleRef} className="text-6xl md:text-9xl font-serif font-bold tracking-tighter leading-none mb-10 text-stone-900 dark:text-white">
          Advik <br /> Interior
        </h1>
        <div ref={ctaRef} className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link 
            href="/collections" 
            className="bg-stone-900 dark:bg-white dark:text-stone-900 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-800 dark:hover:bg-stone-200 transition-all hover:scale-105 active:scale-95"
          >
            Explore Collections
          </Link>
          <Link 
            href="/showroom" 
            className="text-stone-900 dark:text-white border-b-2 border-stone-900 dark:border-white pb-1 font-bold uppercase tracking-widest text-xs hover:text-stone-600 dark:hover:text-stone-400 hover:border-stone-600 dark:hover:border-stone-400 transition-all"
          >
            Virtual Showroom
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-2">Scroll</span>
        <div className="w-[1px] h-12 bg-stone-300 dark:bg-stone-800 relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 48, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-4 bg-stone-900 dark:bg-white"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
