import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user-role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Role } from '../entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,

    @InjectRepository(User)
    private readonly users: Repository<User>,

    @InjectRepository(UserRole)
    private readonly userRoles: Repository<UserRole>,

    @InjectRepository(RolePermission)
    private readonly rolePerms: Repository<RolePermission>,

    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,

    @InjectRepository(Role)
    private readonly roles: Repository<Role>,
  ) {}

  // ===== REGISTER =====
  async register(email: string, password: string) {
    // ✅ Check if email exists
    const existing = await this.users.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    // ✅ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = this.users.create({
      email,
      passwordHash,
      isActive: true,
    });
    await this.users.save(user);

    // ✅ Attach default role "user"
    let userRole = await this.roles.findOne({ where: { name: 'user' } });
    
    // If role doesn't exist, create it
    if (!userRole) {
      userRole = this.roles.create({ name: 'user' });
      await this.roles.save(userRole);
    }

    const userRoleAssignment = this.userRoles.create({
      user: user,
      role: userRole,
    });
    await this.userRoles.save(userRoleAssignment);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  // ===== LOGIN =====
  async login(email: string, password: string) {
    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // Fetch roles
    const roles = await this.userRoles.find({
      where: { user: { id: user.id } },
      relations: { role: true, user: true },
    });
    const roleNames = roles.map((r) => r.role.name);

    // Fetch permissions via roles
    const roleIds = roles.map((r) => r.role.id);
    let permissionKeys: string[] = [];

    if (roleIds.length > 0) {
      const perms = await this.rolePerms
        .createQueryBuilder('rp')
        .leftJoinAndSelect('rp.permission', 'permission')
        .where('rp.roleId IN (:...roleIds)', { roleIds })
        .getMany();

      permissionKeys = [...new Set(perms.map((x) => x.permission.key))];
    }

    // ✅ Sign access token
    const accessToken = await this.jwt.signAsync(
      {
        sub: user.id,
        email: user.email,
        roles: roleNames,
        permissions: permissionKeys,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRATION ?? '15m',
      },
    );

    // ✅ Generate refresh token
    const refreshToken = randomBytes(48).toString('hex');
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // ✅ Store refresh token hash in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const tokenEntity = this.refreshTokens.create({
      user: user,
      tokenHash: refreshTokenHash,
      expiresAt,
      revokedAt: null,
    });
    await this.refreshTokens.save(tokenEntity);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        roles: roleNames,
        permissions: permissionKeys,
      },
    };
  }

  // ===== REFRESH TOKEN =====
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    // Find all non-revoked, non-expired refresh tokens
    const storedTokens = await this.refreshTokens.find({
      where: { revokedAt: null },
      relations: { user: true },
    });

    // Check each token hash
    let matchedToken: RefreshToken | null = null;
    for (const token of storedTokens) {
      const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
      if (isMatch) {
        matchedToken = token;
        break;
      }
    }

    if (!matchedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if expired
    if (new Date() > matchedToken.expiresAt) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = matchedToken.user;

    // Fetch roles and permissions
    const roles = await this.userRoles.find({
      where: { user: { id: user.id } },
      relations: { role: true },
    });
    const roleNames = roles.map((r) => r.role.name);

    const roleIds = roles.map((r) => r.role.id);
    let permissionKeys: string[] = [];

    if (roleIds.length > 0) {
      const perms = await this.rolePerms
        .createQueryBuilder('rp')
        .leftJoinAndSelect('rp.permission', 'permission')
        .where('rp.roleId IN (:...roleIds)', { roleIds })
        .getMany();

      permissionKeys = [...new Set(perms.map((x) => x.permission.key))];
    }

    // ✅ Issue new access token
    const accessToken = await this.jwt.signAsync(
      {
        sub: user.id,
        email: user.email,
        roles: roleNames,
        permissions: permissionKeys,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRATION ?? '15m',
      },
    );

    // ✅ Optional: Rotate refresh token (best practice)
    // Revoke old token
    matchedToken.revokedAt = new Date();
    await this.refreshTokens.save(matchedToken);

    // Issue new refresh token
    const newRefreshToken = randomBytes(48).toString('hex');
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const newTokenEntity = this.refreshTokens.create({
      user: user,
      tokenHash: newRefreshTokenHash,
      expiresAt,
      revokedAt: null,
    });
    await this.refreshTokens.save(newTokenEntity);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        roles: roleNames,
        permissions: permissionKeys,
      },
    };
  }

  // ===== LOGOUT =====
  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    // Find and revoke the refresh token
    const storedTokens = await this.refreshTokens.find({
      where: { revokedAt: null },
    });

    for (const token of storedTokens) {
      const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
      if (isMatch) {
        token.revokedAt = new Date();
        await this.refreshTokens.save(token);
        return { message: 'Logged out successfully' };
      }
    }

    // Token not found or already revoked
    return { message: 'Logged out successfully' };
  }

  // ===== GET CURRENT USER =====
  async getMe(userId: number) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Fetch roles
    const roles = await this.userRoles.find({
      where: { user: { id: userId } },
      relations: { role: true },
    });
    const roleNames = roles.map((r) => r.role.name);

    // Fetch permissions
    const roleIds = roles.map((r) => r.role.id);
    let permissionKeys: string[] = [];

    if (roleIds.length > 0) {
      const perms = await this.rolePerms
        .createQueryBuilder('rp')
        .leftJoinAndSelect('rp.permission', 'permission')
        .where('rp.roleId IN (:...roleIds)', { roleIds })
        .getMany();

      permissionKeys = [...new Set(perms.map((x) => x.permission.key))];
    }

    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      roles: roleNames,
      permissions: permissionKeys,
    };
  }

  // ===== VALIDATE USER (for JwtStrategy) =====
  async validateUser(userId: number) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user || !user.isActive) {
      return null;
    }
    return user;
  }
}