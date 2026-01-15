import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            roles: string[];
            permissions: string[];
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            roles: string[];
            permissions: string[];
        };
    }>;
    logout(dto: RefreshTokenDto): Promise<{
        message: string;
    }>;
    getMe(user: any): Promise<{
        id: number;
        email: string;
        isActive: boolean;
        roles: string[];
        permissions: string[];
    }>;
    ping(): {
        message: string;
        timestamp: Date;
    };
}
