import { Request, Response } from 'express';
import { AuditLogService } from '../services/AuditLogService';
import { AuthenticatedRequest } from '../types';
import { logger } from '../config/logger';

export class AuditLogController {
  private auditLogService: AuditLogService;

  constructor() {
    this.auditLogService = new AuditLogService();
  }

  async index(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const organizationId = req.user.organizationId;
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC',
      };

      const result = await this.auditLogService.findAll(organizationId, options);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      logger.error('Error in AuditLogController.index:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async show(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const organizationId = req.user.organizationId;

      const result = await this.auditLogService.findById(id, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in AuditLogController.show:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async getByTable(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { tableName } = req.params;
      const organizationId = req.user.organizationId;
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC',
      };

      const result = await this.auditLogService.findByTable(tableName, organizationId, options);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      logger.error('Error in AuditLogController.getByTable:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async getByUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const organizationId = req.user.organizationId;
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC',
      };

      const result = await this.auditLogService.findByUser(userId, organizationId, options);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      logger.error('Error in AuditLogController.getByUser:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}