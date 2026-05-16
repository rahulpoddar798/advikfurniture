'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { RevenueChart, PerformanceChart } from '@/components/admin/Charts';

const AdminDashboard = () => {
  const stats = [
    { name: 'Total Revenue', value: '₹24,50,000', change: '+12.5%', trend: 'up', icon: TrendingUp },
    { name: 'Total Orders', value: '1,240', change: '+8.2%', trend: 'up', icon: ShoppingBag },
    { name: 'Total Customers', value: '82,400', change: '+14.1%', trend: 'up', icon: Users },
    { name: 'Active Products', value: '1,042', change: '-2.4%', trend: 'down', icon: Package },
    { name: 'Pending Orders', value: '42', change: '5 urgent', trend: 'neutral', icon: Clock },
    { name: 'Low Stock', value: '12', change: 'Requires action', trend: 'warning', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h2 className="text-4xl font-serif font-bold tracking-tight text-white">Dashboard Overview</h2>
        <p className="text-stone-500 font-medium">Welcome back, Admin. Here's what's happening with Advik Furniture today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group p-8 rounded-[2.5rem] bg-stone-900/40 backdrop-blur-2xl border border-stone-800 hover:border-white/20 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
            
            <div className="flex justify-between items-start relative z-10">
              <div className="p-4 rounded-2xl bg-stone-800/50 border border-stone-700 text-white group-hover:scale-110 transition-transform duration-500">
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center space-x-1 text-xs font-bold uppercase tracking-wider ${
                stat.trend === 'up' ? 'text-emerald-500' : 
                stat.trend === 'down' ? 'text-red-500' : 
                stat.trend === 'warning' ? 'text-amber-500' : 'text-stone-400'
              }`}>
                {stat.trend === 'up' && <ArrowUpRight size={14} />}
                {stat.trend === 'down' && <ArrowDownRight size={14} />}
                <span>{stat.change}</span>
              </div>
            </div>

            <div className="mt-8 space-y-1 relative z-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">{stat.name}</p>
              <h3 className="text-3xl font-serif font-bold text-white tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-[3rem] bg-stone-900/40 backdrop-blur-2xl border border-stone-800 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-serif font-bold text-white">Revenue Stream</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mt-1">Weekly Growth</p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-800/50 border border-stone-700 text-white">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="h-[300px]">
            <RevenueChart />
          </div>
        </div>

        <div className="p-8 rounded-[3rem] bg-stone-900/40 backdrop-blur-2xl border border-stone-800 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-serif font-bold text-white">Order Volume</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mt-1">Daily Performance</p>
            </div>
            <div className="p-3 rounded-2xl bg-stone-800/50 border border-stone-700 text-white">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="h-[300px]">
            <PerformanceChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
