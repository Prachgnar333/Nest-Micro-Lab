import { Product } from '../../product/entities/product.entity';
export declare class Category {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    products: Product[];
}
