const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Find the first user
    const user = await prisma.user.findFirst();

    if (!user) {
      console.log('No users found in database');
      return;
    }

    console.log(`Adding sample invoices for user: ${user.email}`);

    // Create sample invoices
    const invoices = [
      {
        userId: user.id,
        invoiceNumber: 'INV-2025-002',
        date: new Date('2025-02-17'),
        amount: 59.99,
        currency: 'EUR',
        status: 'paid',
        description: 'Mėnesio išūkis',
        membershipName: 'Mėnesio išūkis'
      },
      {
        userId: user.id,
        invoiceNumber: 'INV-2025-001',
        date: new Date('2025-03-19'),
        amount: 41.99,
        currency: 'EUR',
        status: 'paid',
        description: 'Gyvenimo pokytis',
        membershipName: 'Gyvenimo pokytis'
      }
    ];

    for (const invoiceData of invoices) {
      const existingInvoice = await prisma.invoice.findUnique({
        where: { invoiceNumber: invoiceData.invoiceNumber }
      });

      if (!existingInvoice) {
        await prisma.invoice.create({
          data: invoiceData
        });
        console.log(`Created invoice: ${invoiceData.invoiceNumber}`);
      } else {
        console.log(`Invoice already exists: ${invoiceData.invoiceNumber}`);
      }
    }

    console.log('Sample invoices added successfully!');
  } catch (error) {
    console.error('Error adding sample invoices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();