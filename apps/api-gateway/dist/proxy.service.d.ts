import { HttpService } from '@nestjs/axios';
export declare class ProxyService {
    private http;
    constructor(http: HttpService);
    forward(options: {
        baseUrl: string;
        method: string;
        path: string;
        headers: Record<string, any>;
        query: any;
        body: any;
    }): Promise<{
        status: any;
        data: any;
        headers: any;
    }>;
}
