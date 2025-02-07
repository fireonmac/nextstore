import sampleData from "./sample-data";
import { prisma } from "./client";

const main = async () => {
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: sampleData.products,
  });

  console.log("sampleData was seeded successfully.");
};

main();
