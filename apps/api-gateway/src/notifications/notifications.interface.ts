export type NotificationChannel = 'log' | 'email' | 'sms' | 'telegram';

export interface NotificationModuleOptions {
  appName: string;
  defaultChannel: NotificationChannel;
  enable: boolean;
}

export interface NotificationFeatureOptions {
  featureName: string;
  prefix?: string;
  channels?: NotificationChannel[];
  enable?: boolean;
}
