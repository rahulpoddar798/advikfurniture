'use client';

import React, { useTransition } from 'react';
import { updateNotifications } from '@/app/actions/settings';
import { toast } from 'sonner';
import { Bell, Mail, ShieldAlert, BadgePercent, Sparkles, Loader2, Save } from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotional: boolean;
  wishlistAlerts: boolean;
  newArrivals: boolean;
}

interface NotificationClientProps {
  initialSettings: NotificationSettings;
}

export default function NotificationClient({ initialSettings }: NotificationClientProps) {
  const [settings, setSettings] = React.useState(initialSettings);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateNotifications(settings);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success);
      }
    });
  };

  const items = [
    {
      key: 'emailNotifications' as const,
      title: 'Email Notifications',
      description: 'Receive newsletters, digests, and product feedback reminders.',
      icon: Mail,
    },
    {
      key: 'orderUpdates' as const,
      title: 'Order Status & Tracking',
      description: 'Get immediate notifications when your package is processed, shipped, or delivered.',
      icon: ShieldAlert,
    },
    {
      key: 'promotional' as const,
      title: 'Discounts & Promotions',
      description: 'Be the first to hear about seasonal sales, discount campaigns, and exclusive coupon codes.',
      icon: BadgePercent,
    },
    {
      key: 'wishlistAlerts' as const,
      title: 'Wishlist Updates',
      description: 'Get notified when items in your wishlist go on sale or drop in stock.',
      icon: Bell,
    },
    {
      key: 'newArrivals' as const,
      title: 'New Collections',
      description: 'Receive announcements when our carpentry studios introduce new luxury furniture lines.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-stone-200/50 dark:border-stone-800/50 rounded-3xl p-8 lg:p-12 shadow-2xl space-y-8">
      <div className="space-y-6">
        {items.map((item) => {
          const Icon = item.icon;
          const checked = settings[item.key];
          return (
            <div 
              key={item.key}
              onClick={() => handleToggle(item.key)}
              className="flex items-start justify-between gap-6 p-4 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/35 transition-colors duration-300 cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl text-stone-500 dark:text-stone-400 shrink-0">
                  <Icon size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold dark:text-white">{item.title}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-lg leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* IOS-Style Toggle Switch */}
              <div 
                className={`w-11 h-6 rounded-full transition-colors duration-300 relative flex items-center p-0.5 shrink-0 ${
                  checked ? 'bg-stone-950 dark:bg-white' : 'bg-stone-200 dark:bg-stone-800'
                }`}
              >
                <div 
                  className={`w-5 h-5 rounded-full bg-white dark:bg-stone-950 shadow-md transform transition-transform duration-300 ${
                    checked ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-6 border-t border-stone-100 dark:border-stone-800">
        <button 
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center space-x-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-xl group"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Save size={16} className="group-hover:scale-110 transition-transform" />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
