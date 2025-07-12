import { Request, Response } from 'express';
import { ESGMetricService } from '../services/ESGMetricService';
import { AuthenticatedRequest } from '../types';
import { logger } from '../config/logger';

export class ESGMetricController {
  private esgMetricService: ESGMetricService;

  constructor() {
    this.esgMetricService = new ESGMetricService();
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

      const result = await this.esgMetricService.findAll(organizationId, options);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      logger.error('Error in ESGMetricController.index:', error);
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

      const result = await this.esgMetricService.findById(id, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in ESGMetricController.show:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async store(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const organizationId = req.user.organizationId;
      const esgMetricData = { ...req.body, organizationId };

      const result = await this.esgMetricService.create(esgMetricData, userId);
      
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      logger.error('Error in ESGMetricController.store:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const organizationId = req.user.organizationId;
      const esgMetricData = req.body;

      const result = await this.esgMetricService.update(id, esgMetricData, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in ESGMetricController.update:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async destroy(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const organizationId = req.user.organizationId;

      const result = await this.esgMetricService.delete(id, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in ESGMetricController.destroy:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async getByType(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const organizationId = req.user.organizationId;
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC',
      };

      const result = await this.esgMetricService.findByType(type, organizationId, options);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      logger.error('Error in ESGMetricController.getByType:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async getByProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const organizationId = req.user.organizationId;

      const result = await this.esgMetricService.findByProject(projectId, organizationId);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      logger.error('Error in ESGMetricController.getByProject:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}