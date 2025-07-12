import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { AuditLog } from '../models/AuditLog';
import { AuthenticatedRequest } from '../types';
import { logger } from '../config/logger';

export const auditLog = (tableName: string, action: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const originalSend = res.send;
      let responseData: any;

      // Capture response data
      res.send = function(data: any) {
        responseData = data;
        return originalSend.call(this, data);
      };

      // Store original request body for audit
      const originalBody = { ...req.body };

      res.on('finish', async () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const auditLogRepository = AppDataSource.getRepository(AuditLog);
            
            const auditLog = auditLogRepository.create({
              organizationId: req.user?.organizationId,
              userId: req.user?.id,
              action,
              tableName,
              recordId: req.params.id || null,
              oldValues: action === 'update' ? null : null, // Would need to fetch old values in real implementation
              newValues: action !== 'delete' ? originalBody : null,
              ipAddress: req.ip,
              userAgent: req.get('User-Agent'),
            });

            await auditLogRepository.save(auditLog);
          }
        } catch (error) {
          logger.error('Audit log error:', error);
        }
      });

      next();
    } catch (error) {
      logger.error('Audit middleware error:', error);
      next();
    }
  };
};