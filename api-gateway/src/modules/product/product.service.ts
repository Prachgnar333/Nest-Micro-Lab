import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { Product } from './entities/product.entity';
import { QueryProductsDto } from './dto/query-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPO')
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    // ensure category exists
    await this.categoryService.findOne(dto.categoryId);

    const existing = await this.productRepository.findOne({
      where: { sku: dto.sku },
    });
    if (existing)
      throw new ConflictException('Product with this SKU already exists');

    const product = this.productRepository.create(
      dto as DeepPartial<Product>,
    ) as Product;
    try {
      return await this.productRepository.save(product);
    } catch (err: any) {
      if (err?.code === '23505') {
        throw new ConflictException('Product with this SKU already exists');
      }
      throw err;
    }
  }

  async findAll(query?: QueryProductsDto): Promise<any> {
    const categoryId = query?.categoryId;
    const minPrice = query?.minPrice ? Number(query.minPrice) : undefined;
    const maxPrice = query?.maxPrice ? Number(query.maxPrice) : undefined;
    const page = query?.page ? Math.max(1, Number(query.page) || 1) : 1;
    const limit = query?.limit ? Math.max(1, Number(query.limit) || 10) : 10;

    const qb = this.productRepository
      .createQueryBuilder('p')
      .orderBy('p.id', 'DESC');
    const qbCount = this.productRepository.createQueryBuilder('p');

    if (categoryId) {
      qb.andWhere('p.categoryId = :categoryId', { categoryId });
      qbCount.andWhere('p.categoryId = :categoryId', { categoryId });
    }

    if (minPrice !== undefined) {
      qb.andWhere('p.price >= :minPrice', { minPrice });
      qbCount.andWhere('p.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      qb.andWhere('p.price <= :maxPrice', { maxPrice });
      qbCount.andWhere('p.price <= :maxPrice', { maxPrice });
    }

    const total = await qbCount.getCount();

    qb.skip((page - 1) * limit).take(limit);

    const data = await qb.getMany();

    return {
      data,
      meta: { total, page, limit },
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    const payload: any = dto as any;

    if (payload.sku && payload.sku !== product.sku) {
      const existing = await this.productRepository.findOne({
        where: { sku: payload.sku },
      });
      if (existing)
        throw new ConflictException('Product with this SKU already exists');
    }

    if (payload.categoryId && payload.categoryId !== product.categoryId) {
      await this.categoryService.findOne(payload.categoryId);
    }

    Object.assign(product, dto);
    try {
      return await this.productRepository.save(product);
    } catch (err: any) {
      if (err?.code === '23505') {
        throw new ConflictException('Product with this SKU already exists');
      }
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
