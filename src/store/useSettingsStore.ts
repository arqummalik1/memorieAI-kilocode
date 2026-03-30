'use client';

import { create } from 'zustand';

interface SettingsState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
