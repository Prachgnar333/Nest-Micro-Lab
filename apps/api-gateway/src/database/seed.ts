import { DataSource } from 'typeorm';
import { Category } from '../modules/category/entities/category.entity';
import { Product } from '../modules/product/entities/product.entity';

export async function seedDatabase(dataSource: DataSource) {
  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);

  // Check if data already exists
  const existingCategories = await categoryRepo.count();
  if (existingCategories > 0) {
    console.log('⚠️  Database already seeded. Skipping...');
    return;
  }

  // Create sample categories
  const electronics = categoryRepo.create({
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
  });

  const clothing = categoryRepo.create({
    name: 'Clothing',
    description: 'Apparel and fashion items',
  });

  const books = categoryRepo.create({
    name: 'Books',
    description: 'Physical and digital books',
  });

  const savedCategories = await categoryRepo.save([
    electronics,
    clothing,
    books,
  ]);

  console.log('✅ Created categories:', savedCategories.length);

  // Create sample products
  const products = [
    {
      name: 'Laptop',
      price: 999.99,
      sku: 'LAPTOP-001',
      categoryId: savedCategories[0].id,
    },
    {
      name: 'Smartphone',
      price: 599.99,
      sku: 'PHONE-001',
      categoryId: savedCategories[0].id,
    },
    {
      name: 'Headphones',
      price: 149.99,
      sku: 'HEAD-001',
      categoryId: savedCategories[0].id,
    },
    {
      name: 'T-Shirt',
      price: 29.99,
      sku: 'TSHIRT-001',
      categoryId: savedCategories[1].id,
    },
    {
      name: 'Jeans',
      price: 79.99,
      sku: 'JEANS-001',
      categoryId: savedCategories[1].id,
    },
    {
      name: 'JavaScript Handbook',
      price: 45.99,
      sku: 'BOOK-JS-001',
      categoryId: savedCategories[2].id,
    },
    {
      name: 'TypeScript Deep Dive',
      price: 55.99,
      sku: 'BOOK-TS-001',
      categoryId: savedCategories[2].id,
    },
  ];

  const savedProducts = await productRepo.save(
    products.map((p) => productRepo.create(p)),
  );

  console.log('✅ Created products:', savedProducts.length);
  console.log('✅ Seed complete!');
}
