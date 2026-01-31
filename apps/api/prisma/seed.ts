import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const PERMISSIONS_SPEC = [
  { resource: 'students', action: 'create' },
  { resource: 'students', action: 'read' },
  { resource: 'students', action: 'update' },
  { resource: 'students', action: 'delete' },
  { resource: 'users', action: 'create' },
  { resource: 'users', action: 'read' },
  { resource: 'users', action: 'update' },
  { resource: 'users', action: 'delete' },
  { resource: 'classes', action: 'create' },
  { resource: 'classes', action: 'read' },
  { resource: 'classes', action: 'update' },
  { resource: 'classes', action: 'delete' },
  { resource: 'payments', action: 'create' },
  { resource: 'payments', action: 'read' },
  { resource: 'payments', action: 'update' },
  { resource: 'payments', action: 'delete' },
  { resource: 'reports', action: 'read' },
  { resource: 'settings', action: 'read' },
  { resource: 'settings', action: 'update' },
];

async function seedPermissions() {
  for (const perm of PERMISSIONS_SPEC) {
    await prisma.permission.upsert({
      where: {
        resource_action: {
          resource: perm.resource,
          action: perm.action,
        },
      },
      update: {},
      create: perm,
    });
  }
  console.log('✅ Permissions created');
}

async function assignPermissionsToRoles() {
  const superAdmin = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  const admin = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const manager = await prisma.role.findUnique({ where: { name: 'MANAGER' } });
  const receptionist = await prisma.role.findUnique({ where: { name: 'RECEPTIONIST' } });
  const teacher = await prisma.role.findUnique({ where: { name: 'TEACHER' } });
  const financial = await prisma.role.findUnique({ where: { name: 'FINANCIAL' } });

  const allPermissions = await prisma.permission.findMany();

  const upsertRolePermission = async (roleId: string, permissionId: string) => {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId, permissionId },
      },
      update: {},
      create: { roleId, permissionId },
    });
  };

  // Super Admin: all permissions
  if (superAdmin) {
    for (const perm of allPermissions) {
      await upsertRolePermission(superAdmin.id, perm.id);
    }
  }

  // Admin: all except users:*
  if (admin) {
    const adminPerms = allPermissions.filter((p) => p.resource !== 'users');
    for (const perm of adminPerms) {
      await upsertRolePermission(admin.id, perm.id);
    }
  }

  // Manager: read and update only
  if (manager) {
    const managerPerms = allPermissions.filter(
      (p) => p.action === 'read' || p.action === 'update',
    );
    for (const perm of managerPerms) {
      await upsertRolePermission(manager.id, perm.id);
    }
  }

  // Receptionist: students, classes read/update/create; reports read
  if (receptionist) {
    const receptionistPerms = allPermissions.filter(
      (p) =>
        (['students', 'classes'].includes(p.resource) && ['read', 'update', 'create'].includes(p.action)) ||
        (p.resource === 'reports' && p.action === 'read'),
    );
    for (const perm of receptionistPerms) {
      await upsertRolePermission(receptionist.id, perm.id);
    }
  }

  // Teacher: classes read/update; students read
  if (teacher) {
    const teacherPerms = allPermissions.filter(
      (p) =>
        (p.resource === 'classes' && ['read', 'update'].includes(p.action)) ||
        (p.resource === 'students' && p.action === 'read'),
    );
    for (const perm of teacherPerms) {
      await upsertRolePermission(teacher.id, perm.id);
    }
  }

  // Financial: payments, reports read; settings read
  if (financial) {
    const financialPerms = allPermissions.filter(
      (p) =>
        (p.resource === 'payments' && p.action === 'read') ||
        (p.resource === 'reports' && p.action === 'read') ||
        (p.resource === 'settings' && p.action === 'read'),
    );
    for (const perm of financialPerms) {
      await upsertRolePermission(financial.id, perm.id);
    }
  }

  console.log('✅ Permissions assigned to roles');
}

async function main() {
  console.log('🌱 Seeding database...');

  // Create roles
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Full system access' },
    { name: 'ADMIN', description: 'Administrator' },
    { name: 'MANAGER', description: 'Manager' },
    { name: 'RECEPTIONIST', description: 'Receptionist' },
    { name: 'TEACHER', description: 'Instructor' },
    { name: 'FINANCIAL', description: 'Financial' },
  ];

  const createdRoles = [];
  for (const role of roles) {
    const created = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
    createdRoles.push(created);
  }
  console.log('✅ Roles created');

  await seedPermissions();
  await assignPermissionsToRoles();

  // Create admin user
  const passwordHash = await bcrypt.hash('Admin@123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pilates.with' },
    update: {},
    create: {
      email: 'admin@pilates.with',
      passwordHash,
      isActive: true,
    },
  });

  // Assign Super Admin role to admin user
  const superAdminRole = createdRoles.find((r) => r.name === 'SUPER_ADMIN');
  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    });
  }

  console.log('✅ Admin user created');
  console.log('   Email: admin@pilates.with');
  console.log('   Password: Admin@123');

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
