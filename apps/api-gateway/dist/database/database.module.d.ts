import { DynamicModule } from '@nestjs/common';
type DbOptions = {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
};
export declare class DatabaseModule {
    static forRoot(options: DbOptions): DynamicModule;
    static forFeature(entities: any[]): DynamicModule;
}
export {};
