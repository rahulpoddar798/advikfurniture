import React from 'react';
import { auth } from '@/auth';
import { getNotificationSettings } from '@/app/actions/settings';
import NotificationClient from './NotificationClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth');
  }

  const settings = await getNotificationSettings();

  const defaultSettings = {
    emailNotifications: settings?.emailNotifications ?? true,
    orderUpdates: settings?.orderUpdates ?? true,
    promotional: settings?.promotional ?? false,
    wishlistAlerts: settings?.wishlistAlerts ?? true,
    newArrivals: settings?.newArrivals ?? false,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif font-bold tracking-tight dark:text-white">Notification Preferences</h1>
        <p className="text-stone-500 dark:text-stone-400">Control how and when you receive updates from Advik Furniture.</p>
      </div>

      <NotificationClient initialSettings={defaultSettings} />
    </div>
  );
}
