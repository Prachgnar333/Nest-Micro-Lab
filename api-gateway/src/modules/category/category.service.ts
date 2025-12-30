import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPO')
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if category with same name exists
    const existing = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    try {
      return await this.categoryRepository.save(category);
    } catch (err: any) {
      if (err?.code === '23505') {
        throw new ConflictException('Category with this name already exists');
      }
      throw err;
    }
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Category> {
    if (!isUUID(id)) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    // Check if new name conflicts with existing category
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existing = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existing) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    try {
      return await this.categoryRepository.save(category);
    } catch (err: any) {
      if (err?.code === '23505') {
        throw new ConflictException('Category with this name already exists');
      }
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);

    // Check if category has related products
    const productCount = await this.categoryRepository
      .createQueryBuilder('c')
      .where('c.id = :id', { id })
      .leftJoinAndSelect('c.products', 'products')
      .getCount();

    if (productCount > 0) {
      throw new BadRequestException(
        'Cannot delete category that has products. Delete or reassign products first.',
      );
    }

    await this.categoryRepository.remove(category);
  }
}
