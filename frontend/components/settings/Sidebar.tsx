'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, Shield, MapPin, Package, Heart, 
  Bell, Palette, Lock, CreditCard, LogOut,
  ChevronRight
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Profile', href: '/settings/profile', icon: User },
    { name: 'Account', href: '/settings/account', icon: Shield },
    { name: 'Addresses', href: '/settings/addresses', icon: MapPin },
    { name: 'Orders', href: '/settings/orders', icon: Package },
    { name: 'Wishlist', href: '/settings/wishlist', icon: Heart },
    { name: 'Notifications', href: '/settings/notifications', icon: Bell },
    { name: 'Appearance', href: '/settings/appearance', icon: Palette },
    { name: 'Security', href: '/settings/security', icon: Lock },
    { name: 'Payments', href: '/settings/payment', icon: CreditCard },
  ];

  return (
    <div className="w-full lg:w-80 h-fit bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-stone-200/50 dark:border-stone-800/50 rounded-3xl p-6 lg:sticky lg:top-24 flex flex-col justify-between">
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-6 px-4">Dashboard</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const isImplemented = [
            '/settings/profile', 
            '/settings/account', 
            '/settings/addresses', 
            '/settings/wishlist', 
            '/settings/orders', 
            '/settings/notifications'
          ].includes(item.href);
          
          return (
            <Link 
              key={item.href} 
              href={isImplemented ? item.href : '#'}
              onClick={(e) => !isImplemented && e.preventDefault()}
              className={`flex items-center justify-between group px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-xl shadow-stone-200/50 dark:shadow-none' 
                  : isImplemented
                    ? 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
                    : 'opacity-50 cursor-not-allowed text-stone-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={18} className={`${isActive ? 'scale-110' : isImplemented ? 'group-hover:scale-110' : ''} transition-transform duration-300`} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="w-1.5 h-1.5 rounded-full bg-white dark:bg-stone-900" 
                />
              )}
              {!isActive && isImplemented && (
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
              )}
              {!isImplemented && (
                <span className="text-[8px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">Soon</span>
              )}
            </Link>
          );
        })}
      </div>

      <button 
        onClick={() => signOut()}
        className="mt-8 flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full group"
      >
        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest">Sign Out</span>
      </button>
    </div>
  );
};

export default Sidebar;
