import { AuthService } from "./auth.service";
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    me(req: any): Promise<{
        user: any;
    }>;
}
export {};
