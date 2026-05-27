'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Lock, Loader2, Save } from 'lucide-react';
import { changePassword } from '@/app/actions/settings';

const PasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof PasswordSchema>;

export default function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: PasswordFormValues) => {
    startTransition(async () => {
      const result = await changePassword(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        form.reset();
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Current Password */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 px-1">Current Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors" />
            <input 
              {...form.register("currentPassword")}
              type="password"
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-1 focus:ring-stone-950 dark:focus:ring-white transition-all dark:text-white"
              placeholder="••••••••"
            />
          </div>
          {form.formState.errors.currentPassword && (
            <span className="text-xs text-red-500 px-1 block">{form.formState.errors.currentPassword.message}</span>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 px-1">New Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors" />
            <input 
              {...form.register("newPassword")}
              type="password"
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-1 focus:ring-stone-950 dark:focus:ring-white transition-all dark:text-white"
              placeholder="•••••••• (Min 6 chars)"
            />
          </div>
          {form.formState.errors.newPassword && (
            <span className="text-xs text-red-500 px-1 block">{form.formState.errors.newPassword.message}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 px-1">Confirm New Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors" />
            <input 
              {...form.register("confirmPassword")}
              type="password"
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-1 focus:ring-stone-950 dark:focus:ring-white transition-all dark:text-white"
              placeholder="••••••••"
            />
          </div>
          {form.formState.errors.confirmPassword && (
            <span className="text-xs text-red-500 px-1 block">{form.formState.errors.confirmPassword.message}</span>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit"
          disabled={isPending}
          className="flex items-center space-x-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-xl group"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Save size={16} className="group-hover:scale-110 transition-transform" />
              <span>Update Password</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
