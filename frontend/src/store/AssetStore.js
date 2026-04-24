import { create } from 'zustand';
import axiosInstance from '../api/axios';

const AssetStore = create((set, get) => ({
    assets: [],
    uploadedAsset: null,
    loading: false,
    uploading: false,
    uploadProgress: 0,
    error: null,

    // Upload image to Cloudinary and save to database
    uploadImage: async (file, assetType = 'tool_logo', tags = []) => {
        console.log('🔵 AssetStore.uploadImage called with:', {
            fileName: file.name,
            fileSize: file.size,
            assetType,
            tags
        });

        set({ uploading: true, uploadProgress: 0, error: null });

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
            console.log('📦 FormData contents:', {
                file: file.name,
                assetType,
                tags
            });
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
                    set({ uploadProgress: progress });
                },
            });

            console.log('✅ API Response:', response.data);

            if (response.data.success) {
                set({
                    uploadedAsset: response.data.data,
                    uploading: false,
                    uploadProgress: 100,
                    error: null,
                });
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('❌ AssetStore.uploadImage error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);

            const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image';
            set({
                error: errorMessage,
                uploading: false,
                uploadProgress: 0,
            });
            throw error;
        }
    },

    // Save asset metadata (for pre-uploaded assets)
    saveAssetMetadata: async (metadata) => {
        set({ loading: true, error: null });

        try {
            const response = await axiosInstance.post('/assets/metadata', metadata);

            if (response.data.success) {
                set({
                    uploadedAsset: response.data.data,
                    loading: false,
                    error: null,
                });
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to save metadata');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save metadata';
            set({
                error: errorMessage,
                loading: false,
            });
            throw error;
        }
    },

    // Get user assets
    getUserAssets: async (userId, assetType = null) => {
        set({ loading: true, error: null });

        try {
            const url = assetType
                ? `/assets/user/${userId}?assetType=${assetType}`
                : `/assets/user/${userId}`;

            const response = await axiosInstance.get(url);

            if (response.data.success) {
                set({
                    assets: response.data.data,
                    loading: false,
                    error: null,
                });
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch assets');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch assets';
            set({
                error: errorMessage,
                loading: false,
            });
            throw error;
        }
    },

    // Delete asset
    deleteAsset: async (assetId) => {
        set({ loading: true, error: null });

        try {
            const response = await axiosInstance.delete(`/assets/${assetId}`);

            if (response.data.success) {
                // Remove from assets array
                set((state) => ({
                    assets: state.assets.filter(asset => asset._id !== assetId),
                    loading: false,
                    error: null,
                }));
                return true;
            } else {
                throw new Error(response.data.message || 'Failed to delete asset');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete asset';
            set({
                error: errorMessage,
                loading: false,
            });
            throw error;
        }
    },

    // Clear uploaded asset
    clearUploadedAsset: () => set({ uploadedAsset: null, uploadProgress: 0 }),

    // Clear error
    clearError: () => set({ error: null }),

    // Reset store
    reset: () => set({
        assets: [],
        uploadedAsset: null,
        loading: false,
        uploading: false,
        uploadProgress: 0,
        error: null,
    }),
}));

export default AssetStore;
