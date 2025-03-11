'use client';

import { signInWithCredentials } from '@/lib/actions';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { Label } from '@/lib/components/ui/label';
import Link from 'next/link';
import { useActionState } from 'react';

function signInFormAction(prevState: unknown, formData: FormData) {
  return signInWithCredentials(formData);
}

const CredentialsSignInForm = () => {
  const [state, action, isPending] = useActionState(signInFormAction, {
    message: '',
    success: false,
  });

  return (
    <form action={action}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            defaultValue=""
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            autoComplete="password"
            required
            defaultValue=""
          />
        </div>

        <Button className="w-full" disabled={isPending}>
          {isPending ? 'Signing In...' : 'Sign In'}
        </Button>

        {state && !state.success && (
          <p className="text-center text-destructive text-sm">{state.message}</p>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/sign-up" target="_self">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
};
export default CredentialsSignInForm;
