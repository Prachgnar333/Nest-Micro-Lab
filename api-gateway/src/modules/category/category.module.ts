import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Module({
  imports: [DatabaseModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService], // Export for use in ProductModule later
})
export class CategoryModule {}
