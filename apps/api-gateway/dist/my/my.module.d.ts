import { DynamicModule } from '@nestjs/common';
export interface MyModuleOptions {
    apiKey: string;
}
export declare class MyModule {
    static register(options: MyModuleOptions): DynamicModule;
}
