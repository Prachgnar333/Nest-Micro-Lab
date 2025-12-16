import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('receipts')
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  issuedAt: Date;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}
