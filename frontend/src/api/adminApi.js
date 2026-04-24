import axios from 'axios';

const API_URL = 'http://localhost:5000/admin';

// Get auth token from localStorage
const getAuthToken = () => {
    const authState = localStorage.getItem('persist:auth'); // Redux persist uses 'persist:' prefix
    if (authState) {
        const parsed = JSON.parse(authState);
        // Redux persist stringifies each slice separately
        const token = parsed.token ? JSON.parse(parsed.token) : null;
        return token;
    }
    return null;
};

// Create axios instance with auth header
const createAuthAxios = () => {
    const token = getAuthToken();
    return axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// =============== TOOL MODERATION ===============
export const getAllTools = async (params) => {
    const api = createAuthAxios();
    const response = await api.get('/tools', { params });
    return response.data;
};

export const getPendingTools = async () => {
    const api = createAuthAxios();
    const response = await api.get('/tools/pending');
    return response.data;
};

export const approveTool = async (toolId) => {
    const api = createAuthAxios();
    const response = await api.put(`/tools/${toolId}/approve`);
    return response.data;
};

export const rejectTool = async (toolId, reason) => {
    const api = createAuthAxios();
    const response = await api.put(`/tools/${toolId}/reject`, { reason });
    return response.data;
};

export const updateTool = async (toolId, data) => {
    const api = createAuthAxios();
    const response = await api.put(`/tools/${toolId}`, data);
    return response.data;
};

export const deleteTool = async (toolId) => {
    const api = createAuthAxios();
    const response = await api.delete(`/tools/${toolId}`);
    return response.data;
};

// =============== USER MANAGEMENT ===============
export const getAllUsers = async (params) => {
    const api = createAuthAxios();
    const response = await api.get('/users', { params });
    return response.data;
};

export const banUser = async (userId, reason) => {
    const api = createAuthAxios();
    const response = await api.put(`/users/${userId}/ban`, { reason });
    return response.data;
};

export const unbanUser = async (userId) => {
    const api = createAuthAxios();
    const response = await api.put(`/users/${userId}/unban`);
    return response.data;
};

export const verifyCreator = async (userId) => {
    const api = createAuthAxios();
    const response = await api.put(`/users/${userId}/verify`);
    return response.data;
};

export const unverifyCreator = async (userId) => {
    const api = createAuthAxios();
    const response = await api.put(`/users/${userId}/unverify`);
    return response.data;
};

export const getFlaggedContent = async () => {
    const api = createAuthAxios();
    const response = await api.get('/flagged-content');
    return response.data;
};

// =============== CATEGORY MANAGEMENT ===============
export const getAllCategories = async () => {
    const api = createAuthAxios();
    const response = await api.get('/categories');
    return response.data;
};

export const createCategory = async (data) => {
    const api = createAuthAxios();
    const response = await api.post('/categories', data);
    return response.data;
};

export const updateCategory = async (categoryId, data) => {
    const api = createAuthAxios();
    const response = await api.put(`/categories/${categoryId}`, data);
    return response.data;
};

export const deleteCategory = async (categoryId) => {
    const api = createAuthAxios();
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
};

// =============== ANALYTICS ===============
export const getPlatformStats = async () => {
    const api = createAuthAxios();
    const response = await api.get('/analytics/platform-stats');
    return response.data;
};

export const getToolPopularity = async (params) => {
    const api = createAuthAxios();
    const response = await api.get('/analytics/tool-popularity', { params });
    return response.data;
};

export const getSignupsOverTime = async (params) => {
    const api = createAuthAxios();
    const response = await api.get('/analytics/signups', { params });
    return response.data;
};

export const getBounceRate = async (params) => {
    const api = createAuthAxios();
    const response = await api.get('/analytics/bounce-rate', { params });
    return response.data;
};

export const getTopSearches = async (params) => {
    const api = createAuthAxios();
    const response = await api.get('/analytics/top-searches', { params });
    return response.data;
};

export const getTrafficStats = async (params) => {
    const api = createAuthAxios();
    const response = await api.get('/analytics/traffic', { params });
    return response.data;
};

export const getReviewStats = async (params) => {
    const api = createAuthAxios();
    const response = await api.get('/analytics/reviews', { params });
    return response.data;
};

// =============== MONETIZATION ===============
export const getFeaturedTools = async () => {
    const api = createAuthAxios();
    const response = await api.get('/monetization/featured');
    return response.data;
};

export const setFeaturedTool = async (toolId, featuredUntil) => {
    const api = createAuthAxios();
    const response = await api.put(`/monetization/featured/${toolId}`, { featuredUntil });
    return response.data;
};

export const removeFeaturedTool = async (toolId) => {
    const api = createAuthAxios();
    const response = await api.delete(`/monetization/featured/${toolId}`);
    return response.data;
};

export const updateAffiliateLink = async (toolId, affiliateLink) => {
    const api = createAuthAxios();
    const response = await api.put(`/monetization/affiliate/${toolId}`, { affiliateLink });
    return response.data;
};

export const getSponsoredTools = async () => {
    const api = createAuthAxios();
    const response = await api.get('/monetization/sponsored');
    return response.data;
};

export const setSponsoredTool = async (toolId, sponsoredBy) => {
    const api = createAuthAxios();
    const response = await api.put(`/monetization/sponsored/${toolId}`, { sponsoredBy });
    return response.data;
};

export const removeSponsoredTool = async (toolId) => {
    const api = createAuthAxios();
    const response = await api.delete(`/monetization/sponsored/${toolId}`);
    return response.data;
};

// =============== REVIEW MANAGEMENT ===============
export const getAllReviews = async (params) => {
    const api = createAuthAxios();
    const response = await api.get('/reviews', { params });
    return response.data;
};

export const updateReviewStatus = async (reviewId, status) => {
    const api = createAuthAxios();
    const response = await api.put(`/reviews/${reviewId}/status`, { status });
    return response.data;
};

export const getReportedReviews = async (params) => {
    const api = createAuthAxios();
    const response = await api.get('/reviews/reported', { params });
    return response.data;
};

export const bulkDeleteReviews = async (reviewIds) => {
    const api = createAuthAxios();
    const response = await api.delete('/reviews/bulk', { data: { reviewIds } });
    return response.data;
};
