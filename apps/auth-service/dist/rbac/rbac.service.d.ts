import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { UserRole } from '../entities/user-role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { User } from '../entities/user.entity';
export declare class RbacService {
    private rolesRepository;
    private permissionsRepository;
    private userRolesRepository;
    private rolePermissionsRepository;
    constructor(rolesRepository: Repository<Role>, permissionsRepository: Repository<Permission>, userRolesRepository: Repository<UserRole>, rolePermissionsRepository: Repository<RolePermission>);
    createRole(name: string): Promise<Role>;
    findRoleByName(name: string): Promise<Role | null>;
    findOrCreateRole(name: string): Promise<Role>;
    createPermission(key: string): Promise<Permission>;
    findPermissionByKey(key: string): Promise<Permission | null>;
    findOrCreatePermission(key: string): Promise<Permission>;
    assignRoleToUser(user: User, role: Role): Promise<UserRole>;
    getUserRoles(userId: number): Promise<Role[]>;
    assignPermissionToRole(role: Role, permission: Permission): Promise<RolePermission>;
    getRolePermissions(roleId: number): Promise<Permission[]>;
    getUserPermissions(userId: number): Promise<string[]>;
    userHasRole(userId: number, roleName: string): Promise<boolean>;
    userHasPermission(userId: number, permissionKey: string): Promise<boolean>;
}
