'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import apiClient, { User, LoginRequest, RegisterRequest } from '@/lib/api';
import { 
  getStoredUser, 
  setStoredUser, 
  getStoredTokens, 
  setStoredTokens, 
  clearStoredAuth, 
  AuthState 
} from '@/lib/auth';
import { socketManager } from '@/lib/socket';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const router = useRouter();

  useEffect(() => {
    // Initialize auth state from localStorage
    const initializeAuth = async () => {
      try {
        const storedUser = getStoredUser();
        const { accessToken } = getStoredTokens();

        if (storedUser && accessToken) {
          setAuthState({
            user: storedUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Verify token is still valid
          try {
            const response = await apiClient.getCurrentUser();
            if (response.success) {
              setStoredUser(response.data);
              setAuthState(prev => ({
                ...prev,
                user: response.data,
              }));
            }
          } catch (error) {
            // Token might be expired, try to refresh
            await refreshAuth();
          }
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to initialize authentication',
        }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await apiClient.login(credentials);

      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;

        setStoredUser(user);
        setStoredTokens(accessToken, refreshToken);

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Connect to socket
        socketManager.connect();

        toast.success('Login successful!');
        
        // Redirect based on role
        const redirectPath = getRoleRedirectPath(user.role);
        router.push(redirectPath);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await apiClient.register(userData);

      if (response.success) {
        const { user, accessToken, refreshToken } = response.data;

        setStoredUser(user);
        setStoredTokens(accessToken, refreshToken);

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Connect to socket
        socketManager.connect();

        toast.success('Registration successful!');
        
        // Redirect based on role
        const redirectPath = getRoleRedirectPath(user.role);
        router.push(redirectPath);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = (): void => {
    clearStoredAuth();
    socketManager.disconnect();
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      const response = await apiClient.updateProfile(userData);

      if (response.success) {
        const updatedUser = response.data;
        setStoredUser(updatedUser);
        
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
        }));

        toast.success('Profile updated successfully');
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const { refreshToken } = getStoredTokens();
      
      if (!refreshToken) {
        logout();
        return;
      }

      const response = await apiClient.refreshToken(refreshToken);

      if (response.success) {
        const { accessToken } = response.data;
        setStoredTokens(accessToken, refreshToken);

        // Get updated user info
        const userResponse = await apiClient.getCurrentUser();
        if (userResponse.success) {
          setStoredUser(userResponse.data);
          setAuthState(prev => ({
            ...prev,
            user: userResponse.data,
            isAuthenticated: true,
            isLoading: false,
          }));
        }
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const getRoleRedirectPath = (role: string): string => {
    const redirectPaths: Record<string, string> = {
      admin: '/dashboard/admin',
      manager: '/dashboard/manager',
      worker: '/dashboard/worker',
      client: '/dashboard/client',
    };

    return redirectPaths[role] || '/dashboard';
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;

export { AuthContext };