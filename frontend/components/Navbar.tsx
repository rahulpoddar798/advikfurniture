'use client';

import React, { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Heart, Search, Menu, X, Sun, Moon, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useThemeStore } from '@/store/useThemeStore';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';

const Navbar = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const totalItems = useCartStore((state) => state.totalItems());
  const { theme, toggleTheme } = useThemeStore();
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled((prev) => prev !== scrolled ? scrolled : prev);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Do not show main navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Collections', href: '/collections' },
    { name: 'Chairs', href: '/category/chairs' },
    { name: 'Sofas', href: '/category/sofas' },
    { name: 'Tables', href: '/category/tables' },
    { name: 'Beds', href: '/category/beds' },
    { name: 'Showroom', href: '/showroom' },
    ...(session && ["SUPER_ADMIN", "STAFF_ADMIN", "CONTENT_MANAGER"].includes((session.user as any)?.role) 
      ? [{ name: 'Admin', href: '/admin' }] 
      : []),
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-4 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm' 
            : 'py-6 md:py-8 bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" prefetch={true} className="flex items-center space-x-2 md:space-x-3 group transition-all duration-300">
            <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Image 
                src="/logoAFI.png" 
                alt="Advik Furniture" 
                width={32} 
                height={32}
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="text-lg md:text-xl font-serif font-bold tracking-tighter text-stone-900 dark:text-white">
              Advik<span className="text-stone-600 dark:text-stone-400 font-normal hidden sm:inline">Furniture</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Link
                  href={link.href}
                  prefetch={true}
                  className="text-sm font-medium hover:text-stone-500 transition-colors uppercase tracking-widest dark:text-stone-300 dark:hover:text-white"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                toggleTheme();
              }}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-all duration-300 active:scale-95"
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'light' ? <Moon size={20} className="text-stone-900" /> : <Sun size={20} className="text-white" />}
                </motion.div>
              </AnimatePresence>
            </button>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors dark:text-white"
              aria-label="Open Search"
            >
              <Search size={20} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors relative dark:text-white"
              aria-label="Open Cart"
            >
              <ShoppingCart size={20} />
              {isMounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-stone-900 dark:bg-white dark:text-stone-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            <div className="relative">
              <button 
                onClick={() => session ? setIsProfileOpen(!isProfileOpen) : router.push('/auth')}
                className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors hidden md:block dark:text-white"
                aria-label="User Profile"
              >
                {session?.user?.image ? (
                  <Image src={session.user.image} alt="User" width={20} height={20} className="rounded-full" />
                ) : (
                  <User size={20} />
                )}
              </button>

              <AnimatePresence>
                {isProfileOpen && session && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-100 dark:border-stone-800 p-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800 mb-2">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-1">Account</p>
                        <p className="text-sm font-bold truncate dark:text-white">{session.user?.name || session.user?.email}</p>
                      </div>
                      {session && ["SUPER_ADMIN", "STAFF_ADMIN", "CONTENT_MANAGER"].includes((session.user as any)?.role) && (
                        <Link 
                          href="/admin" 
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl transition-colors group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <LayoutDashboard size={16} className="group-hover:scale-110 transition-transform" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <Link 
                        href="/settings/profile" 
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl transition-colors group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={16} className="group-hover:rotate-45 transition-transform" />
                        <span>Settings</span>
                      </Link>
                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group"
                      >
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 dark:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium dark:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="flex items-center space-x-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                  <Link href="/wishlist" className="dark:text-white" aria-label="Wishlist" onClick={() => setIsMobileMenuOpen(false)}><Heart size={20} /></Link>
                  <Link 
                    href={session ? "/settings/profile" : "/auth"} 
                    className="dark:text-white"
                    aria-label="User Profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
