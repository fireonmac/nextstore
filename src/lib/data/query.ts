import { prisma } from './client';
import { Product } from '../types';

export const getLatestProducts = async (limit?: number) => {
  return prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
};

export const getProductBySlug = async (slug: Product['slug']) => {
  return prisma.product.findFirst({ where: { slug } });
};
