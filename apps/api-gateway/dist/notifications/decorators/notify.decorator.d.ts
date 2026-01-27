export declare const NOTIFY_METADATA_KEY = "notify:config";
export interface NotifyConfig {
    featureName: string;
    event: string;
    payloadBuilder?: (result: any, args: any[]) => any;
}
export declare const Notify: (config: NotifyConfig) => import("@nestjs/common").CustomDecorator<string>;
