import type { NotificationFeatureOptions, NotificationModuleOptions, NotificationChannel } from './notifications.interface';
export declare class NotificationsService {
    private readonly options;
    private readonly features;
    constructor(options: NotificationModuleOptions, features: NotificationFeatureOptions[]);
    private getFeature;
    private isEnabled;
    private resolveChannels;
    notify(featureName: string, event: string, payload: any): {
        skipped: boolean;
        reason: string;
        ok?: undefined;
        channels?: undefined;
        featureName?: undefined;
        event?: undefined;
    } | {
        ok: boolean;
        channels: NotificationChannel[];
        featureName: string;
        event: string;
        skipped?: undefined;
        reason?: undefined;
    };
}
