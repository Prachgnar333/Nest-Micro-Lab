import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private jwt;
    private users;
    constructor(jwt: JwtService);
    login(email: string, password: string): Promise<{
        accessToken: string;
    }>;
    getUserById(id: string): {
        id: string;
        email: string;
        roles: string[];
    };
}
