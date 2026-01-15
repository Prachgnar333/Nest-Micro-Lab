import { AuthServiceService } from './auth-service.service';
export declare class AuthServiceController {
    private readonly authServiceService;
    constructor(authServiceService: AuthServiceService);
    getHello(): string;
}
