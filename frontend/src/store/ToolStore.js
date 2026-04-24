// src/store/useToolStore.js

import { create } from 'zustand';

const ToolStore = create((set) => ({
  tools: [],
  categories: [],
  selectedCategory: 'All',
  loading: false,
  error: null,

  setTools: (tools) => set({ tools }),
  setCategories: (categories) => set({ categories }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default ToolStore;