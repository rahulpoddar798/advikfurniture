'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = memo(() => {
  const pathname = usePathname();

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const phone = "919471983191";
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `whatsapp://send?phone=${phone}`;
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${phone}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Do not show main footer on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="bg-stone-900 dark:bg-stone-950 text-stone-200 py-20 px-6 transition-colors duration-500">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-serif font-bold tracking-tighter text-white uppercase leading-tight">
              Advik Furniture <br /> and Interior
            </h2>
            <p className="text-[10px] font-bold tracking-[0.3em] text-stone-500 mt-2 uppercase">
              CRAFTED FOR YOUR HOME
            </p>
          </div>
          <p className="text-stone-400 dark:text-stone-500 max-w-xs text-sm leading-relaxed">
            Crafting premium furniture that transforms houses into homes. Quality, comfort, and style in every piece.
          </p>
          {/* Social Icons */}
          <div className="flex items-center space-x-5 pt-2">
            <a 
              href="https://www.facebook.com/people/Advik-Furniture-And-Interior/100094145480813/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-white transition-all hover:scale-110"
              aria-label="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a 
              href="https://www.instagram.com/advik_furniture_and_interior/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-white transition-all hover:scale-110"
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a 
              href="https://www.threads.com/@advik_furniture_and_interior" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-white transition-all hover:scale-110"
              aria-label="Threads"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.25 20.25a2.5 2.5 0 0 1-2.5 2.5h-9.5a2.5 2.5 0 0 1-2.5-2.5v-1.5a2.5 2.5 0 0 1 2.5-2.5h9.5a2.5 2.5 0 0 1 2.5 2.5v1.5z"></path><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 7v10"></path><path d="M8 12h8"></path></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="text-white text-sm font-bold uppercase tracking-widest">Quick Links</h3>
          <ul className="space-y-3 text-sm text-stone-400 dark:text-stone-500">
            <li><Link href="/" prefetch={false} className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/category/beds" prefetch={false} className="hover:text-white transition-colors">Beds</Link></li>
            <li><Link href="/category/sofas" prefetch={false} className="hover:text-white transition-colors">Sofas</Link></li>
            <li><Link href="/category/chairs" prefetch={false} className="hover:text-white transition-colors">Chairs</Link></li>
            <li><Link href="/category/dining" prefetch={false} className="hover:text-white transition-colors">Dining Tables</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="space-y-6">
          <h3 className="text-white text-sm font-bold uppercase tracking-widest">Customer Service</h3>
          <ul className="space-y-3 text-sm text-stone-400 dark:text-stone-500">
            <li><Link href="/contact" prefetch={false} className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/shipping" prefetch={false} className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
            <li><Link href="/returns" prefetch={false} className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
            <li><Link href="/faq" prefetch={false} className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/warranty" prefetch={false} className="hover:text-white transition-colors">Warranty Information</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h3 className="text-white text-sm font-bold uppercase tracking-widest">Contact Us</h3>
          <div className="space-y-4 text-sm text-stone-400 dark:text-stone-500">
            <div className="flex items-start space-x-3">
              <MapPin size={18} className="text-stone-500 shrink-0 mt-0.5" />
              <a 
                href="https://www.google.com/maps/place/Advik+Furniture+And+Interior/@13.1765737,80.1961679,17z/data=!3m1!4b1!4m6!3m5!1s0x3a527ba51a8c7c67:0xf3152980307d6e2f!8m2!3d13.1765737!4d80.1961679!16s%2Fg%2F11ykgtw_sf?entry=ttu&g_ep=EgoyMDI2MDUxMi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                663A, Thandal Kazhani, G.N.T Road,<br />Puzhal Redhills, Chennai - 66
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={18} className="text-stone-500 shrink-0" />
              <button 
                onClick={handleWhatsAppClick}
                className="hover:text-white transition-colors text-left"
                aria-label="Chat on WhatsApp"
              >
                +91 94719 83191
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={18} className="text-stone-500 shrink-0" />
              <a href="mailto:info@advik.com" className="hover:text-white transition-colors">
                info@advik.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="container mx-auto mt-20 pt-8 border-t border-stone-800 dark:border-stone-900 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-stone-500 text-center md:text-left gap-4 md:gap-0">
        <p>© 2025 Advik Furniture and Interior. All rights reserved.</p>
        <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 mt-4 md:mt-0">
          <Link href="/privacy" prefetch={false} className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" prefetch={false} className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/cookies" prefetch={false} className="hover:text-white transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
