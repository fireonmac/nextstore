import sampleData from './sample-data';
import { prisma } from './client';

const main = async () => {
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: sampleData.users,
  });
  await prisma.product.createMany({
    data: sampleData.products,
  });

  console.log('sampleData was seeded successfully.');
};

main();
