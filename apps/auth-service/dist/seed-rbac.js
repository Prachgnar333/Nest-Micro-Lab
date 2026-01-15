"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const rbac_service_1 = require("./rbac/rbac.service");
async function seedRBAC() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const rbacService = app.get(rbac_service_1.RbacService);
    console.log('🌱 Seeding RBAC data...');
    const roleAdmin = await rbacService.findOrCreateRole('admin');
    const roleUser = await rbacService.findOrCreateRole('user');
    const roleModerator = await rbacService.findOrCreateRole('moderator');
    console.log('✅ Roles created');
    const permOrderRead = await rbacService.findOrCreatePermission('order.read');
    const permOrderWrite = await rbacService.findOrCreatePermission('order.write');
    const permOrderDelete = await rbacService.findOrCreatePermission('order.delete');
    const permUserRead = await rbacService.findOrCreatePermission('user.read');
    const permUserWrite = await rbacService.findOrCreatePermission('user.write');
    console.log('✅ Permissions created');
    await rbacService.assignPermissionToRole(roleAdmin, permOrderRead);
    await rbacService.assignPermissionToRole(roleAdmin, permOrderWrite);
    await rbacService.assignPermissionToRole(roleAdmin, permOrderDelete);
    await rbacService.assignPermissionToRole(roleAdmin, permUserRead);
    await rbacService.assignPermissionToRole(roleAdmin, permUserWrite);
    await rbacService.assignPermissionToRole(roleUser, permOrderRead);
    await rbacService.assignPermissionToRole(roleUser, permUserRead);
    await rbacService.assignPermissionToRole(roleModerator, permOrderRead);
    await rbacService.assignPermissionToRole(roleModerator, permOrderWrite);
    await rbacService.assignPermissionToRole(roleModerator, permUserRead);
    console.log('✅ Permissions assigned to roles');
    console.log('\n🎉 RBAC seed complete!');
    await app.close();
}
seedRBAC().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed-rbac.js.map