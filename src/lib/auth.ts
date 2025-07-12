import { User } from './api';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

export const setStoredUser = (user: User | null): void => {
  if (typeof window === 'undefined') return;
  
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const getStoredTokens = (): { accessToken: string | null; refreshToken: string | null } => {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };
  
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  };
};

export const setStoredTokens = (accessToken: string | null, refreshToken: string | null): void => {
  if (typeof window === 'undefined') return;
  
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }
  
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  } else {
    localStorage.removeItem('refreshToken');
  }
};

export const clearStoredAuth = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  // Admin has all permissions
  if (user.role === 'admin') return true;
  
  // Check if user has specific permission
  return user.permissions.includes(permission);
};

export const canAccessRoute = (user: User | null, route: string): boolean => {
  if (!user) return false;
  
  // Define role-based route access
  const routePermissions: Record<string, string[]> = {
    '/dashboard/admin': ['admin'],
    '/dashboard/manager': ['admin', 'manager'],
    '/dashboard/worker': ['admin', 'manager', 'worker'],
    '/dashboard/client': ['admin', 'manager', 'client'],
    '/projects': ['admin', 'manager'],
    '/inventory': ['admin', 'manager', 'worker'],
    '/transactions': ['admin', 'manager'],
    '/esg-metrics': ['admin', 'manager'],
    '/users': ['admin'],
    '/settings': ['admin', 'manager'],
  };
  
  const allowedRoles = routePermissions[route];
  if (!allowedRoles) return true; // Allow access if no restrictions defined
  
  return allowedRoles.includes(user.role);
};

export const getRoleColor = (role: string): string => {
  const colors: Record<string, string> = {
    admin: 'bg-red-500',
    manager: 'bg-blue-500',
    worker: 'bg-green-500',
    client: 'bg-purple-500',
  };
  
  return colors[role] || 'bg-gray-500';
};

export const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    worker: 'Worker',
    client: 'Client',
  };
  
  return labels[role] || role;
};