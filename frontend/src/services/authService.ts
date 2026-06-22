import api from './api';
import type { LoginRequest, LoginResponse, RefreshTokenRequest, User } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const request: RefreshTokenRequest = { refreshToken };
    const response = await api.post<LoginResponse>('/api/auth/refresh', request);
    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await api.post('/api/auth/logout', { refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  storeAuthData(data: LoginResponse): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  },
};
