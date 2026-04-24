import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    assets: [],
    uploadedAsset: null,
    loading: false,
    uploading: false,
    uploadProgress: 0,
    error: null,
};

const assetSlice = createSlice({
    name: 'asset',
    initialState,
    reducers: {
        uploadStart: (state) => {
            state.uploading = true;
            state.uploadProgress = 0;
            state.error = null;
        },
        uploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
        uploadSuccess: (state, action) => {
            state.uploading = false;
            state.uploadProgress = 100;
            state.uploadedAsset = action.payload;
            state.error = null;
        },
        uploadFailure: (state, action) => {
            state.uploading = false;
            state.uploadProgress = 0;
            state.error = action.payload;
        },
        setAssets: (state, action) => {
            state.assets = action.payload;
        },
        addAsset: (state, action) => {
            state.assets.push(action.payload);
        },
        removeAsset: (state, action) => {
            state.assets = state.assets.filter(asset => asset._id !== action.payload);
        },
        clearUploadedAsset: (state) => {
            state.uploadedAsset = null;
            state.uploadProgress = 0;
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
            return initialState;
        },
    },
});

export const {
    uploadStart,
    uploadProgress: setUploadProgress,
    uploadSuccess,
    uploadFailure,
    setAssets,
    addAsset,
    removeAsset,
    clearUploadedAsset,
    setLoading,
    setError,
    clearError,
    reset,
} = assetSlice.actions;

export default assetSlice.reducer;
