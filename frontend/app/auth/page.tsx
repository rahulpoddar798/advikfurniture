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
    } catch (err) {
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

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-stone-100 dark:border-stone-800"></span>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-white dark:bg-stone-900 px-4 text-stone-400">Or continue with</span>
            </div>
          </div>

          <button 
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center space-x-3 bg-stone-50 dark:bg-stone-800 py-5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-all border border-stone-100 dark:border-stone-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest dark:text-white">Google</span>
          </button>
        </div>

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
