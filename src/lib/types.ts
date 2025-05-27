import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from './data/client';
import {
  cartItemSchema,
  insertCartSchema,
  shippingAddressSchema,
} from './validators';

/**********************************************************************
 * Prisma Types for Models
 **********************************************************************/
export type Product = Prisma.Result<
  typeof prisma.product,
  null,
  'findFirstOrThrow'
>;
export type User = Prisma.Result<typeof prisma.user, null, 'findFirstOrThrow'>;
export type Cart = Prisma.Result<typeof prisma.cart, null, 'findFirstOrThrow'>;

/**********************************************************************
 * Zod Types for Validation or Interfaces
 * - These types are used for validating data structures before they are sent to the database or used in the application.
 * - They ensure that the data conforms to the expected format. (These types are not come from Prisma, so that this can cause issues if Prisma models or Zod schema changes.)
 **********************************************************************/
export type CartItem = z.infer<typeof cartItemSchema>;
export type InsertCart = z.infer<typeof insertCartSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

/**********************************************************************
 * Request and Response Types
 **********************************************************************/
export type ActionResult<T = void> = {
  success: boolean;
  message?: string;
  data?: T;
};

/**********************************************************************
 * Authentication
 **********************************************************************/
declare module 'next-auth' {
  interface User {
    role?: string;
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from 'next-auth/jwt';
declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id?: string;
    role?: string;
  }
}
