import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    bookmarks: [],
    loading: false,
    error: null,
};

const bookmarkSlice = createSlice({
    name: 'bookmark',
    initialState,
    reducers: {
        setBookmarks: (state, action) => {
            state.bookmarks = action.payload;
        },
        addBookmark: (state, action) => {
            state.bookmarks.push(action.payload);
        },
        removeBookmark: (state, action) => {
            state.bookmarks = state.bookmarks.filter(bookmark => bookmark._id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setBookmarks,
    addBookmark,
    removeBookmark,
    setLoading,
    setError,
    clearError,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
