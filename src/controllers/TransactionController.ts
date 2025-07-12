import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';
import { AuthenticatedRequest } from '../types';
import { logger } from '../config/logger';

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
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

      const result = await this.transactionService.findAll(organizationId, options);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      logger.error('Error in TransactionController.index:', error);
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

      const result = await this.transactionService.findById(id, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in TransactionController.show:', error);
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
      const { entries, ...transactionData } = req.body;

      const result = await this.transactionService.create(
        { ...transactionData, organizationId },
        entries,
        userId
      );
      
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      logger.error('Error in TransactionController.store:', error);
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
      const { entries, ...transactionData } = req.body;

      const result = await this.transactionService.update(id, transactionData, entries, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in TransactionController.update:', error);
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

      const result = await this.transactionService.delete(id, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in TransactionController.destroy:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}