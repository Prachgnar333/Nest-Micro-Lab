import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { NotificationsService } from '../notifications.service';
export declare class NotifyInterceptor implements NestInterceptor {
    private readonly reflector;
    private readonly notificationService;
    constructor(reflector: Reflector, notificationService: NotificationsService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
