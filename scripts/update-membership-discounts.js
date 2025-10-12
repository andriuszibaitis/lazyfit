const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Updating membership discounts...');

    // Update 3 months membership (Įpročių kūrimas) with 25% discount
    const threeMonthUpdate = await prisma.membership.updateMany({
      where: {
        duration: 90,  // 3 months = 90 days
        name: 'Įpročių kūrimas'
      },
      data: {
        discountPercentage: 25
      }
    });

    console.log(`Updated 3-month membership: ${threeMonthUpdate.count} records`);

    // Update 6 months membership (Gyvenimo pokytis) with 30% discount
    const sixMonthUpdate = await prisma.membership.updateMany({
      where: {
        duration: 180,  // 6 months = 180 days
        name: 'Gyvenimo pokytis'
      },
      data: {
        discountPercentage: 30
      }
    });

    console.log(`Updated 6-month membership: ${sixMonthUpdate.count} records`);

    // Keep 1 month membership (Mėnesio išūkis) with 0% discount
    const oneMonthUpdate = await prisma.membership.updateMany({
      where: {
        duration: 30,  // 1 month = 30 days
        name: 'Mėnesio išūkis'
      },
      data: {
        discountPercentage: 0
      }
    });

    console.log(`Updated 1-month membership: ${oneMonthUpdate.count} records`);

    console.log('Membership discounts updated successfully!');

    // Show updated memberships
    const updatedMemberships = await prisma.membership.findMany({
      select: {
        name: true,
        duration: true,
        discountPercentage: true,
        price: true
      },
      orderBy: {
        duration: 'asc'
      }
    });

    console.log('\nUpdated memberships:');
    updatedMemberships.forEach(m => {
      console.log(`${m.name}: ${m.duration} days, ${m.discountPercentage}% discount, ${m.price}€/month`);
    });

  } catch (error) {
    console.error('Error updating membership discounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();