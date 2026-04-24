import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    analytics: null,
    loading: false,
    error: null,
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setAnalytics: (state, action) => {
            state.analytics = action.payload;
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
        reset: (state) => {
            state.analytics = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setAnalytics,
    setLoading,
    setError,
    clearError,
    reset,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
