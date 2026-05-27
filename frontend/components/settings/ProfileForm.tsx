'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { User, Mail, Phone, AlignLeft, Camera, Loader2, Save } from 'lucide-react';
import { updateProfile } from '@/app/actions/settings';
import Image from 'next/image';

const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  image: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

interface ProfileFormProps {
  user: {
    name: string | null;
    email: string | null;
    phone: string | null;
    bio: string | null;
    image: string | null;
  };
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(user.image);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      bio: user.bio || "",
      image: user.image || "",
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    startTransition(async () => {
      const result = await updateProfile(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        form.setValue("image", reader.result as string); // In a real app, upload this to a server
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
      {/* Avatar Section */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 pb-8 border-b border-stone-100 dark:border-stone-800">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-stone-100 dark:bg-stone-800 border-4 border-white dark:border-stone-900 shadow-xl relative transition-transform duration-500 group-hover:scale-105">
            {previewImage && previewImage.trim() !== "" ? (
              <Image 
                src={previewImage} 
                alt="Profile" 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400">
                <User size={48} />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-10 h-10 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform duration-300 border-4 border-white dark:border-stone-900">
            <Camera size={18} />
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div className="text-center md:text-left space-y-1">
          <h3 className="text-xl font-bold dark:text-white">Profile Picture</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">JPG, GIF or PNG. Max size of 2MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 px-1">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors" />
            <input 
              {...form.register("name")}
              className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white"
              placeholder="John Doe"
            />
          </div>
          {form.formState.errors.name && (
            <span className="text-xs text-red-500 px-1">{form.formState.errors.name.message}</span>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 px-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors" />
            <input 
              {...form.register("email")}
              type="email"
              className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white"
              placeholder="hello@advik.com"
            />
          </div>
          {form.formState.errors.email && (
            <span className="text-xs text-red-500 px-1">{form.formState.errors.email.message}</span>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 px-1">Phone Number</label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors" />
            <input 
              {...form.register("phone")}
              className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 px-1">Bio</label>
          <div className="relative group">
            <AlignLeft className="absolute left-4 top-6 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors" />
            <textarea 
              {...form.register("bio")}
              rows={4}
              className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="flex justify-end px-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
              {/* eslint-disable-next-line react-hooks/incompatible-library */}
              {form.watch("bio")?.length || 0} / 500
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button 
          type="submit"
          disabled={isPending}
          className="flex items-center space-x-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-stone-200 dark:shadow-none group"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Save size={16} className="group-hover:scale-110 transition-transform" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
