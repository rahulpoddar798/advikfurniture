import React from 'react';
import { auth } from '@/auth';
import { getWishlistItems } from '@/app/actions/settings';
import WishlistClient from './WishlistClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth');
  }

  const items = await getWishlistItems();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif font-bold tracking-tight dark:text-white">My Wishlist</h1>
        <p className="text-stone-500 dark:text-stone-400">View and manage your favorite luxury furniture pieces.</p>
      </div>

      <WishlistClient initialItems={items} />
    </div>
  );
}
