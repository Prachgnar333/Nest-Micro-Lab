import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from './proxy.service';
import { AuthIntrospectionService } from './auth-introspection.service';
export declare class GatewayController {
    private config;
    private proxy;
    private auth;
    private logger;
    constructor(config: ConfigService, proxy: ProxyService, auth: AuthIntrospectionService);
    routeAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    private resolveRoute;
}
