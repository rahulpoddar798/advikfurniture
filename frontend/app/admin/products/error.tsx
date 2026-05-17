'use client';

import { useEffect } from 'react';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ADMIN ROUTE ERROR:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 px-6 text-center">
      <div className="space-y-4">
        <h2 className="text-4xl font-serif font-bold text-white tracking-tight">System Interruption</h2>
        <p className="text-stone-500 max-w-md mx-auto">
          A server-side anomaly occurred while processing your request. 
          The database connection or authorization layer may be temporarily unstable.
        </p>
        {error.digest && (
          <p className="text-[10px] font-mono text-stone-700 uppercase tracking-widest">
            Trace ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center space-x-2 px-8 py-4 bg-white text-stone-950 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-stone-200 transition-all shadow-xl shadow-white/5"
        >
          <RotateCcw size={16} />
          <span>Restore Session</span>
        </button>
        
        <Link 
          href="/admin/products"
          className="flex items-center space-x-2 px-8 py-4 bg-stone-900 border border-stone-800 text-stone-400 rounded-2xl font-bold uppercase tracking-widest text-xs hover:text-white transition-all"
        >
          <ChevronLeft size={16} />
          <span>Back to Catalog</span>
        </Link>
      </div>
    </div>
  );
}
