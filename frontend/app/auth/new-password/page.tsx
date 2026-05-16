'use client';

import React, { useState, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { newPassword } from '@/app/actions/auth';
import Link from 'next/link';

const NewPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    startTransition(async () => {
      const result = await newPassword(values, token);
      if (result?.error) {
        toast.error(result.error);
      } else {
        setIsSuccess(true);
        toast.success("Password updated successfully!");
      }
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-stone-100 dark:bg-stone-950 transition-colors duration-500">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-stone-900 p-8 md:p-12 w-full max-w-md shadow-2xl space-y-8 text-center"
        >
          <div className="flex justify-center text-red-500">
            <AlertCircle size={64} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold tracking-tight dark:text-white">Invalid Reset Link</h1>
            <p className="text-stone-400 dark:text-stone-500 text-sm">
              This password reset link is missing a security token. Please request a new link from the forgot password page.
            </p>
          </div>
          <Link 
            href="/auth/reset"
            className="w-full inline-block bg-stone-900 dark:bg-white dark:text-stone-900 text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-800 dark:hover:bg-stone-200 transition-all shadow-lg"
          >
            Go to Forgot Password
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-stone-100 dark:bg-stone-950 transition-colors duration-500">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-stone-900 p-8 md:p-12 w-full max-w-md shadow-2xl space-y-8 text-center"
        >
          <div className="flex justify-center text-green-500">
            <CheckCircle2 size={64} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold tracking-tight dark:text-white">Success!</h1>
            <p className="text-stone-400 dark:text-stone-500 text-sm">
              Your password has been updated. You can now log in with your new credentials.
            </p>
          </div>
          <Link 
            href="/auth"
            className="w-full inline-block bg-stone-900 dark:bg-white dark:text-stone-900 text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-800 dark:hover:bg-stone-200 transition-all shadow-lg"
          >
            Sign In Now
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-stone-100 dark:bg-stone-950 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-stone-900 p-8 md:p-12 w-full max-w-md shadow-2xl space-y-10"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif font-bold tracking-tight dark:text-white">Reset Password</h1>
          <p className="text-stone-400 dark:text-stone-500 text-sm">
            Enter your new secure password below.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors" />
              <input 
                {...form.register("password")}
                type={showPassword ? "text" : "password"}
                disabled={isPending}
                className="w-full bg-stone-50 dark:bg-stone-800 border-none px-6 py-4 pl-12 pr-12 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white dark:text-white transition-all"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors" />
              <input 
                {...form.register("confirmPassword")}
                type={showPassword ? "text" : "password"}
                disabled={isPending}
                className="w-full bg-stone-50 dark:bg-stone-800 border-none px-6 py-4 pl-12 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white dark:text-white transition-all"
                placeholder="••••••••"
              />
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-red-500 font-medium px-1">{form.formState.errors.confirmPassword.message}</p>
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
              <span>Reset Password</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const NewPasswordPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-950">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-stone-500" />
          <p className="text-stone-500 text-sm font-medium animate-pulse">Initializing Secure Reset...</p>
        </div>
      </div>
    }>
      <NewPasswordForm />
    </Suspense>
  );
};

export default NewPasswordPage;
