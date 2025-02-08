import { prisma } from './client';

export const getLatestProducts = async (limit?: number) => {
  return prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
};
