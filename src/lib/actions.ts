'use server';

import { signIn, signOut } from '@/auth';
import { signInSchema, signUpSchema } from './validators';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from './data/client';
import { formatError } from './utils';
import { CartItem } from './types';

export async function signInWithCredentials(formData: FormData) {
  try {
    const user = signInSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error)[0] };
  }
}

export async function signOutUser() {
  await signOut();
}

export async function signUpWithCredentials(formData: FormData) {
  try {
    const user = signUpSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      confirmPassword: formData.get('confirmPassword'),
      password: formData.get('password'),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: 'User created successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: formatError(error)[0],
    };
  }
}

export async function addItemToCart(item: CartItem) {
  return {
    success: true,
    message: 'Item added to the cart',
  };
}
