import { Repository } from 'typeorm';
import { Invoice } from '../models/Invoice';
import { InvoiceItem } from '../models/InvoiceItem';
import { AppDataSource } from '../config/database';
import { ApiResponse, PaginationOptions } from '../types';
import { logger } from '../config/logger';

export class InvoiceService {
  private invoiceRepository: Repository<Invoice>;
  private invoiceItemRepository: Repository<InvoiceItem>;

  constructor() {
    this.invoiceRepository = AppDataSource.getRepository(Invoice);
    this.invoiceItemRepository = AppDataSource.getRepository(InvoiceItem);
  }

  async findAll(organizationId: string, options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.customer', 'customer')
        .leftJoinAndSelect('invoice.project', 'project')
        .leftJoinAndSelect('invoice.items', 'items')
        .leftJoinAndSelect('items.product', 'product')
        .where('invoice.organizationId = :organizationId', { organizationId })
        .orderBy('invoice.createdAt', 'DESC')
        .skip(skip)
        .take(limit);

      const [invoices, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'Invoices retrieved successfully',
        data: invoices,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching invoices:', error);
      return {
        success: false,
        message: 'Failed to fetch invoices',
        error: error.message,
      };
    }
  }

  async findById(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { id, organizationId },
        relations: ['customer', 'project', 'items', 'items.product'],
      });

      if (!invoice) {
        return {
          success: false,
          message: 'Invoice not found',
        };
      }

      return {
        success: true,
        message: 'Invoice retrieved successfully',
        data: invoice,
      };
    } catch (error) {
      logger.error('Error fetching invoice:', error);
      return {
        success: false,
        message: 'Failed to fetch invoice',
        error: error.message,
      };
    }
  }

  async create(invoiceData: Partial<Invoice>, items: Partial<InvoiceItem>[], userId: string): Promise<ApiResponse> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate invoice number
      const invoiceNumber = await this.generateInvoiceNumber(invoiceData.organizationId);

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      const totalAmount = subtotal + (invoiceData.taxAmount || 0) - (invoiceData.discountAmount || 0);

      const invoice = this.invoiceRepository.create({
        ...invoiceData,
        invoiceNumber,
        subtotal,
        totalAmount,
        balanceDue: totalAmount,
        createdBy: userId,
      });

      const savedInvoice = await queryRunner.manager.save(invoice);

      // Create invoice items
      const invoiceItems = items.map(item => 
        this.invoiceItemRepository.create({
          ...item,
          invoiceId: savedInvoice.id,
        })
      );

      await queryRunner.manager.save(invoiceItems);

      await queryRunner.commitTransaction();

      const completeInvoice = await this.invoiceRepository.findOne({
        where: { id: savedInvoice.id },
        relations: ['customer', 'project', 'items', 'items.product'],
      });

      return {
        success: true,
        message: 'Invoice created successfully',
        data: completeInvoice,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error creating invoice:', error);
      return {
        success: false,
        message: 'Failed to create invoice',
        error: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, invoiceData: Partial<Invoice>, items: Partial<InvoiceItem>[], organizationId: string): Promise<ApiResponse> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { id, organizationId },
      });

      if (!invoice) {
        return {
          success: false,
          message: 'Invoice not found',
        };
      }

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      const totalAmount = subtotal + (invoiceData.taxAmount || 0) - (invoiceData.discountAmount || 0);

      await queryRunner.manager.update(Invoice, id, {
        ...invoiceData,
        subtotal,
        totalAmount,
        balanceDue: totalAmount - invoice.paidAmount,
      });

      // Delete existing items and create new ones
      await queryRunner.manager.delete(InvoiceItem, { invoiceId: id });

      const invoiceItems = items.map(item => 
        this.invoiceItemRepository.create({
          ...item,
          invoiceId: id,
        })
      );

      await queryRunner.manager.save(invoiceItems);

      await queryRunner.commitTransaction();

      const updatedInvoice = await this.invoiceRepository.findOne({
        where: { id },
        relations: ['customer', 'project', 'items', 'items.product'],
      });

      return {
        success: true,
        message: 'Invoice updated successfully',
        data: updatedInvoice,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error updating invoice:', error);
      return {
        success: false,
        message: 'Failed to update invoice',
        error: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { id, organizationId },
      });

      if (!invoice) {
        return {
          success: false,
          message: 'Invoice not found',
        };
      }

      await this.invoiceRepository.delete(id);

      return {
        success: true,
        message: 'Invoice deleted successfully',
      };
    } catch (error) {
      logger.error('Error deleting invoice:', error);
      return {
        success: false,
        message: 'Failed to delete invoice',
        error: error.message,
      };
    }
  }

  private async generateInvoiceNumber(organizationId: string): Promise<string> {
    const count = await this.invoiceRepository.count({
      where: { organizationId },
    });

    const year = new Date().getFullYear();
    return `INV-${year}-${String(count + 1).padStart(4, '0')}`;
  }
}