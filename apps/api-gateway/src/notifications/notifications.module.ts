import { DynamicModule, Global, Module } from '@nestjs/common';
import { NOTIFICATION_OPTIONS, NOTIFICATION_FEATURES } from './constants';
import {
  NotificationModuleOptions,
  NotificationFeatureOptions,
} from './interfaces';
import { NotificationsService } from './notifications.service';
import { NotifyInterceptor } from './interceptors/notify.interceptor';

@Global()
@Module({})
export class NotificationsModule {
  private static features: NotificationFeatureOptions[] = [];

  static forRoot(options: NotificationModuleOptions): DynamicModule {
    NotificationsModule.features = [];

    return {
      module: NotificationsModule,
      providers: [
        {
          provide: NOTIFICATION_OPTIONS,
          useValue: options,
        },
        {
          provide: NOTIFICATION_FEATURES,
          useFactory: () => NotificationsModule.features,
        },
        NotificationsService,
        NotifyInterceptor, // ✅ Add interceptor
      ],
      exports: [NotificationsService, NotifyInterceptor], // ✅ Export interceptor
    };
  }

  static forFeature(feature: NotificationFeatureOptions): DynamicModule {
    NotificationsModule.features.push(feature);

    return {
      module: NotificationsModule,
      providers: [],
      exports: [],
    };
  }
}
