import { create } from "zustand";

const AnalyticsStore = create((set) => ({
  analytics: [], // list of analytics events
  loading: false,
  error: null,

  setAnalytics: (analytics) => set({ analytics }),
  addEvent: (event) =>
    set((state) => ({ analytics: [...state.analytics, event] })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default AnalyticsStore;
