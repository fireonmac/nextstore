import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from './data/client';

export type Product = Prisma.Result<
  typeof prisma.product,
  null,
  'findFirstOrThrow'
>;
export type User = Prisma.Result<typeof prisma.user, null, 'findFirstOrThrow'>;
export type Cart = Prisma.Result<typeof prisma.cart, null, 'findFirstOrThrow'>;
export type CartItem = z.infer<typeof cartItemSchema>;

declare module 'next-auth' {
  interface User {
    role?: string;
  }
}

import { JWT } from 'next-auth/jwt';
import { cartItemSchema } from './validators';

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id?: string;
    role?: string;
  }
}
