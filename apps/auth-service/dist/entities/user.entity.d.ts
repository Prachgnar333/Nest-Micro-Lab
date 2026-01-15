import { UserRole } from './user-role.entity';
import { RefreshToken } from './refresh-token.entity';
export declare class User {
    id: number;
    email: string;
    passwordHash: string;
    isActive: boolean;
    roles: UserRole[];
    refreshTokens: RefreshToken[];
    createdAt: Date;
}
