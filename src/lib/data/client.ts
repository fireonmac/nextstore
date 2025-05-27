import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';
import { CartItem, ShippingAddress } from '../types';

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const pool = new Pool({ connectionString });

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon(pool);

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    user: {
      address: {
        compute(user) {
          // TODO: Refactor to store address in a separate table instead of JSON
          return (
            typeof user.address === 'string'
              ? JSON.parse(user.address)
              : user.address
          ) as ShippingAddress;
        },
      },
    },
    product: {
      price: {
        compute(product) {
          return product.price.toNumber();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toNumber();
        },
      },
    },
    cart: {
      items: {
        compute(cart) {
          return cart.items as CartItem[];
        },
      },
      itemsPrice: {
        compute(cart) {
          return cart.itemsPrice.toNumber();
        },
      },
      shippingPrice: {
        compute(cart) {
          return cart.shippingPrice.toNumber();
        },
      },
      taxPrice: {
        compute(cart) {
          return cart.taxPrice.toNumber();
        },
      },
      totalPrice: {
        compute(cart) {
          return cart.totalPrice.toNumber();
        },
      },
    },
  },
});
