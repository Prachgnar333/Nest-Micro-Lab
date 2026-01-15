import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { RbacModule } from '../rbac/rbac.module';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { UserRole } from '../entities/user-role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

@Module({
  imports: [
    // ✅ Register TypeORM entities
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      UserRole,
      RolePermission,
      RefreshToken,
    ]),

    // ✅ Register Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // ✅ Register JWT Module
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'default-secret',
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
      },
    }),

    UsersModule,
    RbacModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // ✅ Register JWT strategy
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}