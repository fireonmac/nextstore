import { prisma } from './client';
import { Product } from '../types';
import { User } from 'next-auth';

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

export const getUserByEmail = async (email: User['email']) => {
  if (!email) {
    return null;
  }

  return prisma.user.findFirst({
    where: {
      email,
    },
  });
};
