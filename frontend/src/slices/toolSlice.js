import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tools: [],
    categories: [],
    selectedCategory: 'All',
    loading: false,
    error: null,
};

const toolSlice = createSlice({
    name: 'tool',
    initialState,
    reducers: {
        setTools: (state, action) => {
            state.tools = action.payload;
        },
        addTool: (state, action) => {
            state.tools.push(action.payload);
        },
        updateTool: (state, action) => {
            const index = state.tools.findIndex(tool => tool._id === action.payload._id);
            if (index !== -1) {
                state.tools[index] = action.payload;
            }
        },
        removeTool: (state, action) => {
            state.tools = state.tools.filter(tool => tool._id !== action.payload);
        },
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
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
    setTools,
    addTool,
    updateTool,
    removeTool,
    setCategories,
    setSelectedCategory,
    setLoading,
    setError,
    clearError,
} = toolSlice.actions;

export default toolSlice.reducer;
