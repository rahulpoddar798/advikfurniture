import { create } from 'zustand';

interface AdminStore {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  
  // Analytics timeframe
  timeframe: '7d' | '30d' | '90d' | '1y';
  setTimeframe: (timeframe: '7d' | '30d' | '90d' | '1y') => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  openSidebar: () => set({ isSidebarOpen: true }),
  
  timeframe: '30d',
  setTimeframe: (timeframe) => set({ timeframe }),
}));
