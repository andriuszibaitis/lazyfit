const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Creating admin user...');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'admin'
      }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@lazyfit.lt',
        hashedPassword: hashedPassword,
        role: 'admin',
        provider: 'credentials',
        emailVerified: new Date(),
        membershipStatus: 'active',
        planId: 'gyvenimo-pokytis', // 6-month plan
        membershipExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 180 days from now
      }
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@lazyfit.lt');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('User ID:', adminUser.id);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();