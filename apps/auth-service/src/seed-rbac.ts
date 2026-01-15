import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RbacService } from './rbac/rbac.service';

async function seedRBAC() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const rbacService = app.get(RbacService);

  console.log('🌱 Seeding RBAC data...');

  // Create Roles
  const roleAdmin = await rbacService.findOrCreateRole('admin');
  const roleUser = await rbacService.findOrCreateRole('user');
  const roleModerator = await rbacService.findOrCreateRole('moderator');

  console.log('✅ Roles created');

  // Create Permissions
  const permOrderRead = await rbacService.findOrCreatePermission('order.read');
  const permOrderWrite = await rbacService.findOrCreatePermission('order.write');
  const permOrderDelete = await rbacService.findOrCreatePermission('order.delete');
  const permUserRead = await rbacService.findOrCreatePermission('user.read');
  const permUserWrite = await rbacService.findOrCreatePermission('user.write');

  console.log('✅ Permissions created');

  // Assign Permissions to Roles
  
  // Admin gets all permissions
  await rbacService.assignPermissionToRole(roleAdmin, permOrderRead);
  await rbacService.assignPermissionToRole(roleAdmin, permOrderWrite);
  await rbacService.assignPermissionToRole(roleAdmin, permOrderDelete);
  await rbacService.assignPermissionToRole(roleAdmin, permUserRead);
  await rbacService.assignPermissionToRole(roleAdmin, permUserWrite);

  // User gets limited permissions
  await rbacService.assignPermissionToRole(roleUser, permOrderRead);
  await rbacService.assignPermissionToRole(roleUser, permUserRead);

  // Moderator gets moderate permissions
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