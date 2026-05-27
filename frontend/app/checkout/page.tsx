'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  MapPin, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck, 
  Package 
} from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);

  // Address State
  const [address, setAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    phone: ''
  });

  // Shipping Speed State
  const [shippingOption, setShippingOption] = useState('standard'); // standard, express, whiteGlove

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, card
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    setIsMounted(true);
    // Prefill pincode from navbar location if saved
    const savedPin = localStorage.getItem('advik_pincode');
    const savedCity = localStorage.getItem('advik_city');
    if (savedPin) setAddress(prev => ({ ...prev, pincode: savedPin }));
    if (savedCity) setAddress(prev => ({ ...prev, city: savedCity, state: savedCity }));
  }, []);

  if (!isMounted) return null;

  if (items.length === 0 && step < 5) {
    return (
      <div className="pt-40 pb-20 px-6 text-center max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center mx-auto text-stone-400">
          <Package size={40} />
        </div>
        <h2 className="text-xl font-bold uppercase tracking-wide dark:text-white">Your Cart is Empty</h2>
        <p className="text-sm text-stone-500">Please add furniture pieces to your cart before proceeding to checkout.</p>
        <button
          onClick={() => router.push('/collections')}
          className="w-full py-4 bg-stone-950 dark:bg-white text-white dark:text-stone-950 font-bold uppercase tracking-widest text-xs rounded-xl hover:opacity-90 transition-opacity"
        >
          Browse Collections
        </button>
      </div>
    );
  }

  // Shipping cost definitions
  const shippingCosts: Record<string, number> = {
    standard: 0,
    express: 499,
    whiteGlove: 1999
  };

  const shippingCost = shippingCosts[shippingOption] || 0;
  const subtotal = totalPrice();
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const finalTotal = subtotal + shippingCost + tax;

  const handleNextStep = () => {
    if (step === 1) {
      if (!address.fullName || !address.addressLine1 || !address.phone) {
        toast.error("Please fill in all required delivery fields.");
        return;
      }
      if (address.pincode.length !== 6) {
        toast.error("Please enter a valid 6-digit PIN code.");
        return;
      }
    }
    if (step === 3 && paymentMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.cvv) {
        toast.error("Please fill in card details.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handlePlaceOrder = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Processing your order with Advik Express...',
        success: () => {
          clearCart();
          setStep(5);
          return 'Order placed successfully!';
        },
        error: 'Payment processing failed. Please try again.'
      }
    );
  };

  return (
    <div className="pt-36 md:pt-40 pb-24 px-4 md:px-8 bg-stone-50 dark:bg-stone-950 transition-colors duration-500 min-h-screen">
      <div className="container mx-auto max-w-5xl">
        
        {/* Checkout Header Progress Bar */}
        {step < 5 && (
          <div className="mb-12 border-b border-stone-200 dark:border-stone-850 pb-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <h1 className="text-xl font-bold uppercase tracking-widest dark:text-white">Secure Checkout</h1>
            
            {/* Steps Indicators */}
            <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <span className={step >= 1 ? "text-stone-900 dark:text-white font-black" : ""}>1. Address</span>
              <ChevronRight size={14} />
              <span className={step >= 2 ? "text-stone-900 dark:text-white font-black" : ""}>2. Delivery</span>
              <ChevronRight size={14} />
              <span className={step >= 3 ? "text-stone-900 dark:text-white font-black" : ""}>3. Payment</span>
              <ChevronRight size={14} />
              <span className={step >= 4 ? "text-stone-900 dark:text-white font-black" : ""}>4. Review</span>
            </div>
          </div>
        )}

        {step < 5 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Form Area */}
            <div className="lg:col-span-8 bg-white dark:bg-stone-900/30 border border-stone-200/50 dark:border-stone-850 p-6 md:p-8 rounded-2xl shadow-xl space-y-8">
              
              {/* STEP 1: SHIPPING ADDRESS */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-stone-400" />
                    <h2 className="text-base font-black uppercase tracking-wider dark:text-white">Enter Delivery Address</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-full">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        placeholder="e.g. Rahul Poddar"
                        className="w-full p-3 border border-stone-300 dark:border-stone-800 rounded-xl bg-transparent outline-none focus:ring-1 focus:ring-stone-950 dark:focus:ring-white text-sm dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-1.5 col-span-full">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={address.addressLine1}
                        onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                        placeholder="Flat, House no., Apartment, Block"
                        className="w-full p-3 border border-stone-300 dark:border-stone-800 rounded-xl bg-transparent outline-none focus:ring-1 focus:ring-stone-950 dark:focus:ring-white text-sm dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5 col-span-full">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Area, Colony, Sector (Optional)</label>
                      <input
                        type="text"
                        value={address.addressLine2}
                        onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                        placeholder="Landmark or area details"
                        className="w-full p-3 border border-stone-300 dark:border-stone-800 rounded-xl bg-transparent outline-none focus:ring-1 focus:ring-stone-950 dark:focus:ring-white text-sm dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-450">City *</label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full p-3 border border-stone-300 dark:border-stone-800 rounded-xl bg-transparent outline-none focus:ring-1 focus:ring-stone-950 dark:focus:ring-white text-sm dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-450">State *</label>
                      <input
                        type="text"
                        required
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full p-3 border border-stone-300 dark:border-stone-800 rounded-xl bg-transparent outline-none focus:ring-1 focus:ring-stone-950 dark:focus:ring-white text-sm dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-450">PIN code (6 Digits) *</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        placeholder="e.g. 110001"
                        className="w-full p-3 border border-stone-300 dark:border-stone-800 rounded-xl bg-transparent outline-none focus:ring-1 focus:ring-stone-950 dark:focus:ring-white text-sm dark:text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-450">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        placeholder="10-digit number"
                        className="w-full p-3 border border-stone-300 dark:border-stone-800 rounded-xl bg-transparent outline-none focus:ring-1 focus:ring-stone-950 dark:focus:ring-white text-sm dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DELIVERY SPEEDS */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Truck className="text-stone-400" />
                    <h2 className="text-base font-black uppercase tracking-wider dark:text-white">Choose Delivery Options</h2>
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    {/* Standard option */}
                    <div 
                      onClick={() => setShippingOption('standard')}
                      className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex justify-between items-center ${
                        shippingOption === 'standard' 
                          ? 'border-stone-950 dark:border-white bg-stone-50 dark:bg-stone-900/50' 
                          : 'border-stone-200 dark:border-stone-850 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <span className="text-xs font-bold dark:text-white block">Standard Free Delivery</span>
                        <p className="text-[10px] text-stone-500 leading-relaxed">Estimated delivery in 4-7 business days. Standard doorstep drop-off.</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">FREE</span>
                    </div>

                    {/* Express option */}
                    <div 
                      onClick={() => setShippingOption('express')}
                      className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex justify-between items-center ${
                        shippingOption === 'express' 
                          ? 'border-stone-950 dark:border-white bg-stone-50 dark:bg-stone-900/50' 
                          : 'border-stone-200 dark:border-stone-850 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <span className="text-xs font-bold dark:text-white block">Express Courier Delivery</span>
                        <p className="text-[10px] text-stone-500 leading-relaxed">Fast delivery within 2-3 business days. Expedited priority dispatch.</p>
                      </div>
                      <span className="text-xs font-bold dark:text-white font-mono">₹499</span>
                    </div>

                    {/* White glove assembly option */}
                    <div 
                      onClick={() => setShippingOption('whiteGlove')}
                      className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex justify-between items-center ${
                        shippingOption === 'whiteGlove' 
                          ? 'border-stone-950 dark:border-white bg-stone-50 dark:bg-stone-900/50' 
                          : 'border-stone-200 dark:border-stone-850 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <span className="text-xs font-bold dark:text-white block">White-Glove Assembly & In-Room Placement</span>
                        <p className="text-[10px] text-stone-500 leading-relaxed">Advik carpenters unpack, place in room of choice, assemble, and clear packing rubbish.</p>
                      </div>
                      <span className="text-xs font-bold dark:text-white font-mono">₹1,999</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="text-stone-400" />
                    <h2 className="text-base font-black uppercase tracking-wider dark:text-white">Choose Payment Method</h2>
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    <label 
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex justify-between items-start ${
                        paymentMethod === 'cod' 
                          ? 'border-stone-950 dark:border-white bg-stone-50 dark:bg-stone-900/50' 
                          : 'border-stone-200 dark:border-stone-850 hover:bg-stone-50/50'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-stone-950 dark:accent-white mt-1 mr-3 shrink-0"
                      />
                      <div className="flex-1 space-y-1">
                        <span className="text-xs font-bold dark:text-white block">Cash / Pay on Delivery</span>
                        <p className="text-[10px] text-stone-500 leading-relaxed">Pay via UPI, Card, or Cash when the delivery crew delivers your furniture.</p>
                      </div>
                    </label>

                    <label 
                      onClick={() => setPaymentMethod('card')}
                      className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col space-y-4 ${
                        paymentMethod === 'card' 
                          ? 'border-stone-950 dark:border-white bg-stone-50 dark:bg-stone-900/50' 
                          : 'border-stone-200 dark:border-stone-850 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="accent-stone-950 dark:accent-white mt-1 mr-3 shrink-0"
                        />
                        <div className="flex-1 space-y-1">
                          <span className="text-xs font-bold dark:text-white block">Credit or Debit Card</span>
                          <p className="text-[10px] text-stone-500 leading-relaxed">We accept Visa, Mastercard, RuPay, and American Express.</p>
                        </div>
                      </div>

                      {/* Card Details form inside */}
                      {paymentMethod === 'card' && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                          <div className="space-y-1 col-span-full">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Card Number</label>
                            <input
                              type="text"
                              value={cardDetails.cardNumber}
                              onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                              placeholder="16-digit card number"
                              className="w-full p-2.5 border border-stone-300 dark:border-stone-800 rounded-lg bg-transparent text-xs dark:text-white"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Cardholder Name</label>
                            <input
                              type="text"
                              value={cardDetails.cardName}
                              onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                              placeholder="Name on card"
                              className="w-full p-2.5 border border-stone-300 dark:border-stone-800 rounded-lg bg-transparent text-xs dark:text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">CVV</label>
                            <input
                              type="password"
                              maxLength={3}
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                              placeholder="123"
                              className="w-full p-2.5 border border-stone-300 dark:border-stone-800 rounded-lg bg-transparent text-xs dark:text-white"
                            />
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & PLACE ORDER */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="text-stone-400" />
                    <h2 className="text-base font-black uppercase tracking-wider dark:text-white">Review Items & Delivery</h2>
                  </div>
                  
                  {/* Shipping preview */}
                  <div className="p-4 bg-stone-50 dark:bg-stone-900/40 border border-stone-150 dark:border-stone-850 rounded-xl text-xs space-y-2">
                    <div className="font-black uppercase tracking-widest text-[9px] text-stone-400">Ship To</div>
                    <p className="dark:text-white font-bold">{address.fullName}</p>
                    <p className="text-stone-500">{address.addressLine1}, {address.addressLine2 ? address.addressLine2 + ',' : ''} {address.city}, {address.state} - {address.pincode}</p>
                    <p className="text-stone-500">Phone: {address.phone}</p>
                  </div>

                  {/* Cart preview */}
                  <div className="space-y-4">
                    <div className="font-black uppercase tracking-widest text-[9px] text-stone-400">Items Ordered</div>
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b border-stone-100 dark:border-stone-850 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-800 overflow-hidden shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <span className="text-xs font-bold dark:text-white block uppercase truncate w-40 sm:w-56">{item.name}</span>
                            <span className="text-[10px] text-stone-500">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="flex justify-between items-center pt-6 border-t border-stone-100 dark:border-stone-800">
                {step > 1 ? (
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/collections')}
                    className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Back to catalog</span>
                  </button>
                )}

                {step < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-8 py-3.5 bg-stone-950 dark:bg-white text-white dark:text-stone-950 text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    className="px-10 py-4 bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-colors shadow-lg"
                  >
                    Place Your Order
                  </button>
                )}
              </div>

            </div>

            {/* Column 2: Order Summary Sticky Panel (lg:col-span-4) */}
            <div className="lg:col-span-4 lg:sticky lg:top-36 bg-white dark:bg-stone-900/30 border border-stone-200/50 dark:border-stone-850 p-6 rounded-2xl shadow-xl space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-800 pb-3">
                Order Summary
              </h3>
              
              <div className="space-y-3.5 text-xs text-stone-500 font-semibold uppercase tracking-wider">
                <div className="flex justify-between">
                  <span>Items ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                  <span className="text-stone-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Handling</span>
                  <span className="text-stone-900 dark:text-white">
                    {shippingCost > 0 ? `₹${shippingCost.toLocaleString()}` : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="text-stone-900 dark:text-white">₹{tax.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-stone-100 dark:border-stone-850 pt-4 flex justify-between text-sm font-black text-stone-900 dark:text-white">
                  <span>Order Total</span>
                  <span className="text-base font-serif">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 text-[9px] font-bold uppercase tracking-wider text-stone-400 flex items-center space-x-2 justify-center">
                <ShieldCheck size={12} className="text-stone-400" />
                <span>100% Secure Payment Guarantee</span>
              </div>
            </div>

          </div>
        ) : (
          /* STEP 5: SUCCESS / RECEIPT SCREEN */
          <div className="bg-white dark:bg-stone-900/30 border border-stone-250 dark:border-stone-850 p-8 md:p-12 rounded-3xl shadow-2xl text-center space-y-6 max-w-xl mx-auto">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle2 size={44} />
            </div>
            
            <h2 className="text-2xl font-serif font-black dark:text-white uppercase tracking-tight">Order Placed Successfully!</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-md mx-auto">
              Thank you for cataloging excellence. Your delivery address has been verified. Advik Express will contact you prior to dispatch.
            </p>

            <div className="p-4 bg-stone-50 dark:bg-stone-900/40 rounded-2xl border border-stone-150 dark:border-stone-850 max-w-sm mx-auto text-xs text-left space-y-2">
              <div className="font-black uppercase tracking-widest text-[9px] text-stone-400">Order Information</div>
              <div className="flex justify-between">
                <span className="font-bold text-stone-500">Shipping Mode</span>
                <span className="font-bold dark:text-white uppercase">{shippingOption}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-stone-500">Payment Mode</span>
                <span className="font-bold dark:text-white uppercase">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-stone-500">Delivery Est.</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Wednesday, Jun 3</span>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => router.push('/collections')}
                className="px-10 py-4 bg-stone-950 dark:bg-white text-white dark:text-stone-950 text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
