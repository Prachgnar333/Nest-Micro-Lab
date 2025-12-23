import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_FEATURES, NOTIFICATION_OPTIONS } from './constants';
import type {
  NotificationFeatureOptions,
  NotificationModuleOptions,
  NotificationChannel,
} from './notifications.interface'; // or './interfaces' depending on filename

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATION_OPTIONS)
    private readonly options: NotificationModuleOptions,

    @Inject(NOTIFICATION_FEATURES)
    private readonly features: NotificationFeatureOptions[],
  ) {}

  // Get feature config by name
  private getFeature(
    featureName: string,
  ): NotificationFeatureOptions | undefined {
    return this.features.find((f) => f.featureName === featureName);
  }

  // ✅ NEW: Check if notifications are enabled (global AND feature level)
  private isEnabled(feature?: NotificationFeatureOptions): boolean {
    // If global is disabled, nothing runs
    if (!this.options.enable) return false;

    // If feature explicitly sets enable to false, skip
    if (feature?.enable === false) return false;

    // Otherwise enabled
    return true;
  }

  // Resolve channels (feature override -> global default)
  private resolveChannels(
    feature?: NotificationFeatureOptions,
  ): NotificationChannel[] {
    if (feature?.channels?.length) return feature.channels;
    return [this.options.defaultChannel];
  }

  notify(featureName: string, event: string, payload: any) {
    const feature = this.getFeature(featureName);

    // ✅ NEW: Check both global and feature-level enable
    if (!this.isEnabled(feature)) {
      return {
        skipped: true,
        reason:
          feature?.enable === false
            ? `feature '${featureName}' notifications disabled`
            : 'notifications disabled globally',
      };
    }

    const channels = this.resolveChannels(feature);
    const prefix = feature?.prefix ?? `[${featureName.toUpperCase()}]`;
    const message = `${prefix} (${this.options.appName}) ${event}`;

    // For lab: only log, pretend "channels"
    for (const ch of channels) {
      console.log(`[${ch.toUpperCase()}] ${message}`, payload);
    }

    return { ok: true, channels, featureName, event };
  }
}
