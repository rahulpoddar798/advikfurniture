import React from 'react';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import ProfileForm from '@/components/settings/ProfileForm';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      bio: true,
      image: true,
    }
  });

  if (!user) {
    redirect('/auth');
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif font-bold tracking-tight dark:text-white">Profile Settings</h1>
        <p className="text-stone-500 dark:text-stone-400">Manage your public profile and personal information.</p>
      </div>

      <div className="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-stone-200/50 dark:border-stone-800/50 rounded-3xl p-8 lg:p-12 shadow-2xl">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
