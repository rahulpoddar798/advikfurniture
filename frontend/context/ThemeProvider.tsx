'use client';

import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  // Only apply theme logic once mounted to client
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (mounted) {
      root.classList.add('theme-transition');
    } else {
      setMounted(true);
    }
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    
    if (mounted) {
      const timer = setTimeout(() => {
        root.classList.remove('theme-transition');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [theme, mounted]);

  return <>{children}</>;
}
