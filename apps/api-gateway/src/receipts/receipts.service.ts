import { Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Receipt } from './entities/receipts.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Repository } from 'typeorm';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { Notify } from 'src/notifications/decorators/notify.decorator';
import { NotifyInterceptor } from 'src/notifications/interceptors/notify.interceptor';

@Injectable()
@UseInterceptors(NotifyInterceptor) // ✅ Apply interceptor to entire service
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepo: Repository<Receipt>,
    private readonly notifications: NotificationsService, // Can still use manually if needed
  ) {}

  async findAll() {
    return this.receiptRepo.find({ order: { issuedAt: 'DESC' } });
  }

  async findOne(receiptId: string) {
    const receipt = await this.receiptRepo.findOne({ where: { receiptId } });
    if (!receipt) throw new NotFoundException('Receipt not found');
    return receipt;
  }

  // ✅ Use @Notify() decorator instead of manual notification
  @Notify({
    featureName: 'receipts',
    event: 'receipt_created',
    payloadBuilder: (result) => ({
      receiptId: result.receiptId,
      price: result.price,
      name: result.name,
    }),
  })
  async create(dto: CreateReceiptDto) {
    const saved = await this.receiptRepo.save(
      this.receiptRepo.create({
        issuedAt: new Date(dto.issuedAt),
        name: dto.name,
        price: dto.price,
      }),
    );

    // No manual notification call needed!
    return saved;
  }

  // ✅ Use @Notify() decorator for update too
  @Notify({
    featureName: 'receipts',
    event: 'receipt_updated',
    payloadBuilder: (result) => ({
      receiptId: result.receiptId,
      price: result.price,
      updatedFields: ['price', 'name'],
    }),
  })
  async update(receiptId: string, dto: UpdateReceiptDto) {
    const receipt = await this.findOne(receiptId);

    if (dto.issuedAt !== undefined) receipt.issuedAt = new Date(dto.issuedAt);
    if (dto.name !== undefined) receipt.name = dto.name;
    if (dto.price !== undefined) receipt.price = dto.price;

    const saved = await this.receiptRepo.save(receipt);

    // No manual notification call needed!
    return saved;
  }

  hello() {
    return 'Hello from receipt service';
  }
}
