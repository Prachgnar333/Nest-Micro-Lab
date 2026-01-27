import { SetMetadata } from '@nestjs/common';

export const NOTIFY_METADATA_KEY = 'notify:config';

export interface NotifyConfig {
  featureName: string;
  event: string;
  payloadBuilder?: (result: any, args: any[]) => any;
}

export const Notify = (config: NotifyConfig) =>
  SetMetadata(NOTIFY_METADATA_KEY, config);
