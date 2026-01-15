"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
const user_role_entity_1 = require("../entities/user-role.entity");
const role_permission_entity_1 = require("../entities/role-permission.entity");
let RbacService = class RbacService {
    constructor(rolesRepository, permissionsRepository, userRolesRepository, rolePermissionsRepository) {
        this.rolesRepository = rolesRepository;
        this.permissionsRepository = permissionsRepository;
        this.userRolesRepository = userRolesRepository;
        this.rolePermissionsRepository = rolePermissionsRepository;
    }
    async createRole(name) {
        const role = this.rolesRepository.create({ name });
        return this.rolesRepository.save(role);
    }
    async findRoleByName(name) {
        return this.rolesRepository.findOne({ where: { name } });
    }
    async findOrCreateRole(name) {
        let role = await this.findRoleByName(name);
        if (!role) {
            role = await this.createRole(name);
        }
        return role;
    }
    async createPermission(key) {
        const permission = this.permissionsRepository.create({ key });
        return this.permissionsRepository.save(permission);
    }
    async findPermissionByKey(key) {
        return this.permissionsRepository.findOne({ where: { key } });
    }
    async findOrCreatePermission(key) {
        let permission = await this.findPermissionByKey(key);
        if (!permission) {
            permission = await this.createPermission(key);
        }
        return permission;
    }
    async assignRoleToUser(user, role) {
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
    async getUserRoles(userId) {
        const userRoles = await this.userRolesRepository.find({
            where: { user: { id: userId } },
            relations: { role: true },
        });
        return userRoles.map((ur) => ur.role);
    }
    async assignPermissionToRole(role, permission) {
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
    async getRolePermissions(roleId) {
        const rolePermissions = await this.rolePermissionsRepository.find({
            where: { role: { id: roleId } },
            relations: { permission: true },
        });
        return rolePermissions.map((rp) => rp.permission);
    }
    async getUserPermissions(userId) {
        const roles = await this.getUserRoles(userId);
        const permissionSets = await Promise.all(roles.map((role) => this.getRolePermissions(role.id)));
        const permissions = permissionSets.flat();
        return Array.from(new Set(permissions.map((p) => p.key)));
    }
    async userHasRole(userId, roleName) {
        const roles = await this.getUserRoles(userId);
        return roles.some((role) => role.name === roleName);
    }
    async userHasPermission(userId, permissionKey) {
        const permissions = await this.getUserPermissions(userId);
        return permissions.includes(permissionKey);
    }
};
exports.RbacService = RbacService;
exports.RbacService = RbacService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(2, (0, typeorm_1.InjectRepository)(user_role_entity_1.UserRole)),
    __param(3, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RbacService);
//# sourceMappingURL=rbac.service.js.map