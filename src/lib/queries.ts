import { prisma } from './data/client';
import { Product } from './types';
import { User } from 'next-auth';
import { cookies } from 'next/headers';
import { auth } from '@/auth';

// Product queries
// -------------------------------------------------------------
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

export const getProductById = async (id: Product['id']) => {
  return prisma.product.findFirst({ where: { id } });
};

// User queries
// -------------------------------------------------------------
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

export const getUserById = async (id: User['id']) => {
  const user = await prisma.user.findFirst({
    where: { id },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// Cart queries
// -------------------------------------------------------------
export const getMyCart = async () => {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  return cart;
};
