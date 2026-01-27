import { Receipt } from './entities/receipts.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Repository } from 'typeorm';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
export declare class ReceiptsService {
    private readonly receiptRepo;
    private readonly notifications;
    constructor(receiptRepo: Repository<Receipt>, notifications: NotificationsService);
    findAll(): Promise<Receipt[]>;
    findOne(receiptId: string): Promise<Receipt>;
    create(dto: CreateReceiptDto): Promise<Receipt>;
    update(receiptId: string, dto: UpdateReceiptDto): Promise<Receipt>;
    hello(): string;
}
