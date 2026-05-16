'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { register } from '@/app/actions/auth';
import { toast } from 'sonner';
import Link from 'next/link';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // NextAuth Login
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid credentials!");
          toast.error("Invalid credentials!");
        } else {
          toast.success("Welcome back!");
          window.location.href = "/";
        }
      } else {
        // Server Action Registration
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword || formData.password, // Fallback if old UI didn't show it
        });

        if (result.error) {
          setError(result.error);
          toast.error(result.error);
        } else {
          toast.success("Account created! Please sign in.");
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError('An error occurred during authentication');
      toast.error('An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-stone-100 dark:bg-stone-950 transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-stone-900 p-8 md:p-12 w-full max-w-md shadow-2xl space-y-10"
      >
        <div className="text-center space-y-2">
          <AnimatePresence mode="wait">
            <motion.h1 
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-4xl font-serif font-bold tracking-tight dark:text-white"
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </motion.h1>
          </AnimatePresence>
          <p className="text-stone-400 dark:text-stone-500 text-sm">
            {isLogin ? 'Enter your details to access your account' : 'Join the Advik community for exclusive access'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 text-xs font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-stone-50 dark:bg-stone-800 border-none px-6 py-4 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white dark:text-white transition-all"
                  placeholder="John Doe"
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-stone-50 dark:bg-stone-800 border-none px-6 py-4 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white dark:text-white transition-all"
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Password</label>
              {isLogin && (
                <Link href="/auth/reset" className="text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors">
                  Forgot Password?
                </Link>
              )}
            </div>
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-stone-50 dark:bg-stone-800 border-none px-6 py-4 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white dark:text-white transition-all"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Confirm Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                required={!isLogin}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-stone-50 dark:bg-stone-800 border-none px-6 py-4 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white dark:text-white transition-all"
                placeholder="••••••••"
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-stone-900 dark:bg-white dark:text-stone-900 text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-800 dark:hover:bg-stone-200 transition-all shadow-lg hover:shadow-stone-200 flex items-center justify-center space-x-2 disabled:bg-stone-400"
          >
            {isLoading && (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            )}
            <span>{isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}</span>
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
