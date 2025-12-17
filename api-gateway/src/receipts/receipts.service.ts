import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Receipt } from 'src/database/entities/receipts.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Repository } from 'typeorm';
import { CreateReceiptDto } from './dto/create-receipt.dto';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepo: Repository<Receipt>,
    private readonly notifications: NotificationsService,
  ) {}

  async findAll() {
    return this.receiptRepo.find({ order: { issuedAt: 'DESC' } });
  }

  async findOne(receiptId: string) {
    const receipt = await this.receiptRepo.findOne({ where: { receiptId } });
    if (!receipt) throw new NotFoundException('Receipt not found');
    return receipt;
  }

  async create(dto: CreateReceiptDto) {
    const receipt = this.receiptRepo.create({
      issuedAt: new Date(dto.issuedAt),
      name: dto.name,
      price: dto.price,
    });

    const saved = await this.receiptRepo.save(receipt);

    this.notifications.notify('receipt_created', {
      receiptId: saved.receiptId,
      price: saved.price,
    });

    return saved;
  }

  hello() {
    return 'Hello from receipt service';
  }
}
