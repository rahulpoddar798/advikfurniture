import React from 'react';
import { auth } from '@/auth';
import { getUserOrders } from '@/app/actions/settings';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Calendar, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth');
  }

  const orders = await getUserOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'PROCESSING':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'SHIPPED':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'DELIVERED':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'CANCELLED':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-stone-500/10 text-stone-500 border-stone-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif font-bold tracking-tight dark:text-white">Order History</h1>
        <p className="text-stone-500 dark:text-stone-400">Track and view details of your premium furniture orders.</p>
      </div>

      {orders.length === 0 ? (
        <div className="py-24 text-center space-y-6 bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-stone-200/50 dark:border-stone-800/50 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center text-stone-400">
            <Package size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold uppercase tracking-widest dark:text-white">No Orders Found</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm">You haven&apos;t placed any orders yet. Visit our collections to find your perfect match.</p>
          </div>
          <Link 
            href="/collections" 
            className="flex items-center space-x-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-opacity active:scale-95"
          >
            <span>Start Shopping</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-stone-200/50 dark:border-stone-800/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Order Header */}
              <div className="p-6 bg-stone-50/50 dark:bg-stone-950/20 border-b border-stone-200/50 dark:border-stone-800/50 flex flex-wrap justify-between items-center gap-4 text-xs">
                <div className="flex items-center space-x-6">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Order Placed</p>
                    <p className="font-bold dark:text-white flex items-center gap-1.5" suppressHydrationWarning>
                      <Calendar size={12} className="text-stone-400" />
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Total Amount</p>
                    <p className="font-bold text-stone-950 dark:text-white font-mono">₹{order.total.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Order ID</p>
                    <p className="font-mono text-stone-600 dark:text-stone-300 select-all">{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Body / Items list */}
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-xl bg-stone-100 dark:bg-stone-800 overflow-hidden relative shrink-0">
                        <Image 
                          src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop'} 
                          alt={item.product?.name || 'Product'} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product?.id}`} className="hover:underline">
                          <h4 className="text-xs font-bold uppercase tracking-tight text-stone-950 dark:text-white truncate">
                            {item.product?.name || 'Deleted Product'}
                          </h4>
                        </Link>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider mt-0.5">
                          Quantity: {item.quantity} @ ₹{item.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Item Total */}
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-stone-900 dark:text-white font-mono">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address Row */}
                <div className="pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex items-start gap-2.5 text-[11px] text-stone-500 dark:text-stone-400">
                  <MapPin size={14} className="text-stone-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-400 uppercase tracking-widest text-[9px] block">Shipping Address</span>
                    <p className="mt-0.5">{order.address}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
