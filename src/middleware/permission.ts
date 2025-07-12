import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../types';
import { logger } from '../config/logger';

export const checkPermission = (resource: string, action: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: req.user.id },
        relations: ['roles', 'roles.permissions'],
      });

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      // Check if user has admin role (bypass permission check)
      const hasAdminRole = user.roles.some(role => role.name === 'admin');
      if (hasAdminRole) {
        next();
        return;
      }

      // Check if user has required permission
      const hasPermission = user.roles.some(role =>
        role.permissions.some(permission =>
          permission.resource === resource && permission.action === action
        )
      );

      if (!hasPermission) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};

export const requireRole = (roleName: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const hasRole = req.user.roles.includes(roleName);
      if (!hasRole) {
        res.status(403).json({
          success: false,
          message: 'Insufficient role privileges',
        });
        return;
      }

      next();
    } catch (error) {
      logger.error('Role check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};