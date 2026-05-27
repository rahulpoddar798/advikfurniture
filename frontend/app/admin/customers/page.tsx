import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

import { 
  Users, 
  Search, 
  Filter, 
  UserPlus,
  Mail,
  ShieldCheck,
  Ban
} from 'lucide-react';
import Image from 'next/image';

async function getAdminCustomers() {
  const session = await auth();
  if (!session) return [];
  
  return await prisma.user.findMany({
    where: { role: 'USER' },
    include: {
      _count: {
        select: { orders: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif font-bold tracking-tight text-white">Customer Relationship</h2>
          <p className="text-stone-500 font-medium">Manage your community, view purchase history, and handle account permissions.</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white text-stone-950 hover:bg-stone-200 transition-all text-sm font-bold uppercase tracking-widest shadow-xl shadow-white/5">
          <UserPlus size={16} />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Search customers..."
              className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
            />
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-stone-900/50 border border-stone-800 text-stone-400 hover:text-white transition-all text-sm font-bold uppercase tracking-widest">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>

        <div className="bg-stone-900/40 backdrop-blur-2xl border border-stone-800 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto" data-lenis-prevent="true">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800/50">
                  <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Customer</th>
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Orders</th>
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Member Since</th>
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Status</th>
                  <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/30">
                {customers.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 overflow-hidden">
                          {user.image ? (
                            <Image src={user.image} alt={user.name || ''} width={40} height={40} className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-500">
                              <Users size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{user.name || 'Unnamed'}</p>
                          <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm font-medium text-stone-300">
                      {user._count?.orders || 0} Orders
                    </td>
                    <td className="px-6 py-6 text-xs text-stone-400 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-[10px] font-bold uppercase tracking-tighter px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                        Active
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-all">
                          <Mail size={16} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-all">
                          <ShieldCheck size={16} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-500/10 text-stone-400 hover:text-red-500 transition-all">
                          <Ban size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
