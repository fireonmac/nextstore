import { Prisma } from '@prisma/client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ZodError } from 'zod';
import { capitalize } from 'lodash-es';
import { CartItem } from './types';
import { SHIPPING_COST, SHIPPING_THRESHOLD, TAX_RATE } from './constants';

/***********************************************************************
 * Styles
 ***********************************************************************/
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/***********************************************************************
 * String or number formatting
 ***********************************************************************/
// Format number with decimal places
// - 49 becomes "49.00".
// - 49.9 becomes "49.90".
export function formatNumberWithDecimal(num: string): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

export function round2(value: number | string): number {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }

  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/***********************************************************************
 * Authentication
 ***********************************************************************/
export function saltAndHashPassword(password: string): string {
  return password;
}

/***********************************************************************
 * Error handling
 ***********************************************************************/
export function formatError(error: unknown): string[] {
  if (error instanceof Error) {
    // Handle Zod error
    if (error instanceof ZodError) {
      return error.errors.map((e) => e.message);
    }

    // Handle Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          const field =
            error.meta?.target && error.meta.target instanceof Array
              ? error.meta.target[0]
              : 'Field';
          return [`${capitalize(field)} already exists`];
        }
        default: {
          return [error.message];
        }
      }
    }
  }

  // Handle unusual errors
  if (typeof error === 'string') {
    return [error];
  } else {
    return ['An unexpected error occurred'];
  }
}

/**********************************************************************
 * Cart
 **********************************************************************/
export function calcPrice(items: CartItem[]) {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
  );
  const shippingPrice = round2(
    itemsPrice > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  );
  
  const taxPrice = round2(TAX_RATE * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
}
