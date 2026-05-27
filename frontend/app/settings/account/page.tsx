import React from 'react';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ChangePasswordForm from '@/components/settings/ChangePasswordForm';

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      role: true,
      createdAt: true,
    }
  });

  if (!user) {
    redirect('/auth');
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif font-bold tracking-tight dark:text-white">Account Settings</h1>
        <p className="text-stone-500 dark:text-stone-400">Manage your account security and preferences.</p>
      </div>

      <div className="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-stone-200/50 dark:border-stone-800/50 rounded-3xl p-8 lg:p-12 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Email Address</p>
            <p className="text-lg font-medium dark:text-white">{user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Account Type</p>
            <p className="text-lg font-medium dark:text-white">{user.role}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Member Since</p>
            <p className="text-lg font-medium dark:text-white" suppressHydrationWarning>
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-100 dark:border-stone-800 space-y-6">
          <div>
            <h3 className="text-xl font-bold dark:text-white mb-2">Security</h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm">Update your password to keep your account secure.</p>
          </div>
          <div className="max-w-md">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
