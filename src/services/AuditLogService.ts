import { Repository } from 'typeorm';
import { AuditLog } from '../models/AuditLog';
import { AppDataSource } from '../config/database';
import { ApiResponse, PaginationOptions } from '../types';
import { logger } from '../config/logger';

export class AuditLogService {
  private auditLogRepository: Repository<AuditLog>;

  constructor() {
    this.auditLogRepository = AppDataSource.getRepository(AuditLog);
  }

  async findAll(organizationId: string, options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.auditLogRepository.createQueryBuilder('audit_log')
        .leftJoinAndSelect('audit_log.user', 'user')
        .where('audit_log.organizationId = :organizationId', { organizationId })
        .orderBy('audit_log.createdAt', 'DESC')
        .skip(skip)
        .take(limit);

      const [auditLogs, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'Audit logs retrieved successfully',
        data: auditLogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching audit logs:', error);
      return {
        success: false,
        message: 'Failed to fetch audit logs',
        error: error.message,
      };
    }
  }

  async findById(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const auditLog = await this.auditLogRepository.findOne({
        where: { id, organizationId },
        relations: ['user'],
      });

      if (!auditLog) {
        return {
          success: false,
          message: 'Audit log not found',
        };
      }

      return {
        success: true,
        message: 'Audit log retrieved successfully',
        data: auditLog,
      };
    } catch (error) {
      logger.error('Error fetching audit log:', error);
      return {
        success: false,
        message: 'Failed to fetch audit log',
        error: error.message,
      };
    }
  }

  async create(auditLogData: Partial<AuditLog>): Promise<ApiResponse> {
    try {
      const auditLog = this.auditLogRepository.create(auditLogData);
      const savedAuditLog = await this.auditLogRepository.save(auditLog);

      return {
        success: true,
        message: 'Audit log created successfully',
        data: savedAuditLog,
      };
    } catch (error) {
      logger.error('Error creating audit log:', error);
      return {
        success: false,
        message: 'Failed to create audit log',
        error: error.message,
      };
    }
  }

  async findByTable(tableName: string, organizationId: string, options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.auditLogRepository.createQueryBuilder('audit_log')
        .leftJoinAndSelect('audit_log.user', 'user')
        .where('audit_log.organizationId = :organizationId', { organizationId })
        .andWhere('audit_log.tableName = :tableName', { tableName })
        .orderBy('audit_log.createdAt', 'DESC')
        .skip(skip)
        .take(limit);

      const [auditLogs, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'Audit logs retrieved successfully',
        data: auditLogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching audit logs by table:', error);
      return {
        success: false,
        message: 'Failed to fetch audit logs',
        error: error.message,
      };
    }
  }

  async findByUser(userId: string, organizationId: string, options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.auditLogRepository.createQueryBuilder('audit_log')
        .leftJoinAndSelect('audit_log.user', 'user')
        .where('audit_log.organizationId = :organizationId', { organizationId })
        .andWhere('audit_log.userId = :userId', { userId })
        .orderBy('audit_log.createdAt', 'DESC')
        .skip(skip)
        .take(limit);

      const [auditLogs, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'Audit logs retrieved successfully',
        data: auditLogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching audit logs by user:', error);
      return {
        success: false,
        message: 'Failed to fetch audit logs',
        error: error.message,
      };
    }
  }
}