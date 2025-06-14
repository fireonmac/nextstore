import { Button } from "@/lib/components/ui/button";
import Link from "next/link";

const RootNotFound = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center px-6 py-24 sm:py-64 lg:px-8">
      <p className="text-base/8 font-semibold text-primary">404</p>
      <h1 className="mt-4 text-pretty text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
        Page not found
      </h1>
      <p className="mt-6 text-pretty text-lg font-medium text-muted-foreground sm:text-xl/8">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="mt-10">
        <Link href="/" className="text-sm/7 font-semibold text-primary">
          <Button variant="secondary">
            <span aria-hidden="true">&larr;</span> Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default RootNotFound;
