// src/hooks/useAuth.js

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../api/axios';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from '../slices/authSlice';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    dispatch(loginStart());

    try {
      console.log('🔑 Authenticating user...', credentials.email);
      const response = await axios.post('/auth/login', credentials);

      console.log('📦 Full response.data:', response.data);

      const { token, refreshToken, user } = response.data;

      console.log('✅ Extracted:', {
        hasToken: !!token,
        hasRefreshToken: !!refreshToken,
        hasUser: !!user,
        userId: user?._id,
        userName: user?.name,
        userEmail: user?.email,
        userRole: user?.role
      });

      dispatch(loginSuccess({ token, refreshToken, user }));
      setLoading(false);
      return { success: true, user }; // Return user data for redirect logic
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      console.error('❌ Login failed:', errorMessage);
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
      setLoading(false);
      return { success: false };
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    dispatch(loginStart());

    try {
      console.log('📝 Registering user...', userData.email);
      const response = await axios.post('/auth/register', userData);
      const { token, refreshToken, user } = response.data;

      console.log('✅ Registration response:', { token: !!token, refreshToken: !!refreshToken, user });

      dispatch(loginSuccess({ token, refreshToken, user }));
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      console.error('❌ Registration failed:', errorMessage);
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
      setLoading(false);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed on server:', err);
    } finally {
      dispatch(logoutAction());
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};

export default Auth;