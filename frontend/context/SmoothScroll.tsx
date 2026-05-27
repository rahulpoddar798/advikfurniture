'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect, useRef, ComponentRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<ComponentRef<typeof ReactLenis>>(null);

  useEffect(() => {
    // Disable browser's native scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Force scroll to top on refresh for cinematic entry
    window.scrollTo(0, 0);

    // Register ScrollTrigger globally
    gsap.registerPlugin(ScrollTrigger);

    // Global GSAP performance settings
    gsap.config({
      nullTargetWarn: false,
      force3D: true,
    });

    // Default ease for a more premium, "Apple-like" feel
    gsap.defaults({
      ease: "power3.out",
      duration: 1.2
    });

    // DO NOT normalize scroll - it breaks mobile touch and momentum scrolling
    // ScrollTrigger.normalizeScroll(true);

    // Ensure ScrollTrigger is refreshed on mount after a short delay
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    // Integration: Drive Lenis with GSAP Ticker for frame-perfect sync
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    
    gsap.ticker.add(update);
    // Restore default lag smoothing to prevent huge jumps on frame drops
    gsap.ticker.lagSmoothing(1000, 16);

    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(update);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <ReactLenis 
      root 
      ref={lenisRef}
      options={{ 
        lerp: 0.08, // Slightly slower for a more "cinematic" and heavy feel
        duration: 1.5, 
        smoothWheel: true,
        wheelMultiplier: 0.9, // Avoid aggressive scrolling
        syncTouch: false, // Let native touch scrolling handle mobile momentum
        touchMultiplier: 1, // Reset to natural feel
        infinite: false,
        autoRaf: false, // We handle RAF via GSAP ticker
      }}
    >
      <LenisSync />
      {children}
    </ReactLenis>
  );
}

// Separate component to use the useLenis hook
function LenisSync() {
  useLenis(() => {
    // High-performance ScrollTrigger update
    ScrollTrigger.update();
  });
  
  return null;
}
