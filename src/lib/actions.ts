'use server';

import { auth, signIn, signOut } from '@/auth';
import {
  cartItemSchema,
  insertCartSchema,
  signInSchema,
  signUpSchema,
} from './validators';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from './data/client';
import { calcPrice, formatError } from './utils';
import { CartItem } from './types';
import { cookies } from 'next/headers';
import { getMyCart, getProductById } from './queries';
import { revalidatePath } from 'next/cache';

/********************************************************************
 * Authentication
 ********************************************************************/
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

/********************************************************************
 * Cart
 ********************************************************************/
export async function addItemToCart(data: CartItem) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id;

    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await getProductById(item.productId);
    if (!product) throw new Error('Product not found');

    // Get cart
    const cart = await getMyCart();

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId,
        sessionCartId,
        items: [item],
        ...calcPrice([item]),
      });

      // Add to database
      await prisma.cart.create({ data: newCart });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: 'Item added to the cart successfully',
      };
    } else {
      // Check for existing item in cart
      const existingItem = cart.items.find(
        (item) => item.productId === data.productId
      );

      // If not enough stock, throw error
      if (existingItem) {
        if (product.stock < existingItem.quantity + 1) {
          throw new Error('Not enough stock');
        }

        // Increase quantity of existing item
        existingItem.quantity += 1;
      } else {
        if (product.stock < 1) throw new Error('Not enough stock');
        cart.items.push(item);
      }

      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existingItem ? 'updated in' : 'added to'
        } cart successfully`,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: formatError(error)[0],
    };
  }
}

export async function removeItemFromCart(productId: CartItem['productId']) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart Session not found');

    // Get product
    const product = await getProductById(productId);
    if (!product) throw new Error('Product not found');

    // Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );
    if (!existingItem) throw new Error('Item not found in cart');

    // Check if cart has only one item
    if (existingItem.quantity === 1) {
      // Remove item from cart
      cart.items = cart.items.filter((item) => item.productId !== productId);
    } else {
      // Decrease quantity of existing item
      existingItem.quantity -= 1;
    }

    // Update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calcPrice(cart.items),
      },
    });

    // Revalidate product page
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} ${
        cart.items.find((item) => item.productId === productId)
          ? 'updated in'
          : 'removed from'
      } cart successfully`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
