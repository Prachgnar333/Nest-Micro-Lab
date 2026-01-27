import { DynamicModule } from '@nestjs/common';
import { NotificationModuleOptions, NotificationFeatureOptions } from './interfaces';
export declare class NotificationsModule {
    private static features;
    static forRoot(options: NotificationModuleOptions): DynamicModule;
    static forFeature(feature: NotificationFeatureOptions): DynamicModule;
}
