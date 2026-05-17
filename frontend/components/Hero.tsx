'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic Master Timeline
      const tl = gsap.timeline({ 
        defaults: { ease: 'power4.out', duration: 1.5 },
        onComplete: () => {
          import('gsap/dist/ScrollTrigger').then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh();
          });
        }
      });

      // Split text-like reveal
      tl.fromTo(
        titleRef.current,
        { y: 120, opacity: 0, skewY: 4 },
        { y: 0, opacity: 1, skewY: 0, duration: 2, ease: 'power4.out', delay: 0.5, force3D: true }
      )
      .fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', force3D: true },
        '-=1.6'
      )
      .fromTo(
        ctaRef.current,
        { y: 20, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out', force3D: true },
        '-=1.2'
      );

      // Subtle Background Parallax - High Performance
      gsap.to('.hero-bg', {
        yPercent: 20,
        ease: 'none',
        force3D: true, // Force GPU acceleration for high refresh rate smoothness
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative h-[110vh] w-full flex items-center justify-center overflow-hidden bg-stone-100 dark:bg-stone-950"
    >
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0 hero-bg will-change-transform">
        <Image 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
          alt="Premium Living Space" 
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80 dark:opacity-40 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-50/10 to-stone-50 dark:via-stone-950/10 dark:to-stone-950"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-[90vw] md:max-w-5xl">
        <h2 ref={subtitleRef} className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] text-stone-600 dark:text-stone-400 mb-6 md:mb-8 will-change-premium">
          Crafting Luxury — 2026 Collection
        </h2>
        <h1 ref={titleRef} className="text-[12vw] sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-serif font-bold tracking-tighter leading-[0.9] mb-8 md:mb-10 text-stone-900 dark:text-white will-change-premium">
          Advik <br className="hidden sm:block" /> Furniture
        </h1>
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 will-change-premium">
          <Link 
            href="/collections" 
            className="w-full sm:w-auto bg-stone-900 dark:bg-white dark:text-stone-900 text-white px-8 md:px-12 py-4 md:py-6 rounded-full font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-stone-800 dark:hover:bg-stone-200 transition-all hover:scale-105 active:scale-95 shadow-2xl text-center"
          >
            Explore Collections
          </Link>
          <Link 
            href="/showroom" 
            className="text-stone-900 dark:text-white border-b-2 border-stone-900 dark:border-white pb-1 font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:text-stone-600 dark:hover:text-stone-400 hover:border-stone-600 dark:hover:border-stone-400 transition-all"
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
