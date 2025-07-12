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
import { Category } from './Category';
import { User } from './User';
import { Inventory } from './Inventory';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true, nullable: true })
  sku: string;

  @Column({ nullable: true })
  barcode: string;

  @Column({ name: 'unit_of_measure', nullable: true })
  unitOfMeasure: string;

  @Column('decimal', { precision: 15, scale: 2, name: 'cost_price', nullable: true })
  costPrice: number;

  @Column('decimal', { precision: 15, scale: 2, name: 'selling_price', nullable: true })
  sellingPrice: number;

  @Column({ name: 'minimum_stock', default: 0 })
  minimumStock: number;

  @Column({ name: 'maximum_stock', nullable: true })
  maximumStock: number;

  @Column({ name: 'reorder_level', default: 0 })
  reorderLevel: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_service', default: false })
  isService: boolean;

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  weight: number;

  @Column({ nullable: true })
  dimensions: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @ManyToOne(() => Organization, (organization) => organization.products)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventory: Inventory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}