'use client';

import React, { useTransition } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { reset } from '@/app/actions/auth';
import Link from 'next/link';

const ResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ResetPage = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    startTransition(async () => {
      const result = await reset(values);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result?.success || "Reset email sent!");
      }
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-stone-100 dark:bg-stone-950 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-stone-900 p-8 md:p-12 w-full max-w-md shadow-2xl space-y-10"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif font-bold tracking-tight dark:text-white">Forgot Password</h1>
          <p className="text-stone-400 dark:text-stone-500 text-sm">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors" />
              <input 
                {...form.register("email")}
                type="email"
                required
                className="w-full bg-stone-50 dark:bg-stone-800 border-none px-6 py-4 pl-12 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white dark:text-white transition-all"
                placeholder="john@example.com"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-stone-900 dark:bg-white dark:text-stone-900 text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-800 dark:hover:bg-stone-200 transition-all shadow-lg hover:shadow-stone-200 flex items-center justify-center space-x-2 disabled:bg-stone-400"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <Link 
            href="/auth" 
            className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={14} />
            <span>Back to Login</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPage;
