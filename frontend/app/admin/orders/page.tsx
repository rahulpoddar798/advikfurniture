import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import OrderList from '@/components/admin/OrderList';

async function getAdminOrders() {
  const session = await auth();
  if (!session) return [];
  
  return await prisma.order.findMany({
    include: {
      user: {
        select: { name: true, email: true }
      },
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h2 className="text-4xl font-serif font-bold tracking-tight text-white">Orders</h2>
        <p className="text-stone-500 font-medium">Track delivery, manage statuses, and process customer returns.</p>
      </div>

      <OrderList orders={orders} />
    </div>
  );
}
