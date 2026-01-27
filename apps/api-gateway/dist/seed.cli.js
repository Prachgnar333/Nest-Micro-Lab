"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const seed_1 = require("./database/seed");
const category_entity_1 = require("./modules/category/entities/category.entity");
const product_entity_1 = require("./modules/product/entities/product.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'nest_lab',
    entities: [category_entity_1.Category, product_entity_1.Product],
    migrations: ['src/migrations/*.ts'],
});
AppDataSource.initialize()
    .then(async (dataSource) => {
    console.log('🔄 Running migrations...');
    await dataSource.runMigrations();
    console.log('✅ Migrations complete!');
    console.log('🌱 Seeding database...');
    await (0, seed_1.seedDatabase)(dataSource);
    await dataSource.destroy();
    console.log('✅ Done!');
})
    .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.cli.js.map