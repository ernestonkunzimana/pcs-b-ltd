import { io, Socket } from 'socket.io-client';
import { getStoredTokens } from './auth';

export interface SocketResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  userId: string;
  projectId?: string;
  createdAt: string;
  read: boolean;
}

export interface ActivityData {
  id: string;
  type: 'project_created' | 'project_updated' | 'transaction_created' | 'inventory_updated' | 'user_joined';
  description: string;
  userId: string;
  projectId?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

class SocketManager {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.connect();
  }

  connect(): void {
    if (this.socket?.connected) return;

    const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const { accessToken } = getStoredTokens();

    this.socket = io(socketURL, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
      this.handleReconnect();
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Handle auth errors
    this.socket.on('auth_error', (error) => {
      console.error('Socket auth error:', error);
      this.disconnect();
      // Redirect to login or refresh token
      window.location.href = '/auth/login';
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Event listeners
  onNotification(callback: (notification: NotificationData) => void): void {
    this.socket?.on('notification', callback);
  }

  onActivity(callback: (activity: ActivityData) => void): void {
    this.socket?.on('activity', callback);
  }

  onProjectUpdate(callback: (project: any) => void): void {
    this.socket?.on('project_updated', callback);
  }

  onInventoryUpdate(callback: (item: any) => void): void {
    this.socket?.on('inventory_updated', callback);
  }

  onUserOnline(callback: (user: any) => void): void {
    this.socket?.on('user_online', callback);
  }

  onUserOffline(callback: (user: any) => void): void {
    this.socket?.on('user_offline', callback);
  }

  // Event emitters
  joinProject(projectId: string): void {
    this.socket?.emit('join_project', projectId);
  }

  leaveProject(projectId: string): void {
    this.socket?.emit('leave_project', projectId);
  }

  sendMessage(projectId: string, message: string): void {
    this.socket?.emit('send_message', { projectId, message });
  }

  markNotificationAsRead(notificationId: string): void {
    this.socket?.emit('mark_notification_read', notificationId);
  }

  // Utility methods
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  getSocketId(): string | null {
    return this.socket?.id || null;
  }

  // Remove event listeners
  offNotification(): void {
    this.socket?.off('notification');
  }

  offActivity(): void {
    this.socket?.off('activity');
  }

  offProjectUpdate(): void {
    this.socket?.off('project_updated');
  }

  offInventoryUpdate(): void {
    this.socket?.off('inventory_updated');
  }

  offUserOnline(): void {
    this.socket?.off('user_online');
  }

  offUserOffline(): void {
    this.socket?.off('user_offline');
  }
}

// Create singleton instance
export const socketManager = new SocketManager();
export default socketManager;