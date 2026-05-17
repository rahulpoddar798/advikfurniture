'use client';

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const ScrollAnimation = ({ children, delay = 0, className = "" }: ScrollAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.22, 1, 0.36, 1] // Quintic out for premium feel
      }}
      className={`will-change-premium ${className}`}
    >
      {children}
    </motion.div>
  );
};
