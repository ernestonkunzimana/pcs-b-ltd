import { Repository } from 'typeorm';
import { ESGMetric } from '../models/ESGMetric';
import { AppDataSource } from '../config/database';
import { ApiResponse, PaginationOptions } from '../types';
import { logger } from '../config/logger';

export class ESGMetricService {
  private esgMetricRepository: Repository<ESGMetric>;

  constructor() {
    this.esgMetricRepository = AppDataSource.getRepository(ESGMetric);
  }

  async findAll(organizationId: string, options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.esgMetricRepository.createQueryBuilder('esg_metric')
        .leftJoinAndSelect('esg_metric.project', 'project')
        .leftJoinAndSelect('esg_metric.creator', 'creator')
        .where('esg_metric.organizationId = :organizationId', { organizationId })
        .orderBy('esg_metric.measurementDate', 'DESC')
        .skip(skip)
        .take(limit);

      const [esgMetrics, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'ESG metrics retrieved successfully',
        data: esgMetrics,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching ESG metrics:', error);
      return {
        success: false,
        message: 'Failed to fetch ESG metrics',
        error: error.message,
      };
    }
  }

  async findById(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const esgMetric = await this.esgMetricRepository.findOne({
        where: { id, organizationId },
        relations: ['project', 'creator'],
      });

      if (!esgMetric) {
        return {
          success: false,
          message: 'ESG metric not found',
        };
      }

      return {
        success: true,
        message: 'ESG metric retrieved successfully',
        data: esgMetric,
      };
    } catch (error) {
      logger.error('Error fetching ESG metric:', error);
      return {
        success: false,
        message: 'Failed to fetch ESG metric',
        error: error.message,
      };
    }
  }

  async create(esgMetricData: Partial<ESGMetric>, userId: string): Promise<ApiResponse> {
    try {
      const esgMetric = this.esgMetricRepository.create({
        ...esgMetricData,
        createdBy: userId,
      });

      const savedEsgMetric = await this.esgMetricRepository.save(esgMetric);

      return {
        success: true,
        message: 'ESG metric created successfully',
        data: savedEsgMetric,
      };
    } catch (error) {
      logger.error('Error creating ESG metric:', error);
      return {
        success: false,
        message: 'Failed to create ESG metric',
        error: error.message,
      };
    }
  }

  async update(id: string, esgMetricData: Partial<ESGMetric>, organizationId: string): Promise<ApiResponse> {
    try {
      const esgMetric = await this.esgMetricRepository.findOne({
        where: { id, organizationId },
      });

      if (!esgMetric) {
        return {
          success: false,
          message: 'ESG metric not found',
        };
      }

      await this.esgMetricRepository.update(id, esgMetricData);

      const updatedEsgMetric = await this.esgMetricRepository.findOne({
        where: { id },
        relations: ['project', 'creator'],
      });

      return {
        success: true,
        message: 'ESG metric updated successfully',
        data: updatedEsgMetric,
      };
    } catch (error) {
      logger.error('Error updating ESG metric:', error);
      return {
        success: false,
        message: 'Failed to update ESG metric',
        error: error.message,
      };
    }
  }

  async delete(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const esgMetric = await this.esgMetricRepository.findOne({
        where: { id, organizationId },
      });

      if (!esgMetric) {
        return {
          success: false,
          message: 'ESG metric not found',
        };
      }

      await this.esgMetricRepository.delete(id);

      return {
        success: true,
        message: 'ESG metric deleted successfully',
      };
    } catch (error) {
      logger.error('Error deleting ESG metric:', error);
      return {
        success: false,
        message: 'Failed to delete ESG metric',
        error: error.message,
      };
    }
  }

  async findByType(metricType: string, organizationId: string, options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.esgMetricRepository.createQueryBuilder('esg_metric')
        .leftJoinAndSelect('esg_metric.project', 'project')
        .leftJoinAndSelect('esg_metric.creator', 'creator')
        .where('esg_metric.organizationId = :organizationId', { organizationId })
        .andWhere('esg_metric.metricType = :metricType', { metricType })
        .orderBy('esg_metric.measurementDate', 'DESC')
        .skip(skip)
        .take(limit);

      const [esgMetrics, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'ESG metrics retrieved successfully',
        data: esgMetrics,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching ESG metrics by type:', error);
      return {
        success: false,
        message: 'Failed to fetch ESG metrics',
        error: error.message,
      };
    }
  }

  async findByProject(projectId: string, organizationId: string): Promise<ApiResponse> {
    try {
      const esgMetrics = await this.esgMetricRepository.find({
        where: { projectId, organizationId },
        relations: ['project', 'creator'],
        order: { measurementDate: 'DESC' },
      });

      return {
        success: true,
        message: 'ESG metrics retrieved successfully',
        data: esgMetrics,
      };
    } catch (error) {
      logger.error('Error fetching ESG metrics by project:', error);
      return {
        success: false,
        message: 'Failed to fetch ESG metrics',
        error: error.message,
      };
    }
  }
}