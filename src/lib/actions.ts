'use server';

import { auth, signIn, signOut } from '@/auth';
import { cartItemSchema, signInSchema, signUpSchema } from './validators';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from './data/client';
import { formatError } from './utils';
import { CartItem } from './types';
import { cookies } from 'next/headers';
import { getMyCart } from './data/query';

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
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id; 

    // Get cart
    // const cart = await getMyCart();

    // Parse and validate item 
    const cartItem = cartItemSchema.parse(item);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: cartItem.productId },
    });

    // TESTING
    console.log({
      'Session Cart ID': sessionCartId,
      'User ID': userId,
      // 'Cart': cart,
      'Item Requested': cartItem,
      'Product Found': product,
    })

    return {
      success: true,
      message: 'Item added to the cart',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error)[0],
    };
  }
}