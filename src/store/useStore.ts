import { create } from 'zustand';
import type { ProjectCard, Phase, Area, Module, Role } from '../types';

export interface Filters {
  module: string[];
  area: string[];
  role: string[];
}

export const emptyForm: ProjectCard = {
  id: '',
  title: '',
  phase: [],
  area: [],
  modules: [],
  roles: [],
  desc: '',
  link: '',
  checklist: []
};

export interface StoreState {
  // Данные БД
  phases: Phase[];
  areas: Area[];
  modules: Module[];
  roles: Role[];
  cards: ProjectCard[];

  // UI стейт
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  selectedCard: ProjectCard | null;
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  isFormOpen: boolean;
  formData: ProjectCard;
  searchQuery: string;
  selectedForExport: (string | number)[];

  // Фильтры
  filters: Filters;

  // Экшены
  toggleTheme: () => void;
  setAuth: (isAuthenticated: boolean) => void;
  setDirectories: (phases: Phase[], areas: Area[], modules: Module[], roles: Role[]) => void;
  setCards: (cards: ProjectCard[]) => void;
  setSelectedCard: (card: ProjectCard | null) => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  setIsSettingsOpen: (isOpen: boolean) => void;
  setIsFormOpen: (isOpen: boolean) => void;
  setFormData: (data: ProjectCard) => void;
  setSearchQuery: (query: string) => void;
  toggleFilter: (filterType: keyof Filters, value: string) => void;
  resetFilters: () => void;
  toggleExportSelection: (id: string | number) => void;
  clearExportSelection: () => void;
}

export const useStore = create<StoreState>((set) => ({
  phases: [],
  areas: [],
  modules: [],
  roles: [],
  cards: [],

  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  isAuthenticated: false,
  selectedCard: null,
  isSidebarOpen: false,
  isSettingsOpen: false,
  isFormOpen: false,
  formData: emptyForm,
  searchQuery: "",
  selectedForExport: [],

  filters: {
    module: ['all'],
    area: ['all'],
    role: ['all'],
  },

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),

  setAuth: (isAuthenticated) => set({ isAuthenticated }),

  setDirectories: (phases, areas, modules, roles) =>
    set({ phases, areas, modules, roles }),

  setCards: (cards) => set({ cards }),

  setSelectedCard: (selectedCard) => set({ selectedCard }),

  openSidebar: () => set({ isSidebarOpen: true }),

  closeSidebar: () => set({ isSidebarOpen: false, isFormOpen: false, selectedCard: null }),

  setIsSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  
  setIsFormOpen: (isFormOpen) => set({ isFormOpen, isSidebarOpen: isFormOpen ? true : false }),

  setFormData: (formData) => set({ formData }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  toggleFilter: (filterType, value) =>
    set((state) => {
      const currentFilter = state.filters[filterType];

      if (value === 'all') {
        return { filters: { ...state.filters, [filterType]: ['all'] } };
      }

      let newFilter: string[];
      if (currentFilter.includes(value)) {
        newFilter = currentFilter.filter((item) => item !== value);
      } else {
        newFilter = [...currentFilter.filter((item) => item !== 'all'), value];
      }

      if (newFilter.length === 0) newFilter = ['all'];

      return { filters: { ...state.filters, [filterType]: newFilter } };
    }),

  resetFilters: () =>
    set({
      filters: { module: ['all'], area: ['all'], role: ['all'] },
    }),

  toggleExportSelection: (id) => set((state) => ({
    selectedForExport: state.selectedForExport.includes(id)
      ? state.selectedForExport.filter(exportId => exportId !== id)
      : [...state.selectedForExport, id]
  })),

  clearExportSelection: () => set({ selectedForExport: [] }),
}));
