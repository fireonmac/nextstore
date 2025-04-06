/************************************************************************
 * App configuration
 ************************************************************************/
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Nextstore';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'Ecommerce store built with Next.js';
export const SERVER_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/***********************************************************************
 * Product
 *************************************************************************/
export const LATEST_PRODUCTS_LIMIT = 4;

/************************************************************************
 * User
 ************************************************************************/
export const DEFAULT_USER_NAME = 'NO_NAME'; // defined in schema.prisma

/************************************************************************
 * Cart
 ***********************************************************************/
export const SHIPPING_COST = 10;
export const SHIPPING_THRESHOLD = 100; // Free shipping threshold
export const TAX_RATE = 0.15; // 15% tax rate
