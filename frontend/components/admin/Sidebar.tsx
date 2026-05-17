'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  FileEdit, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronRight,
  X
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useAdminStore } from '@/store/useAdminStore';

const Sidebar = () => {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useAdminStore();

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Content', href: '/admin/content', icon: FileEdit },
    { name: 'Inventory', href: '/admin/inventory', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div className={`fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar} />

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-stone-900/50 backdrop-blur-xl border-r border-stone-800 flex flex-col transition-transform duration-500 lg:sticky lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="p-8 pb-12 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Image 
                src="/logoAFI.png" 
                alt="Advik Furniture" 
                width={40} 
                height={40}
                className="object-contain p-1"
              />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold tracking-tight text-white leading-none">Advik</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mt-1">Admin Panel</p>
            </div>
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden p-2 text-stone-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => { if(window.innerWidth < 1024) toggleSidebar(); }}
                className={`flex items-center justify-between group px-5 py-4 rounded-[1.5rem] transition-all duration-300 ${
                  isActive 
                    ? 'bg-white text-stone-950 shadow-2xl shadow-white/5 translate-x-1' 
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/40'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl transition-colors duration-300 ${isActive ? 'bg-stone-100' : 'bg-transparent group-hover:bg-stone-800'}`}>
                    <item.icon size={18} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em]">{item.name}</span>
                </div>
                {isActive ? (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="w-1 h-4 rounded-full bg-stone-950" 
                  />
                ) : (
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-6 py-8 border-t border-stone-800/50">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center space-x-4 px-5 py-4 rounded-[1.5rem] text-stone-500 hover:bg-red-500/10 hover:text-red-400 transition-all w-full group border border-transparent hover:border-red-500/20"
          >
            <div className="p-2 rounded-xl bg-stone-800/50 group-hover:bg-red-500/10 transition-colors">
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em]">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
