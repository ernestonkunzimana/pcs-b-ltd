import { Request, Response } from 'express';
import { SystemLogService } from '../services/SystemLogService';
import { AuthenticatedRequest } from '../types';
import { logger } from '../config/logger';

export class SystemLogController {
  private systemLogService: SystemLogService;

  constructor() {
    this.systemLogService = new SystemLogService();
  }

  async index(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC',
      };

      const result = await this.systemLogService.findAll(options);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      logger.error('Error in SystemLogController.index:', error);
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

      const result = await this.systemLogService.findById(id);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in SystemLogController.show:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async getByLevel(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { level } = req.params;
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC',
      };

      const result = await this.systemLogService.findByLevel(level, options);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      logger.error('Error in SystemLogController.getByLevel:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async getByModule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { module } = req.params;
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC',
      };

      const result = await this.systemLogService.findByModule(module, options);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      logger.error('Error in SystemLogController.getByModule:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}