'use client';

import React from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle2, 
  XCircle,
  Clock,
  Package
} from 'lucide-react';

interface OrderListProps {
  orders: any[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search orders..."
            className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-1 focus:ring-white/20 transition-all text-sm"
          />
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-stone-900/50 border border-stone-800 text-stone-400 hover:text-white transition-all text-sm font-bold uppercase tracking-widest">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-stone-900/40 backdrop-blur-2xl border border-stone-800 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800/50">
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Order ID</th>
                <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Customer</th>
                <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Status</th>
                <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Total</th>
                <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Date</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/30">
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-xs font-mono font-bold text-white uppercase">#{order.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div>
                      <p className="text-sm font-bold text-white">{order.user?.name || 'Guest'}</p>
                      <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`text-[10px] font-bold uppercase tracking-tighter px-2.5 py-1 rounded-full border flex items-center w-fit space-x-1.5 ${
                      order.status === 'DELIVERED' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' :
                      order.status === 'SHIPPED' ? 'border-blue-500/20 bg-blue-500/10 text-blue-500' :
                      order.status === 'CANCELLED' ? 'border-red-500/20 bg-red-500/10 text-red-500' :
                      'border-amber-500/20 bg-amber-500/10 text-amber-500'
                    }`}>
                      {order.status === 'DELIVERED' && <CheckCircle2 size={10} />}
                      {order.status === 'SHIPPED' && <Truck size={10} />}
                      {order.status === 'CANCELLED' && <XCircle size={10} />}
                      {order.status === 'PENDING' && <Clock size={10} />}
                      <span>{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-bold text-white">₹{order.total.toLocaleString()}</p>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">{order.items.length} Items</p>
                  </td>
                  <td className="px-6 py-6 text-xs text-stone-400 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 text-stone-600">
                      <Package size={48} className="opacity-20" />
                      <p className="font-serif italic text-lg">No orders found in the database.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
