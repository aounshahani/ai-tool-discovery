import axiosInstance from '../api/axios';
import { store } from '../store/store';
import {
    uploadStart,
    setUploadProgress,
    uploadSuccess,
    uploadFailure,
    setAssets,
    setLoading,
    setError,
    clearError,
} from '../slices/assetSlice';

// Upload image to Cloudinary and save to database
export const uploadImage = async (file, assetType = 'tool_logo', tags = []) => {
    console.log('🔵 uploadImage called with:', {
        fileName: file.name,
        fileSize: file.size,
        assetType,
        tags
    });

    store.dispatch(uploadStart());

    try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('assetType', assetType);

        // Add tags
        if (tags.length > 0) {
            tags.forEach(tag => formData.append('tags', tag));
        }

        console.log('📋 FormData created, making API call to /assets/upload');
        console.log('🔐 User will be extracted from JWT token by backend');

        // Upload to backend
        const response = await axiosInstance.post('/assets/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log(`⏳ Upload progress: ${progress}%`);
                store.dispatch(setUploadProgress(progress));
            },
        });

        console.log('✅ API Response:', response.data);

        if (response.data.success) {
            store.dispatch(uploadSuccess(response.data.data));
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Upload failed');
        }
    } catch (error) {
        console.error('❌ uploadImage error:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);

        const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image';
        store.dispatch(uploadFailure(errorMessage));
        throw error;
    }
};

// Get user assets
export const getUserAssets = async (userId, assetType = null) => {
    store.dispatch(setLoading(true));
    store.dispatch(clearError());

    try {
        const url = assetType
            ? `/assets/user/${userId}?assetType=${assetType}`
            : `/assets/user/${userId}`;

        const response = await axiosInstance.get(url);

        if (response.data.success) {
            store.dispatch(setAssets(response.data.data));
            store.dispatch(setLoading(false));
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch assets');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch assets';
        store.dispatch(setError(errorMessage));
        store.dispatch(setLoading(false));
        throw error;
    }
};

// Delete asset
export const deleteAsset = async (assetId) => {
    store.dispatch(setLoading(true));
    store.dispatch(clearError());

    try {
        const response = await axiosInstance.delete(`/assets/${assetId}`);

        if (response.data.success) {
            // The component will handle removing from the array
            store.dispatch(setLoading(false));
            return true;
        } else {
            throw new Error(response.data.message || 'Failed to delete asset');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete asset';
        store.dispatch(setError(errorMessage));
        store.dispatch(setLoading(false));
        throw error;
    }
};
