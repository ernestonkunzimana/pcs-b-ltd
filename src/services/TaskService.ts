import { Repository } from 'typeorm';
import { Task } from '../models/Task';
import { AppDataSource } from '../config/database';
import { ApiResponse, PaginationOptions } from '../types';
import { logger } from '../config/logger';
import { io } from '../app';

export class TaskService {
  private taskRepository: Repository<Task>;

  constructor() {
    this.taskRepository = AppDataSource.getRepository(Task);
  }

  async findAll(organizationId: string, options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.taskRepository.createQueryBuilder('task')
        .leftJoinAndSelect('task.project', 'project')
        .leftJoinAndSelect('task.assignee', 'assignee')
        .leftJoinAndSelect('task.assigner', 'assigner')
        .leftJoinAndSelect('task.parentTask', 'parentTask')
        .leftJoinAndSelect('task.subTasks', 'subTasks')
        .where('project.organizationId = :organizationId', { organizationId })
        .orderBy('task.createdAt', 'DESC')
        .skip(skip)
        .take(limit);

      const [tasks, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching tasks:', error);
      return {
        success: false,
        message: 'Failed to fetch tasks',
        error: error.message,
      };
    }
  }

  async findById(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['project', 'assignee', 'assigner', 'parentTask', 'subTasks'],
      });

      if (!task) {
        return {
          success: false,
          message: 'Task not found',
        };
      }

      // Check if task belongs to the organization
      if (task.project.organizationId !== organizationId) {
        return {
          success: false,
          message: 'Task not found',
        };
      }

      return {
        success: true,
        message: 'Task retrieved successfully',
        data: task,
      };
    } catch (error) {
      logger.error('Error fetching task:', error);
      return {
        success: false,
        message: 'Failed to fetch task',
        error: error.message,
      };
    }
  }

  async create(taskData: Partial<Task>, userId: string): Promise<ApiResponse> {
    try {
      const task = this.taskRepository.create({
        ...taskData,
        assignedBy: userId,
      });

      const savedTask = await this.taskRepository.save(task);

      // Emit real-time notification for task assignment
      if (savedTask.assignedTo) {
        io.to(`user_${savedTask.assignedTo}`).emit('taskAssigned', {
          taskId: savedTask.id,
          title: savedTask.title,
          assignedBy: userId,
          projectId: savedTask.projectId,
        });
      }

      return {
        success: true,
        message: 'Task created successfully',
        data: savedTask,
      };
    } catch (error) {
      logger.error('Error creating task:', error);
      return {
        success: false,
        message: 'Failed to create task',
        error: error.message,
      };
    }
  }

  async update(id: string, taskData: Partial<Task>, userId: string, organizationId: string): Promise<ApiResponse> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['project'],
      });

      if (!task) {
        return {
          success: false,
          message: 'Task not found',
        };
      }

      // Check if task belongs to the organization
      if (task.project.organizationId !== organizationId) {
        return {
          success: false,
          message: 'Task not found',
        };
      }

      const oldStatus = task.status;
      await this.taskRepository.update(id, taskData);

      const updatedTask = await this.taskRepository.findOne({
        where: { id },
        relations: ['project', 'assignee', 'assigner', 'parentTask', 'subTasks'],
      });

      // Emit real-time notification for task updates
      if (updatedTask.assignedTo && (oldStatus !== taskData.status || taskData.assignedTo)) {
        io.to(`user_${updatedTask.assignedTo}`).emit('taskUpdated', {
          taskId: updatedTask.id,
          title: updatedTask.title,
          status: updatedTask.status,
          updatedBy: userId,
          projectId: updatedTask.projectId,
        });
      }

      return {
        success: true,
        message: 'Task updated successfully',
        data: updatedTask,
      };
    } catch (error) {
      logger.error('Error updating task:', error);
      return {
        success: false,
        message: 'Failed to update task',
        error: error.message,
      };
    }
  }

  async delete(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['project'],
      });

      if (!task) {
        return {
          success: false,
          message: 'Task not found',
        };
      }

      // Check if task belongs to the organization
      if (task.project.organizationId !== organizationId) {
        return {
          success: false,
          message: 'Task not found',
        };
      }

      await this.taskRepository.delete(id);

      return {
        success: true,
        message: 'Task deleted successfully',
      };
    } catch (error) {
      logger.error('Error deleting task:', error);
      return {
        success: false,
        message: 'Failed to delete task',
        error: error.message,
      };
    }
  }

  async getTasksByProject(projectId: string, organizationId: string): Promise<ApiResponse> {
    try {
      const tasks = await this.taskRepository.find({
        where: { projectId },
        relations: ['project', 'assignee', 'assigner', 'parentTask', 'subTasks'],
      });

      // Verify project belongs to organization
      if (tasks.length > 0 && tasks[0].project.organizationId !== organizationId) {
        return {
          success: false,
          message: 'Project not found',
        };
      }

      return {
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks,
      };
    } catch (error) {
      logger.error('Error fetching tasks by project:', error);
      return {
        success: false,
        message: 'Failed to fetch tasks',
        error: error.message,
      };
    }
  }

  async getTasksByAssignee(assigneeId: string, organizationId: string): Promise<ApiResponse> {
    try {
      const tasks = await this.taskRepository.find({
        where: { assignedTo: assigneeId },
        relations: ['project', 'assignee', 'assigner', 'parentTask', 'subTasks'],
      });

      // Filter tasks by organization
      const filteredTasks = tasks.filter(task => task.project.organizationId === organizationId);

      return {
        success: true,
        message: 'Tasks retrieved successfully',
        data: filteredTasks,
      };
    } catch (error) {
      logger.error('Error fetching tasks by assignee:', error);
      return {
        success: false,
        message: 'Failed to fetch tasks',
        error: error.message,
      };
    }
  }
}