import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationsService } from '../notifications.service';
import {
  NOTIFY_METADATA_KEY,
  NotifyConfig,
} from '../decorators/notify.decorator';

@Injectable()
export class NotifyInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly notificationService: NotificationsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Get the @Notify() metadata from the method
    const notifyConfig = this.reflector.get<NotifyConfig>(
      NOTIFY_METADATA_KEY,
      context.getHandler(),
    );

    // If no @Notify() decorator, just continue
    if (!notifyConfig) {
      return next.handle();
    }

    // Execute the method and send notification after
    return next.handle().pipe(
      tap((result) => {
        const { featureName, event, payloadBuilder } = notifyConfig;

        // Build payload - use custom builder or default to result
        const payload = payloadBuilder
          ? payloadBuilder(result, context.getArgs())
          : result;

        // Send notification
        this.notificationService.notify(featureName, event, payload);
      }),
    );
  }
}
