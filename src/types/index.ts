export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    roles: string[];
    organizationId: string;
  };
}

export interface SocketAuthenticatedSocket extends Socket {
  user: {
    id: string;
    email: string;
    roles: string[];
    organizationId: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
  organizationId: string;
  iat: number;
  exp: number;
}

export interface FileUploadOptions {
  destination: string;
  filename: string;
  maxSize: number;
  allowedTypes: string[];
}

export interface MobileMoneyTransactionRequest {
  phoneNumber: string;
  amount: number;
  currency: string;
  description?: string;
  reference?: string;
}

export interface ESGMetricData {
  metricType: 'environmental' | 'social' | 'governance';
  metricName: string;
  metricValue: number;
  unitOfMeasure: string;
  measurementDate: Date;
  projectId?: string;
  notes?: string;
}

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  referenceType?: string;
  referenceId?: string;
}

export interface RealtimeEventData {
  eventType: string;
  data: any;
  timestamp: Date;
  userId?: string;
  organizationId: string;
}