import api from './api';
import { RegisterData } from '../types/User';

export const registerUser = (userData: RegisterData) => api.post('/auth/register', userData);

export const verifyUserEmail = (email: string, code: string) => api.post('/auth/verify-email', { email, code });

export const loginUser = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const loadUserProfile = () => api.get('/auth/me');