import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './Transaction';
import { Account } from './Account';

@Entity('transaction_entries')
export class TransactionEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_id' })
  transactionId: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column('decimal', { precision: 15, scale: 2, name: 'debit_amount', default: 0 })
  debitAmount: number;

  @Column('decimal', { precision: 15, scale: 2, name: 'credit_amount', default: 0 })
  creditAmount: number;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.entries)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}