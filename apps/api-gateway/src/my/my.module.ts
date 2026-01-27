import { Module, DynamicModule } from '@nestjs/common';
export interface MyModuleOptions {
  apiKey: string;
}
@Module({})
export class MyModule {
  static register(options: MyModuleOptions): DynamicModule {
    return {
      module: MyModule,
      providers: [{ provide: 'OPTIONS', useValue: options }],
      exports: ['OPTIONS'],
    };
  }
}
