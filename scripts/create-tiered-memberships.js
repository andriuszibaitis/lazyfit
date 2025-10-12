const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Creating tiered membership plans...');

    // Delete existing memberships first
    await prisma.membership.deleteMany();
    console.log('Deleted existing memberships');

    // Create 1-month plan (no discount)
    const oneMonth = await prisma.membership.create({
      data: {
        name: 'Mėnesio išūkis',
        planId: 'menesio-isukis',
        price: 59.99,
        discountPercentage: 0,
        duration: 30,
        description: 'Vieno mėnesio narystė be įsipareigojimų',
        features: JSON.stringify([
          'Visos online treniruotės',
          'Mitybos planai',
          'Mokymai apie mytybą ir sportą',
          'Prieiga 31 dienų nuo aktyvacijos momento.',
          'Prieigos stabdymas iki 7 dienų.',
          'Nėra galimybės keisti plano.'
        ]),
        isActive: true,
        showOnHomepage: true
      }
    });

    // Create 3-month plan (25% discount)
    const threeMonths = await prisma.membership.create({
      data: {
        name: 'Įpročių kūrimas',
        planId: 'iprociu-kurimas',
        price: 47.99,
        discountPercentage: 25,
        duration: 90,
        description: 'Trijų mėnesių narystė su 25% nuolaida',
        features: JSON.stringify([
          'Visos online treniruotės',
          'Mitybos planai',
          'Mokymai apie mytybą ir sportą',
          'Rinkis bet kurį planą kiekvieną mėnesį.',
          'Laikinas pristabdymas ligos ar kitu atveju.',
          'Nutrauk bet kada be jokių papildomų mokesčių.'
        ]),
        isActive: true,
        showOnHomepage: true
      }
    });

    // Create 6-month plan (30% discount)
    const sixMonths = await prisma.membership.create({
      data: {
        name: 'Gyvenimo pokytis',
        planId: 'gyvenimo-pokytis',
        price: 41.99,
        discountPercentage: 30,
        duration: 180,
        description: 'Šešių mėnesių narystė su 30% nuolaida',
        features: JSON.stringify([
          'Visos online treniruotės',
          'Mitybos planai',
          'Mokymai apie mytybą ir sportą',
          'Rinkis bet kurį planą kiekvieną mėnesį.',
          'Laikinas pristabdymas ligos ar kitu atveju.',
          'Nutrauk bet kada be jokių papildomų mokesčių.'
        ]),
        isActive: true,
        showOnHomepage: true
      }
    });

    console.log('Created memberships:');
    console.log(`1-month: ${oneMonth.name} - ${oneMonth.price}€/month (${oneMonth.discountPercentage}% discount)`);
    console.log(`3-month: ${threeMonths.name} - ${threeMonths.price}€/month (${threeMonths.discountPercentage}% discount)`);
    console.log(`6-month: ${sixMonths.name} - ${sixMonths.price}€/month (${sixMonths.discountPercentage}% discount)`);

    // Update the current user to use the 1-month plan
    const user = await prisma.user.findFirst();
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          planId: oneMonth.planId,
          membershipStatus: 'active',
          membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      });
      console.log(`Updated user ${user.email} to use 1-month plan`);
    }

    console.log('Tiered membership plans created successfully!');

  } catch (error) {
    console.error('Error creating tiered memberships:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();