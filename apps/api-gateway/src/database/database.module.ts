import { DynamicModule, Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from './database.constants';

type DbOptions = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

@Global() // so you don't need to import it everywhere (research why)
@Module({})
export class DatabaseModule {
  static forRoot(options: DbOptions): DynamicModule {
    const dataSourceProvider = {
      provide: DATA_SOURCE,
      useFactory: async () => {
        const ds = new DataSource({
          type: 'postgres',
          host: options.host,
          port: options.port,
          username: options.username,
          password: options.password,
          database: options.database,

          // ✅ Register entities
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],

          // ✅ Migrations path
          migrations: [__dirname + '/../migrations/*{.ts,.js}'],
          migrationsRun: true,

          // ❌ Disable auto-sync (use migrations instead)
          synchronize: false,

          // Optional: Enable logging to see SQL queries
          logging: true,
        });

        return ds.initialize().then(async (ds) => {
          const migrationsToRun = await ds.runMigrations();
          if (migrationsToRun.length > 0) {
            console.log(
              '✅ Ran migrations:',
              migrationsToRun.map((m) => m.name),
            );
          }
          return ds;
        });
      },
    };

    return {
      module: DatabaseModule,
      providers: [dataSourceProvider],
      exports: [dataSourceProvider],
    };
  }
  // Provide repositories for entities so feature modules can inject them
  static forFeature(entities: any[]): DynamicModule {
    const providers = entities.map((entity) => ({
      provide: `${entity.name.toUpperCase()}_REPO`,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(entity),
      inject: [DATA_SOURCE],
    }));

    return {
      module: DatabaseModule,
      providers,
      exports: providers,
    };
  }
}
