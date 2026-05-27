'use client';

import React, { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ShoppingCart, 
  User, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LogOut, 
  Settings, 
  LayoutDashboard,
  MapPin,
  ChevronDown,
  Locate,
  Plus,
  Grid,
  Sparkles,
  Armchair,
  Table,
  Bed
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useThemeStore } from '@/store/useThemeStore';
import CartDrawer from './CartDrawer';
import { getUserAddresses, addAddress } from '@/app/actions/settings';
import { toast } from 'sonner';

const Navbar = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [searchVal, setSearchVal] = useState('');
  const [searchDept, setSearchDept] = useState('All');
  const [pincode, setPincode] = useState('110001');
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [tempPincode, setTempPincode] = useState('110001');
  const [city, setCity] = useState('Delhi');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    country: 'India'
  });

  const totalItems = useCartStore((state) => state.totalItems());
  const { theme, toggleTheme } = useThemeStore();
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (session && isPincodeModalOpen) {
      setIsLoadingAddresses(true);
      async function fetchAddresses() {
        try {
          const list = await getUserAddresses();
          setSavedAddresses(list);
        } catch (err) {
          console.error("Failed to load saved addresses:", err);
        } finally {
          setIsLoadingAddresses(false);
        }
      }
      fetchAddresses();
    }
  }, [session, isPincodeModalOpen]);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      const scrolled = window.scrollY > 40;
      setIsScrolled((prev) => prev !== scrolled ? scrolled : prev);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Retrieve saved pincode if available
    const savedPin = localStorage.getItem('advik_pincode');
    const savedCity = localStorage.getItem('advik_city');
    if (savedPin) setPincode(savedPin);
    if (savedCity) setCity(savedCity);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Do not show main navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchDept !== 'All') {
      params.set('category', searchDept);
    }
    if (searchVal) {
      params.set('query', searchVal);
    }
    router.push(`/collections?${params.toString()}`);
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempPincode.length === 6 && /^\d+$/.test(tempPincode)) {
      setPincode(tempPincode);
      localStorage.setItem('advik_pincode', tempPincode);
      
      // Simulate city lookup
      let detectedCity = 'Delhi';
      if (tempPincode.startsWith('400')) detectedCity = 'Mumbai';
      else if (tempPincode.startsWith('560')) detectedCity = 'Bengaluru';
      else if (tempPincode.startsWith('600')) detectedCity = 'Chennai';
      else if (tempPincode.startsWith('700')) detectedCity = 'Kolkata';
      else if (tempPincode.startsWith('110')) detectedCity = 'Delhi';
      else detectedCity = 'India';

      setCity(detectedCity);
      localStorage.setItem('advik_city', detectedCity);
      setIsPincodeModalOpen(false);
    } else {
      alert("Please enter a valid 6-digit Indian PIN code.");
    }
  };

  const fallbackToIPLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      const pin = data.postal || '110001';
      const detCity = data.city || 'Delhi';
      setPincode(pin);
      setCity(detCity);
      localStorage.setItem('advik_pincode', pin);
      localStorage.setItem('advik_city', detCity);
      toast.success(`Location resolved via IP: ${detCity} (${pin})`);
      setIsPincodeModalOpen(false);
    } catch {
      toast.error("Could not automatically determine location.");
    }
  };

  const fetchAutomaticLocation = async () => {
    setIsLoadingAddresses(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await res.json();
              const pin = data.address?.postcode || '110001';
              const detCity = data.address?.city || data.address?.state_district || data.address?.state || 'Delhi';
              setPincode(pin);
              setCity(detCity);
              localStorage.setItem('advik_pincode', pin);
              localStorage.setItem('advik_city', detCity);
              toast.success(`Location set to ${detCity} (${pin})`);
              setIsPincodeModalOpen(false);
            } catch {
              await fallbackToIPLocation();
            }
          },
          async () => {
            await fallbackToIPLocation();
          }
        );
      } else {
        await fallbackToIPLocation();
      }
    } catch {
      toast.error("Failed to automatically detect location.");
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.street.length < 5) {
      toast.error("Street address must be at least 5 characters.");
      return;
    }
    if (newAddress.postalCode.length !== 6 || !/^\d+$/.test(newAddress.postalCode)) {
      toast.error("PIN code must be a 6-digit number.");
      return;
    }
    setIsLoadingAddresses(true);
    try {
      const res = await addAddress({
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        postalCode: newAddress.postalCode,
        country: newAddress.country,
        phone: newAddress.phone || undefined
      });
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      toast.success("New address cataloged successfully!");
      
      // Reload addresses list
      const list = await getUserAddresses();
      setSavedAddresses(list);
      
      // Set newly added address PIN code and city active
      setPincode(newAddress.postalCode);
      setCity(newAddress.city);
      localStorage.setItem('advik_pincode', newAddress.postalCode);
      localStorage.setItem('advik_city', newAddress.city);
      
      // Reset state and close modal
      setIsAddingAddress(false);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        country: 'India'
      });
      setIsPincodeModalOpen(false);
    } catch {
      toast.error("Something went wrong saving the address.");
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const departments = ['All', 'Chairs', 'Sofas', 'Tables', 'Beds'];

  const navLinks = [
    { name: 'Collections', href: '/collections' },
    { name: 'Chairs', href: '/category/chairs' },
    { name: 'Sofas', href: '/category/sofas' },
    { name: 'Tables', href: '/category/tables' },
    { name: 'Beds', href: '/category/beds' },
    { name: 'Showroom 3D', href: '/showroom' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex flex-col">
        {/* Main Search & Utility Navbar */}
        <nav
          className={`w-full transition-all duration-300 ${
            isScrolled 
              ? 'bg-stone-900/95 dark:bg-stone-950/95 shadow-lg border-b border-stone-800' 
              : 'bg-stone-900 dark:bg-stone-950'
          } text-white px-4 md:px-6 py-3`}
        >
          <div className="container mx-auto flex items-center justify-between gap-4">
            
            {/* Left: Logo & Location */}
            <div className="flex items-center space-x-6 shrink-0">
              <Link href="/" prefetch={true} className="flex items-center space-x-2 group">
                <div className="relative w-8 h-8 md:w-9 md:h-9 overflow-hidden rounded-lg bg-stone-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Image 
                    src="/logoAFI.png" 
                    alt="Advik Logo" 
                    width={28} 
                    height={28}
                    className="object-contain p-0.5"
                    priority
                  />
                </div>
                <span className="text-lg md:text-xl font-serif font-bold tracking-tight text-white">
                  Advik<span className="text-stone-400 font-normal">Furniture</span>
                </span>
              </Link>

              {/* Delivery Pincode Selector */}
              <button 
                onClick={() => {
                  setTempPincode(pincode);
                  setIsPincodeModalOpen(true);
                }}
                className="hidden lg:flex items-center space-x-2 text-left group px-3 py-1.5 rounded-lg hover:bg-stone-800 transition-colors border border-transparent hover:border-stone-700"
              >
                <MapPin size={16} className="text-stone-400 group-hover:text-white transition-colors" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider leading-none">Deliver to</span>
                  <span className="text-xs font-black tracking-tight leading-normal text-white">{city} {pincode}</span>
                </div>
              </button>
            </div>

            {/* Center: Amazon-style Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <form onSubmit={handleSearchSubmit} className="flex w-full h-10 rounded-lg overflow-hidden bg-white text-stone-900 focus-within:ring-2 focus-within:ring-stone-500 shadow-md">
                {/* Department Selector */}
                <div className="relative shrink-0 flex items-center bg-stone-100 hover:bg-stone-200 border-r border-stone-200 text-stone-700 text-xs px-3 cursor-pointer">
                  <select
                    value={searchDept}
                    onChange={(e) => setSearchDept(e.target.value)}
                    className="bg-transparent font-bold uppercase tracking-wider pr-4 outline-none cursor-pointer appearance-none text-[10px]"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept} className="text-stone-950 uppercase">{dept}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 pointer-events-none text-stone-500" />
                </div>

                {/* Input Query */}
                <input
                  type="text"
                  placeholder="Search Advik Furniture..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="flex-1 px-4 text-sm font-medium outline-none text-stone-900 bg-transparent"
                />

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-12 bg-stone-200 hover:bg-stone-300 text-stone-900 flex items-center justify-center transition-colors border-l border-stone-200"
                  aria-label="Submit Search"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Right: User / Wishlist / Cart */}
            <div className="flex items-center space-x-3 shrink-0">
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-stone-800 transition-colors hidden sm:block text-stone-400 hover:text-white overflow-hidden"
                aria-label="Toggle Theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ y: -15, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 15, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.15 }}
                  >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* Accounts & Lists */}
              <div className="relative">
                <button
                  onClick={() => session ? setIsProfileOpen(!isProfileOpen) : router.push('/auth')}
                  className="flex flex-col text-left px-3 py-1.5 rounded-lg hover:bg-stone-800 border border-transparent hover:border-stone-700 transition-colors"
                >
                  <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider leading-none">
                    {session ? `Hello, ${session.user?.name?.split(' ')[0]}` : 'Hello, Sign In'}
                  </span>
                  <span className="text-xs font-black tracking-tight leading-normal text-white flex items-center gap-1">
                    Account & Lists <ChevronDown size={10} className="text-stone-400" />
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && session && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-2 z-50 text-white"
                      >
                        <div className="px-4 py-3 border-b border-stone-800 mb-2">
                          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Your Account</p>
                          <p className="text-sm font-bold truncate">{session.user?.name || session.user?.email}</p>
                        </div>
                        {session && ["SUPER_ADMIN", "STAFF_ADMIN", "CONTENT_MANAGER"].includes((session.user as { role?: string })?.role || '') && (
                          <Link 
                            href="/admin" 
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-stone-300 hover:bg-stone-800 rounded-lg transition-colors group"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <LayoutDashboard size={16} className="group-hover:scale-105 transition-transform text-stone-400" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <Link 
                          href="/settings/profile" 
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-stone-300 hover:bg-stone-800 rounded-lg transition-colors group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings size={16} className="group-hover:rotate-45 transition-transform text-stone-400" />
                          <span>Account Settings</span>
                        </Link>
                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            signOut();
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/20 rounded-lg transition-colors group text-left"
                        >
                          <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform text-red-500" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link 
                href="/settings/wishlist" 
                className="p-2 rounded-lg hover:bg-stone-800 transition-colors hidden sm:block text-stone-400 hover:text-white"
                aria-label="Wishlist"
              >
                <Heart size={18} />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-stone-800 border border-transparent hover:border-stone-700 transition-colors"
                aria-label="View Cart"
              >
                <div className="relative">
                  <ShoppingCart size={20} className="text-white" />
                  {isMounted && totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-stone-950 text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-xs font-black text-white hidden lg:inline">Cart</span>
              </button>

              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 text-stone-400 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Secondary Amazon sub-navbar */}
        <div className="w-full bg-stone-900 dark:bg-stone-950 border-b border-stone-800 py-2.5 px-4 md:px-6 text-stone-300 flex items-center justify-between text-xs overflow-x-auto no-scrollbar font-semibold">
          <div className="container mx-auto flex items-center justify-between w-full">
            <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-300 hover:text-white hover:bg-stone-800/40 dark:hover:bg-stone-800/40 transition-all duration-300"
              >
                <Menu size={12} className="text-stone-400" />
                <span>All Departments</span>
              </button>
              
              <div className="w-[1px] h-3.5 bg-stone-800 dark:bg-stone-800/80 shrink-0"></div>

              {navLinks.map((link) => {
                const linkIcons: Record<string, React.ComponentType<any>> = {
                  'Collections': Grid,
                  'Chairs': Armchair,
                  'Sofas': Armchair,
                  'Tables': Table,
                  'Beds': Bed,
                  'Showroom 3D': Sparkles
                };
                const Icon = linkIcons[link.name] || Grid;
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`relative px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center space-x-2 whitespace-nowrap overflow-hidden ${
                      isActive 
                        ? 'bg-white text-stone-950 shadow-md dark:bg-white dark:text-stone-950' 
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/40 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <Icon size={12} className={isActive ? 'text-stone-950' : 'text-stone-400'} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
            <div className="hidden lg:flex items-center space-x-4 shrink-0 text-stone-500 text-[9px] tracking-wider uppercase font-bold">
              <span>₹10,000+ free shipping</span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-700"></span>
              <span>100% genuine quality</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-[86px] left-0 w-full bg-stone-900 text-white border-b border-stone-800 z-40 p-6 flex flex-col space-y-4 shadow-2xl"
          >
            {/* Search Input for Mobile */}
            <form onSubmit={handleSearchSubmit} className="flex rounded-lg overflow-hidden bg-white text-stone-900 h-9">
              <input
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="flex-1 px-3 text-xs outline-none"
              />
              <button type="submit" className="px-3 bg-stone-200 border-l border-stone-300">
                <Search size={14} />
              </button>
            </form>

            <div className="flex flex-col space-y-3 font-semibold text-sm pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-stone-300 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {session && ["SUPER_ADMIN", "STAFF_ADMIN", "CONTENT_MANAGER"].includes((session.user as { role?: string })?.role || '') && (
                <Link 
                  href="/admin" 
                  className="text-stone-300 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indian PIN Code Selector Modal */}
      <AnimatePresence>
        {isPincodeModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsPincodeModalOpen(false);
                setIsAddingAddress(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl shadow-2xl z-[100] text-stone-900 dark:text-white space-y-4"
            >
              <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider">
                  {isAddingAddress ? 'Add Delivery Address' : 'Choose your location'}
                </h3>
                <button 
                  onClick={() => {
                    setIsPincodeModalOpen(false);
                    setIsAddingAddress(false);
                  }} 
                  className="text-stone-400 hover:text-stone-900 dark:hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {isAddingAddress ? (
                /* Inline Add Address Form (Amazon Style) */
                <form onSubmit={handleAddAddressSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat, house number, area details"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full p-2.5 border border-stone-300 dark:border-stone-800 rounded-lg bg-transparent text-xs dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full p-2.5 border border-stone-300 dark:border-stone-800 rounded-lg bg-transparent text-xs dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">State *</label>
                      <input
                        type="text"
                        required
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full p-2.5 border border-stone-300 dark:border-stone-800 rounded-lg bg-transparent text-xs dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">PIN Code (6 digits) *</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="e.g. 400001"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        className="w-full p-2.5 border border-stone-300 dark:border-stone-800 rounded-lg bg-transparent text-xs dark:text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Phone</label>
                      <input
                        type="text"
                        placeholder="10-digit number"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full p-2.5 border border-stone-300 dark:border-stone-800 rounded-lg bg-transparent text-xs dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="flex-1 py-2.5 text-[10px] uppercase font-bold tracking-widest text-stone-500 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoadingAddresses}
                      className="flex-1 py-2.5 text-[10px] uppercase font-bold tracking-widest text-white dark:text-stone-950 bg-stone-950 dark:bg-white hover:opacity-90 rounded-lg disabled:opacity-50"
                    >
                      {isLoadingAddresses ? 'Cataloging...' : 'Save & Deliver'}
                    </button>
                  </div>
                </form>
              ) : (
                /* Choose Location Dashboard */
                <>
                  {/* Saved Addresses List */}
                  {session ? (
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      <div className="flex justify-between items-center pb-1">
                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Select a delivery address</p>
                        <button 
                          onClick={() => setIsAddingAddress(true)}
                          className="text-[9px] font-bold text-stone-950 dark:text-white uppercase tracking-widest hover:underline flex items-center gap-1"
                        >
                          <Plus size={10} /> Add address
                        </button>
                      </div>
                      
                      {isLoadingAddresses ? (
                        <div className="py-4 text-center text-xs text-stone-500 font-bold uppercase tracking-wider animate-pulse">Loading addresses...</div>
                      ) : savedAddresses.length > 0 ? (
                        savedAddresses.map((addr) => (
                          <button
                            key={addr.id}
                            onClick={() => {
                              setPincode(addr.postalCode);
                              setCity(addr.city);
                              localStorage.setItem('advik_pincode', addr.postalCode);
                              localStorage.setItem('advik_city', addr.city);
                              setIsPincodeModalOpen(false);
                            }}
                            className={`w-full text-left p-3 border rounded-xl transition-colors flex items-start space-x-3 text-xs ${
                              pincode === addr.postalCode 
                                ? 'border-stone-900 dark:border-white bg-stone-50 dark:bg-stone-800/40' 
                                : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50/50 dark:hover:bg-stone-800/50'
                            }`}
                          >
                            <MapPin size={14} className="text-stone-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold dark:text-white truncate">{addr.street}</p>
                              <p className="text-stone-500 dark:text-stone-400 text-[10px]">{addr.city}, {addr.state} - {addr.postalCode}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="text-xs text-stone-500 italic py-2 text-center">No saved addresses found.</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-stone-100 dark:bg-stone-900/60 rounded-xl text-center text-xs">
                      <Link href="/auth" className="text-stone-950 dark:text-white font-bold underline" onClick={() => setIsPincodeModalOpen(false)}>
                        Sign in to see your addresses
                      </Link>
                    </div>
                  )}

                  {/* Geolocation Autodetect Button (Amazon Style) */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                    <button
                      onClick={fetchAutomaticLocation}
                      disabled={isLoadingAddresses}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-bold uppercase tracking-wider dark:text-white transition-colors"
                    >
                      <Locate size={14} className="text-stone-500 dark:text-stone-400 shrink-0" />
                      <span>Use my current location (GPS / IP)</span>
                    </button>
                  </div>

                  {/* Enter PIN Code Input */}
                  <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Or enter an Indian PIN code</p>
                    <form onSubmit={handlePincodeSubmit} className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={tempPincode}
                        onChange={(e) => setTempPincode(e.target.value)}
                        placeholder="Enter 6-digit PIN code"
                        className="flex-1 px-3 py-2 text-xs border border-stone-300 dark:border-stone-800 rounded-lg outline-none focus:ring-1 focus:ring-stone-950 dark:focus:ring-white bg-transparent dark:text-white font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-950 text-xs font-bold uppercase rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Apply
                      </button>
                    </form>
                  </div>

                  {/* International Country Select */}
                  <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Or select a country</p>
                    <select
                      defaultValue="IN"
                      onChange={(e) => {
                        if (e.target.value !== 'IN') {
                          setCity('International');
                          setPincode(e.target.value);
                          localStorage.setItem('advik_pincode', e.target.value);
                          localStorage.setItem('advik_city', 'International');
                          setIsPincodeModalOpen(false);
                        }
                      }}
                      className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-800 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-white outline-none cursor-pointer"
                    >
                      <option value="IN" className="dark:bg-stone-900">India</option>
                      <option value="US" className="dark:bg-stone-900">United States</option>
                      <option value="GB" className="dark:bg-stone-900">United Kingdom</option>
                      <option value="CA" className="dark:bg-stone-900">Canada</option>
                      <option value="AE" className="dark:bg-stone-900">United Arab Emirates</option>
                    </select>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
