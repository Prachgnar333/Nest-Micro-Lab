import { Category } from '../../category/entities/category.entity';
export declare class Product {
    id: string;
    name: string;
    price: number;
    sku: string;
    categoryId: string;
    category: Category;
}
