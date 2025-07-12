import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Project } from './Project';
import { Product } from './Product';
import { Customer } from './Customer';
import { Supplier } from './Supplier';
import { Transaction } from './Transaction';
import { Invoice } from './Invoice';
import { Payment } from './Payment';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'legal_name', nullable: true })
  legalName: string;

  @Column({ name: 'registration_number', nullable: true })
  registrationNumber: string;

  @Column({ name: 'tax_number', nullable: true })
  taxNumber: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ name: 'business_type', nullable: true })
  businessType: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'established_date', nullable: true })
  establishedDate: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => Project, (project) => project.organization)
  projects: Project[];

  @OneToMany(() => Product, (product) => product.organization)
  products: Product[];

  @OneToMany(() => Customer, (customer) => customer.organization)
  customers: Customer[];

  @OneToMany(() => Supplier, (supplier) => supplier.organization)
  suppliers: Supplier[];

  @OneToMany(() => Transaction, (transaction) => transaction.organization)
  transactions: Transaction[];

  @OneToMany(() => Invoice, (invoice) => invoice.organization)
  invoices: Invoice[];

  @OneToMany(() => Payment, (payment) => payment.organization)
  payments: Payment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}