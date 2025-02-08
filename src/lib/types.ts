import { Prisma } from '@prisma/client';
import { prisma } from './data/client';

export type Product = Prisma.Result<
  typeof prisma.product,
  {},
  'findFirstOrThrow'
>;
