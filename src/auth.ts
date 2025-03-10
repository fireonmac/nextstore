import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compareSync } from 'bcrypt-ts-edge';
import { prisma } from '@/lib/data/client';
import Credentials from 'next-auth/providers/credentials';
import { getUserByEmail } from './lib/data/query';
import { ZodError } from 'zod';
import { signInSchema } from './lib/validators';

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // Find user in database
          const user = await getUserByEmail(email);
          // Check if user exists and password is correct
          if (user && user.password) {
            const isMatch = compareSync(password, user.password);
            // If password is correct, return user object
            if (isMatch) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              };
            }
          }
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }

        return null;
      },
    }),
  ],
});
