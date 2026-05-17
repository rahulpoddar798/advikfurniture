'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

export default function Loading() {
  const brandName = "ADVIK FURNITURE";
  const tagline = "Crafting Luxury";

  const containerVars: Variants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  const letterVars: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div 
      variants={containerVars}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-[100] bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center"
    >
      <div className="relative flex flex-col items-center">
        {/* Cinematic Logo Reveal */}
        <div className="overflow-hidden mb-6">
          <div className="flex">
            {brandName.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterVars}
                className={`text-2xl md:text-4xl font-serif font-bold tracking-[0.2em] text-stone-900 dark:text-white ${char === " " ? "mr-4" : ""}`}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>
        
        {/* Minimalist Premium Loader */}
        <div className="w-32 h-[1px] bg-stone-200 dark:bg-stone-800 relative overflow-hidden">
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ 
              scaleX: [0, 0.5, 1],
              transition: { 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              } 
            }}
            className="absolute top-0 left-0 w-full h-full bg-stone-900 dark:bg-stone-400"
          />
        </div>

        {/* Subtle Tagline */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ 
            opacity: 1, 
            letterSpacing: "0.5em",
            transition: { delay: 1, duration: 1.5 } 
          }}
          className="mt-8 text-[9px] uppercase text-stone-500 dark:text-stone-500 font-bold"
        >
          {tagline}
        </motion.p>
      </div>
      
      {/* Background Ambience */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-stone-400)_0%,_transparent_70%)]"
      />
    </motion.div>
  );
}
