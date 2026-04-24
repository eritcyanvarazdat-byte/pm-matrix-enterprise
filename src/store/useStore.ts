import { create } from 'zustand';
import type { ProjectCard, Phase, Area, Module, Role } from '../types';

export interface Filters {
  module: string[];
  area: string[];
  role: string[];
}

export interface StoreState {
  // Данные БД
  phases: Phase[];
  areas: Area[];
  modules: Module[];
  roles: Role[];
  cards: ProjectCard[];

  // UI стейт
  isAuthenticated: boolean;
  selectedCard: ProjectCard | null;
  isSidebarOpen: boolean;
  searchQuery: string;

  // Фильтры
  filters: Filters;

  // Экшены
  setAuth: (isAuthenticated: boolean) => void;
  setDirectories: (phases: Phase[], areas: Area[], modules: Module[], roles: Role[]) => void;
  setCards: (cards: ProjectCard[]) => void;
  setSelectedCard: (card: ProjectCard | null) => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  setSearchQuery: (query: string) => void;
  toggleFilter: (filterType: keyof Filters, value: string) => void;
  resetFilters: () => void;
}

export const useStore = create<StoreState>((set) => ({
  // Дефолтные значения
  phases: [],
  areas: [],
  modules: [],
  roles: [],
  cards: [],

  isAuthenticated: false,
  selectedCard: null,
  isSidebarOpen: false,
  searchQuery: "",

  filters: {
    module: ['all'],
    area: ['all'],
    role: ['all'],
  },

  // Логика экшенов
  setAuth: (isAuthenticated) => set({ isAuthenticated }),

  setDirectories: (phases, areas, modules, roles) =>
    set({ phases, areas, modules, roles }),

  setCards: (cards) => set({ cards }),

  setSelectedCard: (selectedCard) => set({ selectedCard }),

  openSidebar: () => set({ isSidebarOpen: true }),

  closeSidebar: () => set({ isSidebarOpen: false }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  toggleFilter: (filterType, value) =>
    set((state) => {
      const currentFilter = state.filters[filterType];

      // Если передано значение 'all', массив фильтра сбрасывается в ['all']
      if (value === 'all') {
        return {
          filters: {
            ...state.filters,
            [filterType]: ['all'],
          },
        };
      }

      let newFilter: string[];

      if (currentFilter.includes(value)) {
        // Если передано конкретное ID (и оно уже есть в массиве) — удаляем его
        newFilter = currentFilter.filter((item) => item !== value);
      } else {
        // Если ID нет — добавляем его, при этом обязательно удаляя 'all'
        newFilter = [...currentFilter.filter((item) => item !== 'all'), value];
      }

      // Если после удаления элемента массив стал пустым — автоматически возвращаем ['all']
      if (newFilter.length === 0) {
        newFilter = ['all'];
      }

      return {
        filters: {
          ...state.filters,
          [filterType]: newFilter,
        },
      };
    }),

  resetFilters: () =>
    set({
      filters: {
        module: ['all'],
        area: ['all'],
        role: ['all'],
      },
    }),
}));
