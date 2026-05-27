'use client';

import React from 'react';
import { Search, Bell, User, Menu, Sun, Moon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { useAdminStore } from '@/store/useAdminStore';
import { useThemeStore } from '@/store/useThemeStore';

const Header = () => {
  const { data: session } = useSession();
  const { toggleSidebar } = useAdminStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="h-24 bg-white/50 dark:bg-stone-950/50 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-0 z-40 px-4 sm:px-8 lg:px-12 flex items-center justify-between">
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search for anything..."
            className="w-full bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-1 focus:ring-stone-900/20 dark:focus:ring-white/20 transition-all text-sm font-medium tracking-wide text-stone-900 dark:text-white placeholder:text-stone-400"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <kbd className="text-[10px] font-bold bg-stone-200 dark:bg-stone-800 text-stone-500 px-1.5 py-0.5 rounded border border-stone-300 dark:border-stone-700">⌘</kbd>
            <kbd className="text-[10px] font-bold bg-stone-200 dark:bg-stone-800 text-stone-500 px-1.5 py-0.5 rounded border border-stone-300 dark:border-stone-700">K</kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-3 bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-2xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all overflow-hidden"
          aria-label="Toggle Theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: -15, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 15, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.15 }}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <button className="p-3 bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-2xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all relative">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-stone-900 dark:bg-white rounded-full border-2 border-white dark:border-stone-950" />
        </button>

        <div className="flex items-center space-x-4 pl-4 sm:pl-6 border-l border-stone-200 dark:border-stone-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold tracking-tight text-stone-900 dark:text-white">{session?.user?.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{(session?.user as { role?: string })?.role?.replace('_', ' ')}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 p-0.5 bg-stone-100 dark:bg-stone-900">
            {session?.user?.image ? (
              <Image src={session.user.image} alt="User" width={48} height={48} className="w-full h-full object-cover rounded-[14px]" />
            ) : (
              <div className="w-full h-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-500 dark:text-stone-400 rounded-[14px]">
                <User size={20} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
