'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { socketManager, NotificationData, ActivityData } from '@/lib/socket';
import { useAuth } from './AuthContext';

interface SocketContextType {
  isConnected: boolean;
  notifications: NotificationData[];
  activities: ActivityData[];
  onlineUsers: string[];
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
  sendMessage: (projectId: string, message: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Set up socket event listeners
      const handleConnect = () => {
        setIsConnected(true);
        toast.success('Connected to real-time updates');
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        toast.error('Disconnected from real-time updates');
      };

      const handleNotification = (notification: NotificationData) => {
        setNotifications(prev => [notification, ...prev]);
        
        // Show toast notification
        const toastOptions = {
          duration: 5000,
          position: 'top-right' as const,
        };

        switch (notification.type) {
          case 'success':
            toast.success(notification.message, toastOptions);
            break;
          case 'warning':
            toast.error(notification.message, toastOptions);
            break;
          case 'error':
            toast.error(notification.message, toastOptions);
            break;
          default:
            toast(notification.message, toastOptions);
        }

        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
          });
        }
      };

      const handleActivity = (activity: ActivityData) => {
        setActivities(prev => [activity, ...prev.slice(0, 49)]); // Keep only last 50
      };

      const handleProjectUpdate = (project: any) => {
        toast.success(`Project "${project.name}" has been updated`);
      };

      const handleInventoryUpdate = (item: any) => {
        toast.success(`Inventory item "${item.name}" has been updated`);
      };

      const handleUserOnline = (userData: any) => {
        setOnlineUsers(prev => [...new Set([...prev, userData.id])]);
      };

      const handleUserOffline = (userData: any) => {
        setOnlineUsers(prev => prev.filter(id => id !== userData.id));
      };

      // Connect socket if not already connected
      if (!socketManager.isSocketConnected()) {
        socketManager.connect();
      }

      // Set up event listeners
      socketManager.onNotification(handleNotification);
      socketManager.onActivity(handleActivity);
      socketManager.onProjectUpdate(handleProjectUpdate);
      socketManager.onInventoryUpdate(handleInventoryUpdate);
      socketManager.onUserOnline(handleUserOnline);
      socketManager.onUserOffline(handleUserOffline);

      // Clean up event listeners on unmount
      return () => {
        socketManager.offNotification();
        socketManager.offActivity();
        socketManager.offProjectUpdate();
        socketManager.offInventoryUpdate();
        socketManager.offUserOnline();
        socketManager.offUserOffline();
      };
    } else {
      // Disconnect socket if not authenticated
      socketManager.disconnect();
      setIsConnected(false);
      setNotifications([]);
      setActivities([]);
      setOnlineUsers([]);
    }
  }, [isAuthenticated, user]);

  // Request notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  const joinProject = (projectId: string): void => {
    socketManager.joinProject(projectId);
  };

  const leaveProject = (projectId: string): void => {
    socketManager.leaveProject(projectId);
  };

  const sendMessage = (projectId: string, message: string): void => {
    socketManager.sendMessage(projectId, message);
  };

  const markNotificationAsRead = (notificationId: string): void => {
    socketManager.markNotificationAsRead(notificationId);
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearNotifications = (): void => {
    setNotifications([]);
  };

  const value: SocketContextType = {
    isConnected,
    notifications,
    activities,
    onlineUsers,
    joinProject,
    leaveProject,
    sendMessage,
    markNotificationAsRead,
    clearNotifications,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;

export { SocketContext }