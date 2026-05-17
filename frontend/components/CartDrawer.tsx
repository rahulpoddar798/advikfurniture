'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      alert("Order placed successfully! This was a simulation of the 2026 checkout flow.");
      clearCart();
      setIsCheckingOut(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-stone-900 z-[70] shadow-2xl flex flex-col transition-colors duration-500"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between dark:text-white">
              <div className="flex items-center space-x-3">
                <ShoppingCart size={20} />
                <h2 className="text-sm font-bold uppercase tracking-widest">Your Cart ({totalItems()})</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40 dark:text-white">
                  <ShoppingCart size={48} />
                  <p className="font-serif italic text-lg text-center">Your cart is as empty as a minimalist room.</p>
                  <button 
                    onClick={onClose}
                    className="text-xs font-bold uppercase tracking-widest border-b border-stone-900 dark:border-white pb-1"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item, index) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex space-x-6"
                    >
                      <div className="w-24 aspect-square bg-stone-100 dark:bg-stone-800 overflow-hidden rounded-sm flex-shrink-0 relative">
                        <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                      </div>
                      <div className="flex-1 space-y-2 dark:text-white">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-bold uppercase tracking-tight">{item.name}</h3>
                          <button onClick={() => removeItem(item.id)} className="text-stone-400 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm font-serif text-stone-500 dark:text-stone-400">₹{item.price.toLocaleString()}</p>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded-full px-3 py-1">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="hover:text-stone-400 p-1"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="mx-4 text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="hover:text-stone-400 p-1"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-stone-100 dark:border-stone-800 space-y-6 bg-stone-50 dark:bg-stone-950">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Total Amount</span>
                  <span className="text-2xl font-serif font-bold text-stone-900 dark:text-white">₹{totalPrice().toLocaleString()}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-stone-900 dark:bg-white dark:text-stone-900 text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-800 dark:hover:bg-stone-200 transition-all flex items-center justify-center space-x-3 disabled:bg-stone-400"
                >
                  {isCheckingOut ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <CreditCard size={18} />
                  )}
                  <span>{isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}</span>
                </button>
                <p className="text-[10px] text-center text-stone-400 uppercase tracking-widest">
                  Secure encrypted 2026-standard checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
