"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1703002800000 = void 0;
const typeorm_1 = require("typeorm");
class InitialSchema1703002800000 {
    async up(queryRunner) {
        const categoriesTableExists = await queryRunner.hasTable('categories');
        if (!categoriesTableExists) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'categories',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'gen_random_uuid()',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                        onUpdate: 'now()',
                    },
                ],
            }), true);
        }
        const productsTableExists = await queryRunner.hasTable('products');
        if (!productsTableExists) {
            await queryRunner.createTable(new typeorm_1.Table({
                name: 'products',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'gen_random_uuid()',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'price',
                        type: 'numeric',
                    },
                    {
                        name: 'sku',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'categoryId',
                        type: 'uuid',
                    },
                ],
            }), true);
        }
        const table = await queryRunner.getTable('products');
        const foreignKeyExists = table?.foreignKeys.some((fk) => fk.columnNames.indexOf('categoryId') !== -1);
        if (!foreignKeyExists && table) {
            await queryRunner.createForeignKey('products', new typeorm_1.TableForeignKey({
                columnNames: ['categoryId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'categories',
                onDelete: 'RESTRICT',
            }));
        }
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('products');
        const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.indexOf('categoryId') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('products', foreignKey);
        }
        await queryRunner.dropTable('products', true);
        await queryRunner.dropTable('categories', true);
    }
}
exports.InitialSchema1703002800000 = InitialSchema1703002800000;
//# sourceMappingURL=1703002800000-InitialSchema.js.map