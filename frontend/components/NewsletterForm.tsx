'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call — replace with real newsletter subscription endpoint
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      toast.success('You are now subscribed to our exclusive updates!');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-12 h-12 rounded-full bg-stone-900 dark:bg-white flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white dark:text-stone-900" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-stone-600 dark:text-stone-400 text-sm font-medium text-center">
          You&apos;re on the list! Expect exclusive updates and design inspiration.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        className="flex-1 bg-stone-100 dark:bg-stone-900 border-none px-6 py-4 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white dark:text-white transition-all disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-stone-900 dark:bg-white dark:text-stone-900 text-white px-10 py-4 font-bold uppercase tracking-widest text-xs hover:bg-stone-800 dark:hover:bg-stone-200 transition-all active:scale-95 disabled:opacity-60"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}
