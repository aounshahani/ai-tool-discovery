import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '../slices/authSlice';
import toolReducer from '../slices/toolSlice';
import bookmarkReducer from '../slices/bookmarkSlice';
import analyticsReducer from '../slices/analyticsSlice';
import assetReducer from '../slices/assetSlice';

// Persist config for auth (to keep user logged in)
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user', 'token', 'refreshToken', 'isAuthenticated'], // only persist these fields
};

// Combine reducers
const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    tool: toolReducer,
    bookmark: bookmarkReducer,
    analytics: analyticsReducer,
    asset: assetReducer,
});

// Create store
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
