import { Prisma } from '@prisma/client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ZodError } from 'zod';
import { capitalize } from 'lodash-es';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number with decimal places
// - 49 becomes "49.00".
// - 49.9 becomes "49.90".
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

export function saltAndHashPassword(password: string): string {
  return password;
}

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