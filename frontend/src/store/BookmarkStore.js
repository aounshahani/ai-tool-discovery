import { create } from "zustand";

const BookmarkStore = create((set) => ({
  bookmarks: [],
  loading: false,
  error: null,

  setBookmarks: (bookmarks) => set({ bookmarks }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default BookmarkStore;
