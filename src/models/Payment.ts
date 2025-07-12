import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from './Organization';
import { PaymentMethod } from './PaymentMethod';
import { User } from './User';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'payment_number', unique: true })
  paymentNumber: string;

  @Column({ name: 'payment_date' })
  paymentDate: Date;

  @Column({ name: 'payment_type' })
  paymentType: string;

  @Column({ name: 'payment_method_id', nullable: true })
  paymentMethodId: string;

  @Column({ name: 'reference_type', nullable: true })
  referenceType: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string;

  @Column({ name: 'payer_id', nullable: true })
  payerId: string;

  @Column({ name: 'payer_type', nullable: true })
  payerType: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({ default: 'RWF' })
  currency: string;

  @Column('decimal', { precision: 10, scale: 4, name: 'exchange_rate', default: 1.0 })
  exchangeRate: number;

  @Column('decimal', { precision: 15, scale: 2, name: 'amount_in_base_currency' })
  amountInBaseCurrency: number;

  @Column('decimal', { precision: 15, scale: 2, name: 'transaction_fee', default: 0 })
  transactionFee: number;

  @Column('decimal', { precision: 15, scale: 2, name: 'net_amount' })
  netAmount: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ name: 'external_transaction_id', nullable: true })
  externalTransactionId: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'verified_by', nullable: true })
  verifiedBy: string;

  @Column({ name: 'verified_at', nullable: true })
  verifiedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.payments)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => PaymentMethod, { nullable: true })
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'verified_by' })
  verifier: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}