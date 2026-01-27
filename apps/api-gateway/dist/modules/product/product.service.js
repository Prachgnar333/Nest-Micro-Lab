"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const category_service_1 = require("../category/category.service");
let ProductService = class ProductService {
    productRepository;
    categoryService;
    constructor(productRepository, categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }
    async create(dto) {
        await this.categoryService.findOne(dto.categoryId);
        const existing = await this.productRepository.findOne({
            where: { sku: dto.sku },
        });
        if (existing)
            throw new common_1.ConflictException('Product with this SKU already exists');
        const product = this.productRepository.create(dto);
        try {
            return await this.productRepository.save(product);
        }
        catch (err) {
            if (err?.code === '23505') {
                throw new common_1.ConflictException('Product with this SKU already exists');
            }
            throw err;
        }
    }
    async findAll(query) {
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
    async findOne(id) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        return product;
    }
    async update(id, dto) {
        const product = await this.findOne(id);
        const payload = dto;
        if (payload.sku && payload.sku !== product.sku) {
            const existing = await this.productRepository.findOne({
                where: { sku: payload.sku },
            });
            if (existing)
                throw new common_1.ConflictException('Product with this SKU already exists');
        }
        if (payload.categoryId && payload.categoryId !== product.categoryId) {
            await this.categoryService.findOne(payload.categoryId);
        }
        Object.assign(product, dto);
        try {
            return await this.productRepository.save(product);
        }
        catch (err) {
            if (err?.code === '23505') {
                throw new common_1.ConflictException('Product with this SKU already exists');
            }
            throw err;
        }
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PRODUCT_REPO')),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        category_service_1.CategoryService])
], ProductService);
//# sourceMappingURL=product.service.js.map