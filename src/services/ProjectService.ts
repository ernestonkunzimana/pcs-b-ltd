import { Repository } from 'typeorm';
import { Project } from '../models/Project';
import { AppDataSource } from '../config/database';
import { ApiResponse, PaginationOptions } from '../types';
import { logger } from '../config/logger';

export class ProjectService {
  private projectRepository: Repository<Project>;

  constructor() {
    this.projectRepository = AppDataSource.getRepository(Project);
  }

  async findAll(organizationId: string, options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.projectRepository.createQueryBuilder('project')
        .leftJoinAndSelect('project.client', 'client')
        .leftJoinAndSelect('project.projectManager', 'projectManager')
        .leftJoinAndSelect('project.tasks', 'tasks')
        .where('project.organizationId = :organizationId', { organizationId })
        .orderBy('project.createdAt', 'DESC')
        .skip(skip)
        .take(limit);

      const [projects, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'Projects retrieved successfully',
        data: projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching projects:', error);
      return {
        success: false,
        message: 'Failed to fetch projects',
        error: error.message,
      };
    }
  }

  async findById(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id, organizationId },
        relations: ['client', 'projectManager', 'tasks', 'tasks.assignee'],
      });

      if (!project) {
        return {
          success: false,
          message: 'Project not found',
        };
      }

      return {
        success: true,
        message: 'Project retrieved successfully',
        data: project,
      };
    } catch (error) {
      logger.error('Error fetching project:', error);
      return {
        success: false,
        message: 'Failed to fetch project',
        error: error.message,
      };
    }
  }

  async create(projectData: Partial<Project>, userId: string): Promise<ApiResponse> {
    try {
      const project = this.projectRepository.create({
        ...projectData,
        createdBy: userId,
      });

      const savedProject = await this.projectRepository.save(project);

      return {
        success: true,
        message: 'Project created successfully',
        data: savedProject,
      };
    } catch (error) {
      logger.error('Error creating project:', error);
      return {
        success: false,
        message: 'Failed to create project',
        error: error.message,
      };
    }
  }

  async update(id: string, projectData: Partial<Project>, organizationId: string): Promise<ApiResponse> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id, organizationId },
      });

      if (!project) {
        return {
          success: false,
          message: 'Project not found',
        };
      }

      await this.projectRepository.update(id, projectData);

      const updatedProject = await this.projectRepository.findOne({
        where: { id },
        relations: ['client', 'projectManager', 'tasks'],
      });

      return {
        success: true,
        message: 'Project updated successfully',
        data: updatedProject,
      };
    } catch (error) {
      logger.error('Error updating project:', error);
      return {
        success: false,
        message: 'Failed to update project',
        error: error.message,
      };
    }
  }

  async delete(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id, organizationId },
      });

      if (!project) {
        return {
          success: false,
          message: 'Project not found',
        };
      }

      await this.projectRepository.delete(id);

      return {
        success: true,
        message: 'Project deleted successfully',
      };
    } catch (error) {
      logger.error('Error deleting project:', error);
      return {
        success: false,
        message: 'Failed to delete project',
        error: error.message,
      };
    }
  }
}