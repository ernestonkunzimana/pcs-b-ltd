import { Repository } from 'typeorm';
import { Inventory } from '../models/Inventory';
import { Product } from '../models/Product';
import { AppDataSource } from '../config/database';
import { ApiResponse, PaginationOptions } from '../types';
import { logger } from '../config/logger';

export class InventoryService {
  private inventoryRepository: Repository<Inventory>;
  private productRepository: Repository<Product>;

  constructor() {
    this.inventoryRepository = AppDataSource.getRepository(Inventory);
    this.productRepository = AppDataSource.getRepository(Product);
  }

  async findAll(organizationId: string, options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.inventoryRepository.createQueryBuilder('inventory')
        .leftJoinAndSelect('inventory.product', 'product')
        .leftJoinAndSelect('product.category', 'category')
        .where('inventory.organizationId = :organizationId', { organizationId })
        .orderBy('inventory.createdAt', 'DESC')
        .skip(skip)
        .take(limit);

      const [inventory, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'Inventory retrieved successfully',
        data: inventory,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching inventory:', error);
      return {
        success: false,
        message: 'Failed to fetch inventory',
        error: error.message,
      };
    }
  }

  async findById(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const inventory = await this.inventoryRepository.findOne({
        where: { id, organizationId },
        relations: ['product', 'product.category'],
      });

      if (!inventory) {
        return {
          success: false,
          message: 'Inventory item not found',
        };
      }

      return {
        success: true,
        message: 'Inventory item retrieved successfully',
        data: inventory,
      };
    } catch (error) {
      logger.error('Error fetching inventory item:', error);
      return {
        success: false,
        message: 'Failed to fetch inventory item',
        error: error.message,
      };
    }
  }

  async create(inventoryData: Partial<Inventory>): Promise<ApiResponse> {
    try {
      const inventory = this.inventoryRepository.create(inventoryData);
      const savedInventory = await this.inventoryRepository.save(inventory);

      return {
        success: true,
        message: 'Inventory item created successfully',
        data: savedInventory,
      };
    } catch (error) {
      logger.error('Error creating inventory item:', error);
      return {
        success: false,
        message: 'Failed to create inventory item',
        error: error.message,
      };
    }
  }

  async update(id: string, inventoryData: Partial<Inventory>, organizationId: string): Promise<ApiResponse> {
    try {
      const inventory = await this.inventoryRepository.findOne({
        where: { id, organizationId },
      });

      if (!inventory) {
        return {
          success: false,
          message: 'Inventory item not found',
        };
      }

      await this.inventoryRepository.update(id, inventoryData);

      const updatedInventory = await this.inventoryRepository.findOne({
        where: { id },
        relations: ['product', 'product.category'],
      });

      return {
        success: true,
        message: 'Inventory item updated successfully',
        data: updatedInventory,
      };
    } catch (error) {
      logger.error('Error updating inventory item:', error);
      return {
        success: false,
        message: 'Failed to update inventory item',
        error: error.message,
      };
    }
  }

  async delete(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const inventory = await this.inventoryRepository.findOne({
        where: { id, organizationId },
      });

      if (!inventory) {
        return {
          success: false,
          message: 'Inventory item not found',
        };
      }

      await this.inventoryRepository.delete(id);

      return {
        success: true,
        message: 'Inventory item deleted successfully',
      };
    } catch (error) {
      logger.error('Error deleting inventory item:', error);
      return {
        success: false,
        message: 'Failed to delete inventory item',
        error: error.message,
      };
    }
  }

  async getLowStockItems(organizationId: string): Promise<ApiResponse> {
    try {
      const lowStockItems = await this.inventoryRepository
        .createQueryBuilder('inventory')
        .leftJoinAndSelect('inventory.product', 'product')
        .where('inventory.organizationId = :organizationId', { organizationId })
        .andWhere('inventory.quantityAvailable <= product.reorderLevel')
        .getMany();

      return {
        success: true,
        message: 'Low stock items retrieved successfully',
        data: lowStockItems,
      };
    } catch (error) {
      logger.error('Error fetching low stock items:', error);
      return {
        success: false,
        message: 'Failed to fetch low stock items',
        error: error.message,
      };
    }
  }
}