import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { AuthenticatedRequest } from '../types';
import { logger } from '../config/logger';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
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

      const result = await this.taskService.findAll(organizationId, options);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      logger.error('Error in TaskController.index:', error);
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

      const result = await this.taskService.findById(id, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in TaskController.show:', error);
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
      const taskData = req.body;

      const result = await this.taskService.create(taskData, userId);
      
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      logger.error('Error in TaskController.store:', error);
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
      const userId = req.user.id;
      const organizationId = req.user.organizationId;
      const taskData = req.body;

      const result = await this.taskService.update(id, taskData, userId, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in TaskController.update:', error);
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

      const result = await this.taskService.delete(id, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in TaskController.destroy:', error);
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

      const result = await this.taskService.getTasksByProject(projectId, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in TaskController.getByProject:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async getByAssignee(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { assigneeId } = req.params;
      const organizationId = req.user.organizationId;

      const result = await this.taskService.getTasksByAssignee(assigneeId, organizationId);
      
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      logger.error('Error in TaskController.getByAssignee:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}