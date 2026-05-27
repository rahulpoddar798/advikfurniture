'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useThemeStore } from '@/store/useThemeStore';

interface ChartProps {
  data?: { name: string; revenue: number; orders: number }[];
}

const defaultData = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 18 },
  { name: 'Wed', revenue: 2000, orders: 29 },
  { name: 'Thu', revenue: 2780, orders: 23 },
  { name: 'Fri', revenue: 1890, orders: 21 },
  { name: 'Sat', revenue: 2390, orders: 34 },
  { name: 'Sun', revenue: 3490, orders: 32 },
];

export const RevenueChart: React.FC<ChartProps> = ({ data = defaultData }) => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  const strokeColor = isDark ? '#ffffff' : '#1c1917';
  const gradientColor = isDark ? '#ffffff' : '#1c1917';
  const tickColor = isDark ? '#a8a29e' : '#57534e';
  const tooltipBg = isDark ? '#1c1917' : '#ffffff';
  const tooltipBorder = isDark ? '1px solid #292524' : '1px solid #e7e5e4';
  const tooltipText = isDark ? '#fafaf9' : '#1c1917';
  const cursorStroke = isDark ? '#44403c' : '#d6d3d1';

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientColor} stopOpacity={0.1}/>
              <stop offset="95%" stopColor={gradientColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: tickColor, fontSize: 10, fontWeight: 'bold' }}
            dy={10}
          />
          <YAxis 
            hide={true}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              border: tooltipBorder, 
              borderRadius: '12px',
              fontSize: '12px',
              color: tooltipText
            }}
            itemStyle={{ color: tooltipText }}
            cursor={{ stroke: cursorStroke, strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke={strokeColor} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PerformanceChart: React.FC<ChartProps> = ({ data = defaultData }) => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  const tickColor = isDark ? '#a8a29e' : '#57534e';
  const tooltipBg = isDark ? '#1c1917' : '#ffffff';
  const tooltipBorder = isDark ? '1px solid #292524' : '1px solid #e7e5e4';
  const tooltipText = isDark ? '#fafaf9' : '#1c1917';
  const cursorFill = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const activeBarColor = isDark ? '#ffffff' : '#1c1917';
  const inactiveBarColor = isDark ? '#44403c' : '#d6d3d1';

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: tickColor, fontSize: 10, fontWeight: 'bold' }}
            dy={10}
          />
          <Tooltip 
            cursor={{ fill: cursorFill }}
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              border: tooltipBorder, 
              borderRadius: '12px',
              fontSize: '12px',
              color: tooltipText
            }}
            itemStyle={{ color: tooltipText }}
          />
          <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? activeBarColor : inactiveBarColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
