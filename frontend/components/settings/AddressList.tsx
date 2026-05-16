'use client';

import React, { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Plus, Trash2, CheckCircle2, 
  Loader2, X, Home, Briefcase, Map as MapIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  addAddress, 
  deleteAddress, 
  setDefaultAddress,
  updateAddress 
} from '@/app/actions/settings';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
}

interface AddressListProps {
  initialAddresses: Address[];
}

const AddressList = ({ initialAddresses }: AddressListProps) => {
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });

  const handleAction = async (action: () => Promise<any>, successMsg: string) => {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(successMsg);
        setIsAdding(false);
        setEditingId(null);
        setFormData({
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
          phone: '',
        });
      }
    });
  };

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    handleAction(() => addAddress(formData), "Address added successfully!");
  };

  const onSetDefault = (id: string) => {
    handleAction(() => setDefaultAddress(id), "Default address updated!");
  };

  const onDelete = (id: string) => {
    handleAction(() => deleteAddress(id), "Address deleted successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-stone-200 dark:shadow-none group"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Add New Address</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-stone-200/50 dark:border-stone-800/50 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold dark:text-white">New Shipping Address</h3>
              <button onClick={() => setIsAdding(false)} className="text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={onAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 px-1">Street Address</label>
                <input
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white"
                  placeholder="123 Luxury Lane"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 px-1">City</label>
                <input
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white"
                  placeholder="Chennai"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 px-1">State / Province</label>
                <input
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white"
                  placeholder="Tamil Nadu"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 px-1">Postal Code</label>
                <input
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white"
                  placeholder="600066"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 px-1">Country</label>
                <input
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-6 outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white transition-all dark:text-white"
                  placeholder="India"
                />
              </div>
              <div className="md:col-span-2 flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center space-x-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 group"
                >
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : <span>Add Address</span>}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initialAddresses.map((address) => (
          <motion.div
            key={address.id}
            layout
            className={`relative group bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border ${
              address.isDefault ? 'border-stone-900 dark:border-white' : 'border-stone-200/50 dark:border-stone-800/50'
            } rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl`}
          >
            {address.isDefault && (
              <div className="absolute -top-3 left-6 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest flex items-center space-x-1">
                <CheckCircle2 size={10} />
                <span>Default Address</span>
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400">
                <MapPin size={20} />
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {!address.isDefault && (
                  <button 
                    onClick={() => onSetDefault(address.id)}
                    className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors text-stone-500 hover:text-stone-900 dark:hover:text-white"
                    title="Set as Default"
                  >
                    <CheckCircle2 size={18} />
                  </button>
                )}
                <button 
                  onClick={() => onDelete(address.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-stone-500 hover:text-red-500"
                  title="Delete Address"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-lg dark:text-white">{address.street}</p>
              <p className="text-stone-500 dark:text-stone-400">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-stone-500 dark:text-stone-400 font-medium">{address.country}</p>
              {address.phone && (
                <p className="text-stone-400 dark:text-stone-500 text-sm mt-2 flex items-center space-x-2">
                  <span>Phone:</span>
                  <span className="font-medium text-stone-600 dark:text-stone-300">{address.phone}</span>
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {initialAddresses.length === 0 && !isAdding && (
          <div className="md:col-span-2 py-20 text-center space-y-4 bg-stone-100/50 dark:bg-stone-900/50 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-[2.5rem]">
            <div className="inline-flex p-6 rounded-full bg-stone-200/50 dark:bg-stone-800/50 text-stone-400">
              <MapIcon size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold dark:text-white">No addresses found</p>
              <p className="text-stone-500 dark:text-stone-400">Add your first shipping address to get started.</p>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="text-stone-900 dark:text-white font-bold uppercase tracking-widest text-[10px] hover:underline"
            >
              Add your first address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressList;
