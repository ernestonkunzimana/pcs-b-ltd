import { Request, Response } from 'express';
import { InventoryService } from '../services/InventoryService';
import { AuthenticatedRequest } from '../types';
import { logger } from '../config/logger';

export class InventoryController {
  private inventoryService: InventoryService;

  constructor() {
    this.inventoryService = new InventoryService();
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

      const result = await this.inventoryService.findAll(organizationId, options);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      logger.error('Error in InventoryController.index:', error);
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

      const result = await this.inventoryService.findById(id, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in InventoryController.show:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async store(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const organizationId = req.user.organizationId;
      const inventoryData = { ...req.body, organizationId };

      const result = await this.inventoryService.create(inventoryData);
      
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      logger.error('Error in InventoryController.store:', error);
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
      const inventoryData = req.body;

      const result = await this.inventoryService.update(id, inventoryData, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in InventoryController.update:', error);
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

      const result = await this.inventoryService.delete(id, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in InventoryController.destroy:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async getLowStock(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const organizationId = req.user.organizationId;

      const result = await this.inventoryService.getLowStockItems(organizationId);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      logger.error('Error in InventoryController.getLowStock:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}