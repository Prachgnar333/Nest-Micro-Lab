import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Role } from '../entities/role.entity';
export declare class AuthService {
    private readonly jwt;
    private readonly users;
    private readonly userRoles;
    private readonly rolePerms;
    private readonly refreshTokens;
    private readonly roles;
    constructor(jwt: JwtService, users: Repository<User>, userRoles: Repository<UserRole>, rolePerms: Repository<RolePermission>, refreshTokens: Repository<RefreshToken>, roles: Repository<Role>);
    register(email: string, password: string): Promise<{
        message: string;
        user: {
            id: number;
            email: string;
        };
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            roles: string[];
            permissions: string[];
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            roles: string[];
            permissions: string[];
        };
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
    getMe(userId: number): Promise<{
        id: number;
        email: string;
        isActive: boolean;
        roles: string[];
        permissions: string[];
    }>;
    validateUser(userId: number): Promise<User>;
}
