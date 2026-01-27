import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class InitialSchema1703002800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if categories table exists
    const categoriesTableExists = await queryRunner.hasTable('categories');
    if (!categoriesTableExists) {
      // Create categories table
      await queryRunner.createTable(
        new Table({
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
        }),
        true,
      );
    }

    // Check if products table exists
    const productsTableExists = await queryRunner.hasTable('products');
    if (!productsTableExists) {
      // Create products table
      await queryRunner.createTable(
        new Table({
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
        }),
        true,
      );
    }

    // Add foreign key constraint if it doesn't exist
    const table = await queryRunner.getTable('products');
    const foreignKeyExists = table?.foreignKeys.some(
      (fk) => fk.columnNames.indexOf('categoryId') !== -1,
    );

    if (!foreignKeyExists && table) {
      await queryRunner.createForeignKey(
        'products',
        new TableForeignKey({
          columnNames: ['categoryId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'categories',
          onDelete: 'RESTRICT',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key
    const table = await queryRunner.getTable('products');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('categoryId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('products', foreignKey);
    }

    // Drop tables
    await queryRunner.dropTable('products', true);
    await queryRunner.dropTable('categories', true);
  }
}
