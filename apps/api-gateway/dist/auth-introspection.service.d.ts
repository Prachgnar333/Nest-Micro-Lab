import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class AuthIntrospectionService {
    private http;
    private config;
    constructor(http: HttpService, config: ConfigService);
    private get authUrl();
    extractBearerToken(authHeader?: string): string | null;
    validate(token: string): Promise<any>;
}
