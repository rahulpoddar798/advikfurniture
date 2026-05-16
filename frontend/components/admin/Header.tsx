'use client';

import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

import { useAdminStore } from '@/store/useAdminStore';

const Header = () => {
  const { data: session } = useSession();
  const { toggleSidebar } = useAdminStore();

  return (
    <header className="h-24 bg-stone-950/50 backdrop-blur-md border-b border-stone-800 sticky top-0 z-40 px-8 lg:px-12 flex items-center justify-between">
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden p-2 text-stone-400 hover:text-white transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search for anything..."
            className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm font-medium tracking-wide"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <kbd className="text-[10px] font-bold bg-stone-800 text-stone-500 px-1.5 py-0.5 rounded border border-stone-700">⌘</kbd>
            <kbd className="text-[10px] font-bold bg-stone-800 text-stone-500 px-1.5 py-0.5 rounded border border-stone-700">K</kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-6">
        <button className="p-3 bg-stone-900/50 border border-stone-800 rounded-2xl text-stone-400 hover:text-white transition-all relative">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full border-2 border-stone-900" />
        </button>

        <div className="flex items-center space-x-4 pl-6 border-l border-stone-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold tracking-tight text-white">{session?.user?.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{(session?.user as any)?.role?.replace('_', ' ')}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-stone-800 p-0.5 bg-stone-900">
            {session?.user?.image ? (
              <Image src={session.user.image} alt="User" width={48} height={48} className="w-full h-full object-cover rounded-[14px]" />
            ) : (
              <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-400 rounded-[14px]">
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
