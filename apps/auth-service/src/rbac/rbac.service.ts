import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { UserRole } from '../entities/user-role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
    @InjectRepository(RolePermission)
    private rolePermissionsRepository: Repository<RolePermission>,
  ) {}

  // ===== Role Management =====
  async createRole(name: string): Promise<Role> {
    const role = this.rolesRepository.create({ name });
    return this.rolesRepository.save(role);
  }

  async findRoleByName(name: string): Promise<Role | null> {
    return this.rolesRepository.findOne({ where: { name } });
  }

  async findOrCreateRole(name: string): Promise<Role> {
    let role = await this.findRoleByName(name);
    if (!role) {
      role = await this.createRole(name);
    }
    return role;
  }

  // ===== Permission Management =====
  async createPermission(key: string): Promise<Permission> {
    const permission = this.permissionsRepository.create({ key });
    return this.permissionsRepository.save(permission);
  }

  async findPermissionByKey(key: string): Promise<Permission | null> {
    return this.permissionsRepository.findOne({ where: { key } });
  }

  async findOrCreatePermission(key: string): Promise<Permission> {
    let permission = await this.findPermissionByKey(key);
    if (!permission) {
      permission = await this.createPermission(key);
    }
    return permission;
  }

  // ===== User-Role Assignment =====
  async assignRoleToUser(user: User, role: Role): Promise<UserRole> {
    // Check if assignment already exists
    const existing = await this.userRolesRepository.findOne({
      where: {
        user: { id: user.id },
        role: { id: role.id },
      },
    });

    if (existing) {
      return existing;
    }

    const userRole = this.userRolesRepository.create({ user, role });
    return this.userRolesRepository.save(userRole);
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    const userRoles = await this.userRolesRepository.find({
      where: { user: { id: userId } },
      relations: { role: true },
    });
    return userRoles.map((ur) => ur.role);
  }

  // ===== Role-Permission Assignment =====
  async assignPermissionToRole(
    role: Role,
    permission: Permission,
  ): Promise<RolePermission> {
    // Check if assignment already exists
    const existing = await this.rolePermissionsRepository.findOne({
      where: {
        role: { id: role.id },
        permission: { id: permission.id },
      },
    });

    if (existing) {
      return existing;
    }

    const rolePermission = this.rolePermissionsRepository.create({
      role,
      permission,
    });
    return this.rolePermissionsRepository.save(rolePermission);
  }

  async getRolePermissions(roleId: number): Promise<Permission[]> {
    const rolePermissions = await this.rolePermissionsRepository.find({
      where: { role: { id: roleId } },
      relations: { permission: true },
    });
    return rolePermissions.map((rp) => rp.permission);
  }

  // ===== Get User Permissions (through roles) =====
  async getUserPermissions(userId: number): Promise<string[]> {
    const roles = await this.getUserRoles(userId);
    const permissionSets = await Promise.all(
      roles.map((role) => this.getRolePermissions(role.id)),
    );

    const permissions = permissionSets.flat();

    // Remove duplicates and return just the keys
    return Array.from(new Set(permissions.map((p) => p.key)));
  }

  // ===== Check if user has specific role =====
  async userHasRole(userId: number, roleName: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.some((role) => role.name === roleName);
  }

  // ===== Check if user has specific permission =====
  async userHasPermission(
    userId: number,
    permissionKey: string,
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(permissionKey);
  }
}