'use client';

import React from 'react';
import dynamic from 'next/dynamic';
const ShowroomCanvas = dynamic(() => import('@/components/ShowroomCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-stone-100 dark:bg-stone-900">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-stone-900 dark:border-white animate-spin"></div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-stone-500">Loading Render Engine...</p>
      </div>
    </div>
  )
});

const ShowroomPage = () => {
  return (
    <div className="h-screen w-full bg-stone-50 dark:bg-stone-950 pt-24 overflow-hidden flex flex-col transition-colors duration-500">
      <div className="px-6 py-12 container mx-auto flex flex-col md:flex-row justify-between items-end">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-8xl font-serif font-bold tracking-tighter dark:text-white">Virtual Showroom</h1>
          <p className="text-stone-500 dark:text-stone-400 max-w-md uppercase tracking-widest text-xs font-bold">
            Interactive 3D Experience — Powered by Advik Render Engine
          </p>
        </div>
        <div className="mt-8 md:mt-0">
          <p className="text-stone-400 dark:text-stone-500 text-sm max-w-xs italic font-serif">
            Rotate, zoom, and explore the intricate details of our 2026 collection in high-fidelity 3D.
          </p>
        </div>
      </div>

      <div className="flex-1 relative">
        <ShowroomCanvas />
        
        {/* Controls Overlay */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-4 md:space-x-8 px-4 md:px-8 py-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md rounded-full border border-white/30 dark:border-stone-800 w-[90%] sm:w-auto justify-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-tighter text-stone-400">Rotation</span>
            <span className="text-xs font-bold dark:text-white">360°</span>
          </div>
          <div className="w-[1px] h-6 bg-stone-300 dark:bg-stone-800"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-tighter text-stone-400">Materials</span>
            <span className="text-xs font-bold dark:text-white">Dynamic</span>
          </div>
          <div className="w-[1px] h-6 bg-stone-300 dark:bg-stone-800"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-tighter text-stone-400">Environment</span>
            <span className="text-xs font-bold dark:text-white">Studio</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowroomPage;
