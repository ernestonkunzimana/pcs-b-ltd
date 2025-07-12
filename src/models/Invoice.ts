import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Organization } from './Organization';
import { Customer } from './Customer';
import { Project } from './Project';
import { User } from './User';
import { InvoiceItem } from './InvoiceItem';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'project_id', nullable: true })
  projectId: string;

  @Column({ name: 'invoice_number', unique: true })
  invoiceNumber: string;

  @Column({ name: 'invoice_date' })
  invoiceDate: Date;

  @Column({ name: 'due_date' })
  dueDate: Date;

  @Column({ default: 'draft' })
  status: string;

  @Column('decimal', { precision: 15, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 15, scale: 2, name: 'tax_amount', default: 0 })
  taxAmount: number;

  @Column('decimal', { precision: 15, scale: 2, name: 'discount_amount', default: 0 })
  discountAmount: number;

  @Column('decimal', { precision: 15, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column('decimal', { precision: 15, scale: 2, name: 'paid_amount', default: 0 })
  paidAmount: number;

  @Column('decimal', { precision: 15, scale: 2, name: 'balance_due' })
  balanceDue: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ name: 'terms_conditions', nullable: true })
  termsConditions: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @ManyToOne(() => Organization, (organization) => organization.invoices)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Customer, (customer) => customer.invoices)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Project, { nullable: true })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => InvoiceItem, (item) => item.invoice)
  items: InvoiceItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}