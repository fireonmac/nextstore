'use client';

import { signUpWithCredentials } from '@/lib/actions';
import { Button } from '@/lib/components/ui/button';
import { Input } from '@/lib/components/ui/input';
import { Label } from '@/lib/components/ui/label';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';

function signUpFormAction(prevState: unknown, formData: FormData) {
  return signUpWithCredentials(formData);
}

const CredentialsSignUpForm = () => {
  const [state, action, isPending] = useActionState(signUpFormAction, {
    message: '',
    success: false,
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <form action={action}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            required
            defaultValue=""
          />
        </div>

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

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="confirmPassword"
            required
            defaultValue=""
          />
        </div>

        <Button className="w-full" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Sign Up'}
        </Button>

        {state && !state.success && (
          <p className="text-center text-destructive text-sm">
            {state.message}
          </p>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href={`/sign-in?callbackUrl=${callbackUrl}`} target="_self">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};
export default CredentialsSignUpForm;
