import { ReceiptsService } from './receipts.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
export declare class ReceiptsController {
    private readonly receiptsService;
    constructor(receiptsService: ReceiptsService);
    findAll(): Promise<import("./entities/receipts.entity").Receipt[]>;
    findOne(id: string): Promise<import("./entities/receipts.entity").Receipt>;
    create(dto: CreateReceiptDto): Promise<import("./entities/receipts.entity").Receipt>;
}
