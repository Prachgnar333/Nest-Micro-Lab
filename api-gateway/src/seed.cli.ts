import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { seedDatabase } from './database/seed';
import { Category } from './modules/category/entities/category.entity';
import { Product } from './modules/product/entities/product.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'nest_lab',
  entities: [Category, Product],
  migrations: ['src/migrations/*.ts'],
});

AppDataSource.initialize()
  .then(async (dataSource) => {
    console.log('🔄 Running migrations...');
    await dataSource.runMigrations();
    console.log('✅ Migrations complete!');

    console.log('🌱 Seeding database...');
    await seedDatabase(dataSource);

    await dataSource.destroy();
    console.log('✅ Done!');
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
