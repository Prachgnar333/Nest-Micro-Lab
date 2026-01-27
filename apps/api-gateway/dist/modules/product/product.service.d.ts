import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { QueryProductsDto } from './dto/query-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from '../category/category.service';
export declare class ProductService {
    private readonly productRepository;
    private readonly categoryService;
    constructor(productRepository: Repository<Product>, categoryService: CategoryService);
    create(dto: CreateProductDto): Promise<Product>;
    findAll(query?: QueryProductsDto): Promise<any>;
    findOne(id: string): Promise<Product>;
    update(id: string, dto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
}
