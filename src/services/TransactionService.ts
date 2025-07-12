import { Repository } from 'typeorm';
import { Transaction } from '../models/Transaction';
import { TransactionEntry } from '../models/TransactionEntry';
import { AppDataSource } from '../config/database';
import { ApiResponse, PaginationOptions } from '../types';
import { logger } from '../config/logger';
import { io } from '../app';

export class TransactionService {
  private transactionRepository: Repository<Transaction>;
  private transactionEntryRepository: Repository<TransactionEntry>;

  constructor() {
    this.transactionRepository = AppDataSource.getRepository(Transaction);
    this.transactionEntryRepository = AppDataSource.getRepository(TransactionEntry);
  }

  async findAll(organizationId: string, options: PaginationOptions): Promise<ApiResponse> {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const queryBuilder = this.transactionRepository.createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.entries', 'entries')
        .leftJoinAndSelect('entries.account', 'account')
        .leftJoinAndSelect('transaction.creator', 'creator')
        .leftJoinAndSelect('transaction.approver', 'approver')
        .where('transaction.organizationId = :organizationId', { organizationId })
        .orderBy('transaction.createdAt', 'DESC')
        .skip(skip)
        .take(limit);

      const [transactions, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        message: 'Transactions retrieved successfully',
        data: transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching transactions:', error);
      return {
        success: false,
        message: 'Failed to fetch transactions',
        error: error.message,
      };
    }
  }

  async findById(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id, organizationId },
        relations: ['entries', 'entries.account', 'creator', 'approver'],
      });

      if (!transaction) {
        return {
          success: false,
          message: 'Transaction not found',
        };
      }

      return {
        success: true,
        message: 'Transaction retrieved successfully',
        data: transaction,
      };
    } catch (error) {
      logger.error('Error fetching transaction:', error);
      return {
        success: false,
        message: 'Failed to fetch transaction',
        error: error.message,
      };
    }
  }

  async create(transactionData: Partial<Transaction>, entries: Partial<TransactionEntry>[], userId: string): Promise<ApiResponse> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate transaction number
      const transactionNumber = await this.generateTransactionNumber(transactionData.organizationId);

      // Validate double-entry bookkeeping
      const totalDebits = entries.reduce((sum, entry) => sum + (entry.debitAmount || 0), 0);
      const totalCredits = entries.reduce((sum, entry) => sum + (entry.creditAmount || 0), 0);

      if (Math.abs(totalDebits - totalCredits) > 0.01) {
        return {
          success: false,
          message: 'Transaction entries must balance (debits must equal credits)',
        };
      }

      const transaction = this.transactionRepository.create({
        ...transactionData,
        transactionNumber,
        createdBy: userId,
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      // Create transaction entries
      const transactionEntries = entries.map(entry => 
        this.transactionEntryRepository.create({
          ...entry,
          transactionId: savedTransaction.id,
        })
      );

      await queryRunner.manager.save(transactionEntries);

      await queryRunner.commitTransaction();

      // Emit real-time notification for new transaction
      io.to(`org_${transactionData.organizationId}`).emit('newTransaction', {
        transactionId: savedTransaction.id,
        type: savedTransaction.transactionType,
        amount: savedTransaction.totalAmount,
        description: savedTransaction.description,
      });

      const completeTransaction = await this.transactionRepository.findOne({
        where: { id: savedTransaction.id },
        relations: ['entries', 'entries.account', 'creator'],
      });

      return {
        success: true,
        message: 'Transaction created successfully',
        data: completeTransaction,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error creating transaction:', error);
      return {
        success: false,
        message: 'Failed to create transaction',
        error: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, transactionData: Partial<Transaction>, entries: Partial<TransactionEntry>[], organizationId: string): Promise<ApiResponse> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id, organizationId },
      });

      if (!transaction) {
        return {
          success: false,
          message: 'Transaction not found',
        };
      }

      // Validate double-entry bookkeeping
      const totalDebits = entries.reduce((sum, entry) => sum + (entry.debitAmount || 0), 0);
      const totalCredits = entries.reduce((sum, entry) => sum + (entry.creditAmount || 0), 0);

      if (Math.abs(totalDebits - totalCredits) > 0.01) {
        return {
          success: false,
          message: 'Transaction entries must balance (debits must equal credits)',
        };
      }

      await queryRunner.manager.update(Transaction, id, transactionData);

      // Delete existing entries and create new ones
      await queryRunner.manager.delete(TransactionEntry, { transactionId: id });

      const transactionEntries = entries.map(entry => 
        this.transactionEntryRepository.create({
          ...entry,
          transactionId: id,
        })
      );

      await queryRunner.manager.save(transactionEntries);

      await queryRunner.commitTransaction();

      const updatedTransaction = await this.transactionRepository.findOne({
        where: { id },
        relations: ['entries', 'entries.account', 'creator', 'approver'],
      });

      return {
        success: true,
        message: 'Transaction updated successfully',
        data: updatedTransaction,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error updating transaction:', error);
      return {
        success: false,
        message: 'Failed to update transaction',
        error: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string, organizationId: string): Promise<ApiResponse> {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id, organizationId },
      });

      if (!transaction) {
        return {
          success: false,
          message: 'Transaction not found',
        };
      }

      await this.transactionRepository.delete(id);

      return {
        success: true,
        message: 'Transaction deleted successfully',
      };
    } catch (error) {
      logger.error('Error deleting transaction:', error);
      return {
        success: false,
        message: 'Failed to delete transaction',
        error: error.message,
      };
    }
  }

  private async generateTransactionNumber(organizationId: string): Promise<string> {
    const count = await this.transactionRepository.count({
      where: { organizationId },
    });

    const year = new Date().getFullYear();
    return `TXN-${year}-${String(count + 1).padStart(6, '0')}`;
  }
}