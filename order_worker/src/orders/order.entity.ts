// orders/order.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders') // This maps the class to the 'orders' table
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb', nullable: false })
  data: object; // Store the original order payload

  @Column({ type: 'varchar', length: 50 })
  status: string = 'PROCESSED'; // Example status field

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  processedAt: Date;
}