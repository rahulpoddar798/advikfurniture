import React from 'react';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import AddressList from '@/components/settings/AddressList';
import { redirect } from 'next/navigation';

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth');
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif font-bold tracking-tight dark:text-white">Shipping Addresses</h1>
        <p className="text-stone-500 dark:text-stone-400">Manage your delivery addresses and set your default location.</p>
      </div>

      <AddressList initialAddresses={addresses} />
    </div>
  );
}
