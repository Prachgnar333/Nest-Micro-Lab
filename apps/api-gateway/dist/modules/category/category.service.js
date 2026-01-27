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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
let CategoryService = class CategoryService {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async create(createCategoryDto) {
        const existing = await this.categoryRepository.findOne({
            where: { name: createCategoryDto.name },
        });
        if (existing) {
            throw new common_1.ConflictException('Category with this name already exists');
        }
        const category = this.categoryRepository.create(createCategoryDto);
        try {
            return await this.categoryRepository.save(category);
        }
        catch (err) {
            if (err?.code === '23505') {
                throw new common_1.ConflictException('Category with this name already exists');
            }
            throw err;
        }
    }
    async findAll() {
        return this.categoryRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        if (!(0, class_validator_1.isUUID)(id)) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        const category = await this.findOne(id);
        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existing = await this.categoryRepository.findOne({
                where: { name: updateCategoryDto.name },
            });
            if (existing) {
                throw new common_1.ConflictException('Category with this name already exists');
            }
        }
        Object.assign(category, updateCategoryDto);
        try {
            return await this.categoryRepository.save(category);
        }
        catch (err) {
            if (err?.code === '23505') {
                throw new common_1.ConflictException('Category with this name already exists');
            }
            throw err;
        }
    }
    async remove(id) {
        const category = await this.findOne(id);
        const productCount = await this.categoryRepository
            .createQueryBuilder('c')
            .where('c.id = :id', { id })
            .leftJoinAndSelect('c.products', 'products')
            .getCount();
        if (productCount > 0) {
            throw new common_1.BadRequestException('Cannot delete category that has products. Delete or reassign products first.');
        }
        await this.categoryRepository.remove(category);
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CATEGORY_REPO')),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], CategoryService);
//# sourceMappingURL=category.service.js.map