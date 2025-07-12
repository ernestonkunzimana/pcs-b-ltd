import { Repository } from 'typeorm';
import { Payment } from '../models/Payment';
import { Invoice } from '../models/Invoice';
import { AppDataSource } from '../config/database';
import { ApiResponse, PaginationOptions } from '../types';
import { logger } from '../config/logger';
import { io } from '../app';

export class PaymentService {
  private paymentRepository: Repository<Payment>;
  private invoiceRepository: Repository<Invoice>;

  constructor() {
    this.paymentRepository = AppDataSource.getRepository(Payment);
    this.invoiceRepository = AppDataSource.getRepository(Invoice);
  }

  async findAll(organizationId: string, options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.paymentRepository.createQueryBuilder('payment')
        .leftJoinAndSelect('payment.paymentMethod', 'paymentMethod')
        .leftJoinAndSelect('payment.creator', 'creator')
        .leftJoinAndSelect('payment.verifier', 'verifier')
        .where('payment.organizationId = :organizationId', { organizationId })
        .orderBy('payment.createdAt', 'DESC')
        .skip(skip)
        .take(limit);

      const [payments, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'Payments retrieved successfully',
        data: payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching payments:', error);
      return {
        success: false,
        message: 'Failed to fetch payments',
        error: error.message,
      };
    }
  }

  async findById(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id, organizationId },
        relations: ['paymentMethod', 'creator', 'verifier'],
      });

      if (!payment) {
        return {
          success: false,
          message: 'Payment not found',
        };
      }

      return {
        success: true,
        message: 'Payment retrieved successfully',
        data: payment,
      };
    } catch (error) {
      logger.error('Error fetching payment:', error);
      return {
        success: false,
        message: 'Failed to fetch payment',
        error: error.message,
      };
    }
  }

  async create(paymentData: Partial<Payment>, userId: string): Promise<ApiResponse> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate payment number
      const paymentNumber = await this.generatePaymentNumber(paymentData.organizationId);

      const payment = this.paymentRepository.create({
        ...paymentData,
        paymentNumber,
        amountInBaseCurrency: paymentData.amount * (paymentData.exchangeRate || 1),
        netAmount: paymentData.amount - (paymentData.transactionFee || 0),
        createdBy: userId,
      });

      const savedPayment = await queryRunner.manager.save(payment);

      // If payment is for an invoice, update invoice paid amount
      if (paymentData.referenceType === 'invoice' && paymentData.referenceId) {
        await this.updateInvoicePaidAmount(paymentData.referenceId, queryRunner);
      }

      await queryRunner.commitTransaction();

      // Emit real-time notification for payment status change
      io.to(`org_${paymentData.organizationId}`).emit('paymentCreated', {
        paymentId: savedPayment.id,
        amount: savedPayment.amount,
        status: savedPayment.status,
        referenceType: savedPayment.referenceType,
        referenceId: savedPayment.referenceId,
      });

      return {
        success: true,
        message: 'Payment created successfully',
        data: savedPayment,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error creating payment:', error);
      return {
        success: false,
        message: 'Failed to create payment',
        error: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, paymentData: Partial<Payment>, organizationId: string): Promise<ApiResponse> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payment = await this.paymentRepository.findOne({
        where: { id, organizationId },
      });

      if (!payment) {
        return {
          success: false,
          message: 'Payment not found',
        };
      }

      const oldStatus = payment.status;
      
      await queryRunner.manager.update(Payment, id, {
        ...paymentData,
        amountInBaseCurrency: paymentData.amount ? paymentData.amount * (paymentData.exchangeRate || 1) : undefined,
        netAmount: paymentData.amount ? paymentData.amount - (paymentData.transactionFee || 0) : undefined,
      });

      // If payment is for an invoice, update invoice paid amount
      if (payment.referenceType === 'invoice' && payment.referenceId) {
        await this.updateInvoicePaidAmount(payment.referenceId, queryRunner);
      }

      await queryRunner.commitTransaction();

      const updatedPayment = await this.paymentRepository.findOne({
        where: { id },
        relations: ['paymentMethod', 'creator', 'verifier'],
      });

      // Emit real-time notification for payment status change
      if (oldStatus !== paymentData.status) {
        io.to(`org_${organizationId}`).emit('paymentStatusChanged', {
          paymentId: id,
          oldStatus,
          newStatus: paymentData.status,
          amount: updatedPayment.amount,
          referenceType: updatedPayment.referenceType,
          referenceId: updatedPayment.referenceId,
        });
      }

      return {
        success: true,
        message: 'Payment updated successfully',
        data: updatedPayment,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error updating payment:', error);
      return {
        success: false,
        message: 'Failed to update payment',
        error: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id, organizationId },
      });

      if (!payment) {
        return {
          success: false,
          message: 'Payment not found',
        };
      }

      await this.paymentRepository.delete(id);

      return {
        success: true,
        message: 'Payment deleted successfully',
      };
    } catch (error) {
      logger.error('Error deleting payment:', error);
      return {
        success: false,
        message: 'Failed to delete payment',
        error: error.message,
      };
    }
  }

  private async generatePaymentNumber(organizationId: string): Promise<string> {
    const count = await this.paymentRepository.count({
      where: { organizationId },
    });

    const year = new Date().getFullYear();
    return `PAY-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  private async updateInvoicePaidAmount(invoiceId: string, queryRunner: any): Promise<void> {
    const totalPaid = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.referenceType = :type', { type: 'invoice' })
      .andWhere('payment.referenceId = :id', { id: invoiceId })
      .andWhere('payment.status = :status', { status: 'completed' })
      .getRawOne();

    const paidAmount = totalPaid.total || 0;

    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });

    if (invoice) {
      await queryRunner.manager.update(Invoice, invoiceId, {
        paidAmount,
        balanceDue: invoice.totalAmount - paidAmount,
        status: paidAmount >= invoice.totalAmount ? 'paid' : paidAmount > 0 ? 'partial' : 'pending',
      });
    }
  }
}