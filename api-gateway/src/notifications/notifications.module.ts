import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule],
  providers: [NotificationsService],
  controllers: [],
  exports: [NotificationsService],
})
export class NotificationsModule {}
