import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
