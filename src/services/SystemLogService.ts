import { Repository } from 'typeorm';
import { SystemLog } from '../models/SystemLog';
import { AppDataSource } from '../config/database';
import { ApiResponse, PaginationOptions } from '../types';
import { logger } from '../config/logger';
import { io } from '../app';

export class SystemLogService {
  private systemLogRepository: Repository<SystemLog>;

  constructor() {
    this.systemLogRepository = AppDataSource.getRepository(SystemLog);
  }

  async findAll(options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.systemLogRepository.createQueryBuilder('system_log')
        .leftJoinAndSelect('system_log.user', 'user')
        .orderBy('system_log.createdAt', 'DESC')
        .skip(skip)
        .take(limit);

      const [systemLogs, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'System logs retrieved successfully',
        data: systemLogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching system logs:', error);
      return {
        success: false,
        message: 'Failed to fetch system logs',
        error: error.message,
      };
    }
  }

  async findById(id: string): Promise<ApiResponse> {
    try {
      const systemLog = await this.systemLogRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!systemLog) {
        return {
          success: false,
          message: 'System log not found',
        };
      }

      return {
        success: true,
        message: 'System log retrieved successfully',
        data: systemLog,
      };
    } catch (error) {
      logger.error('Error fetching system log:', error);
      return {
        success: false,
        message: 'Failed to fetch system log',
        error: error.message,
      };
    }
  }

  async create(systemLogData: Partial<SystemLog>): Promise<ApiResponse> {
    try {
      const systemLog = this.systemLogRepository.create(systemLogData);
      const savedSystemLog = await this.systemLogRepository.save(systemLog);

      // Emit real-time notification for critical system logs
      if (systemLogData.level === 'error' || systemLogData.level === 'warning') {
        io.emit('systemLogAdded', {
          id: savedSystemLog.id,
          level: savedSystemLog.level,
          message: savedSystemLog.message,
          module: savedSystemLog.module,
          timestamp: savedSystemLog.createdAt,
        });
      }

      return {
        success: true,
        message: 'System log created successfully',
        data: savedSystemLog,
      };
    } catch (error) {
      logger.error('Error creating system log:', error);
      return {
        success: false,
        message: 'Failed to create system log',
        error: error.message,
      };
    }
  }

  async findByLevel(level: string, options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.systemLogRepository.createQueryBuilder('system_log')
        .leftJoinAndSelect('system_log.user', 'user')
        .where('system_log.level = :level', { level })
        .orderBy('system_log.createdAt', 'DESC')
        .skip(skip)
        .take(limit);

      const [systemLogs, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'System logs retrieved successfully',
        data: systemLogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching system logs by level:', error);
      return {
        success: false,
        message: 'Failed to fetch system logs',
        error: error.message,
      };
    }
  }

  async findByModule(module: string, options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.systemLogRepository.createQueryBuilder('system_log')
        .leftJoinAndSelect('system_log.user', 'user')
        .where('system_log.module = :module', { module })
        .orderBy('system_log.createdAt', 'DESC')
        .skip(skip)
        .take(limit);

      const [systemLogs, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'System logs retrieved successfully',
        data: systemLogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching system logs by module:', error);
      return {
        success: false,
        message: 'Failed to fetch system logs',
        error: error.message,
      };
    }
  }
}